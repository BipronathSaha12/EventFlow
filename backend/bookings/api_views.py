import json
import stripe
import logging
from django.conf import settings
from django.http import HttpResponse
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Q

from django.contrib.auth.models import User
from .models import Category, Event, Service, Booking, Notification
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    CategorySerializer,
    EventSerializer,
    ServiceSerializer,
    BookingSerializer,
    NotificationSerializer
)
from .utils import generate_qr
from .views import render_ticket_pdf, send_ticket_email

stripe.api_key = settings.STRIPE_SECRET_KEY
logger = logging.getLogger(__name__)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Event.objects.all().order_by('date', 'time')
        category_slug = self.request.query_params.get('category')
        search_query = self.request.query_params.get('search')

        if category_slug and category_slug != 'all':
            queryset = queryset.filter(category__slug=category_slug)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(location__icontains=search_query)
            )
        return queryset

class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]

class ServiceDetailView(generics.RetrieveAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]

class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        booking = serializer.save(user=self.request.user)
        generate_qr(booking)
        
        # Create pending notification
        event_name = booking.event.title if booking.event else (booking.service.name if booking.service else 'Event')
        Notification.objects.create(
            user=self.request.user,
            title=f"Booking Created: {event_name}",
            message=f"Your ticket reservation for {event_name} is created. Complete payment to secure your ticket.",
            type='ticket'
        )

class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id, user=request.user)
        if booking.paid:
            return Response({'error': 'Booking is already paid'}, status=status.HTTP_400_BAD_REQUEST)

        event_name = booking.event.title if booking.event else (booking.service.name if booking.service else 'Event Ticket')
        unit_price = booking.event.price if booking.event else (booking.service.price if booking.service else 10.0)
        quantity = booking.quantity or 1
        
        frontend_url = request.data.get('frontend_url', 'http://localhost:5173')

        if not getattr(settings, 'STRIPE_SECRET_KEY', None):
            # Bypass for local dev / testing without keys to simulate a successful payment flow
            booking.stripe_session_id = f"mock_session_{booking.id}"
            booking.save()
            mock_url = f"{frontend_url}/payment-success?session_id={booking.stripe_session_id}&booking_id={booking.id}"
            return Response({'url': mock_url, 'sessionId': booking.stripe_session_id})

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': f"{event_name} (x{quantity})",
                        },
                        'unit_amount': int(unit_price * 100),
                    },
                    'quantity': quantity,
                }],
                mode='payment',
                client_reference_id=str(booking.id),
                success_url=f"{frontend_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}&booking_id={booking.id}",
                cancel_url=f"{frontend_url}/payment-cancel",
            )
            booking.stripe_session_id = session.id
            booking.save()
            return Response({'url': session.url, 'sessionId': session.id})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConfirmPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id, user=request.user)
        if not booking.paid:
            booking.paid = True
            booking.save()
            generate_qr(booking)
            
            event_name = booking.event.title if booking.event else (booking.service.name if booking.service else 'Event')
            # Create payment notification
            Notification.objects.create(
                user=booking.user,
                title=f"Payment Confirmed: {event_name}",
                message=f"Payment successful! Your ticket for {event_name} is confirmed. Download your PDF ticket anytime.",
                type='payment'
            )
            # Try to send email asynchronously/in background
            pdf_bytes = render_ticket_pdf(booking)
            if pdf_bytes:
                send_ticket_email(booking, pdf_bytes)

        serializer = BookingSerializer(booking)
        return Response(serializer.data)

