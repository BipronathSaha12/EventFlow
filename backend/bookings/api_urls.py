from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .api_views import (
    UserProfileView,
    RegisterView,
    CategoryListView,
    EventListView,
    EventDetailView,
    ServiceListView,
    ServiceDetailView,
    BookingListCreateView,
    CreateCheckoutSessionView,
    ConfirmPaymentView,
    StripeWebhookView,
    VerifyTicketView,
    DownloadTicketView,
    NotificationListView,
    MarkNotificationReadView,
    CalendarICSView,
)

urlpatterns = [
    # Auth Endpoints
    path('auth/me/', UserProfileView.as_view(), name='api_user_profile'),
    path('auth/register/', RegisterView.as_view(), name='api_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Category & Event Endpoints
    path('categories/', CategoryListView.as_view(), name='api_categories'),
    path('events/', EventListView.as_view(), name='api_events'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='api_event_detail'),
    
    # Legacy Services
    path('services/', ServiceListView.as_view(), name='api_services'),
    path('services/<int:pk>/', ServiceDetailView.as_view(), name='api_service_detail'),
    
    # Bookings & Payment
    path('bookings/', BookingListCreateView.as_view(), name='api_bookings'),
    path('bookings/<int:booking_id>/create-checkout-session/', CreateCheckoutSessionView.as_view(), name='api_create_checkout_session'),
    path('bookings/<int:booking_id>/confirm-payment/', ConfirmPaymentView.as_view(), name='api_confirm_payment'),
    path('bookings/<int:booking_id>/ticket/', DownloadTicketView.as_view(), name='api_download_ticket'),
    path('bookings/<int:booking_id>/calendar-ics/', CalendarICSView.as_view(), name='api_calendar_ics'),
    
    # QR Ticket Verification
    path('tickets/verify/<str:ticket_identifier>/', VerifyTicketView.as_view(), name='api_verify_ticket'),
    
    # Notifications
    path('notifications/', NotificationListView.as_view(), name='api_notifications'),
    path('notifications/read-all/', MarkNotificationReadView.as_view(), name='api_notifications_read_all'),
    path('notifications/<int:notification_id>/read/', MarkNotificationReadView.as_view(), name='api_notification_read'),
    
    # Stripe Webhook
    path('stripe/webhook/', StripeWebhookView.as_view(), name='api_stripe_webhook'),
]