@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', None)

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            ) if endpoint_secret else stripe.Event.construct_from(
                json.loads(payload), stripe.api_key
            )
        except (ValueError, stripe.error.SignatureVerificationError):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            booking_id = session.get('client_reference_id')
            if booking_id:
                try:
                    booking = Booking.objects.get(id=booking_id)
                    booking.paid = True
                    booking.save()
                    generate_qr(booking)

                    event_name = booking.event.title if booking.event else (booking.service.name if booking.service else 'Event')
                    Notification.objects.create(
                        user=booking.user,
                        title=f"Payment Confirmed: {event_name}",
                        message=f"Payment verified via Stripe webhook! Your ticket for {event_name} is confirmed.",
                        type='payment'
                    )

                    pdf_bytes = render_ticket_pdf(booking)
                    if pdf_bytes:
                        send_ticket_email(booking, pdf_bytes)
                except Booking.DoesNotExist:
                    pass

        return Response({'status': 'success'}, status=status.HTTP_200_OK)

class VerifyTicketView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, ticket_identifier):
        # Allow looking up by ticket_uuid or numeric booking id
        booking = None
        if ticket_identifier.isdigit():
            booking = Booking.objects.filter(id=int(ticket_identifier)).first()
        
        if not booking:
            booking = Booking.objects.filter(ticket_uuid=ticket_identifier).first()

        if not booking:
            return Response({
                'is_valid': False,
                'message': 'Invalid ticket identifier or QR code.'
            }, status=status.HTTP_404_NOT_FOUND)

        event = booking.event
        service = booking.service
        event_title = event.title if event else (service.name if service else 'Event Ticket')
        event_date = str(event.date) if event else str(booking.date)
        event_location = event.location if event else 'Main Hall'

        qr_code_url = request.build_absolute_uri(booking.qr_code.url) if booking.qr_code else None

        return Response({
            'is_valid': True,
            'paid': booking.paid,
            'ticket_uuid': booking.ticket_uuid,
            'booking_id': booking.id,
            'attendee_name': booking.user.get_full_name() or booking.user.username,
            'attendee_email': booking.user.email,
            'event_title': event_title,
            'event_date': event_date,
            'event_location': event_location,
            'quantity': booking.quantity,
            'total_price': booking.total_price,
            'qr_code_url': qr_code_url,
            'download_url': f"/api/bookings/{booking.id}/ticket/"
        })

class DownloadTicketView(APIView):
    permission_classes = [permissions.AllowAny] # Allow authenticated user or token download

    def get(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id)
        # Check permissions if request user is authenticated
        if request.user.is_authenticated and booking.user != request.user and not request.user.is_staff:
            return Response({'error': 'Unauthorized to access this ticket.'}, status=status.HTTP_403_FORBIDDEN)

        if not booking.paid:
            return Response({'error': 'Please complete payment before downloading the ticket.'}, status=status.HTTP_400_BAD_REQUEST)

        pdf_bytes = render_ticket_pdf(booking)
        if not pdf_bytes:
            return Response({'error': 'Unable to generate PDF ticket.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        response = HttpResponse(pdf_bytes, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="EventFlow_Ticket_{booking.id}.pdf"'
        return response

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, notification_id):
        notification = get_object_or_404(Notification, id=notification_id, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all notifications marked as read'})

class CalendarICSView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id, user=request.user)
        event = booking.event
        title = event.title if event else "EventFlow Occasion"
        description = event.description if event else "EventFlow Ticketed Event"
        location = event.location if event else "Event Location"
        date_str = (event.date if event else booking.date).strftime("%Y%m%d")
        
        ics_content = (
            "BEGIN:VCALENDAR\r\n"
            "VERSION:2.0\r\n"
            "PRODID:-//EventFlow Ticketing Platform//EN\r\n"
            "BEGIN:VEVENT\r\n"
            f"SUMMARY:{title}\r\n"
            f"DESCRIPTION:{description}\r\n"
            f"LOCATION:{location}\r\n"
            f"DTSTART;VALUE=DATE:{date_str}\r\n"
            f"DTEND;VALUE=DATE:{date_str}\r\n"
            "STATUS:CONFIRMED\r\n"
            "END:VEVENT\r\n"
            "END:VCALENDAR\r\n"
        )
        response = HttpResponse(ics_content, content_type="text/calendar")
        response["Content-Disposition"] = f'attachment; filename="event_{booking.id}.ics"'
        return response

