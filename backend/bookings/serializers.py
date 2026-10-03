from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Event, Service, Booking, Notification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class CategorySerializer(serializers.ModelSerializer):
    events_count = serializers.IntegerField(source='events.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'description', 'events_count']

class EventSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'category', 'category_id', 'description', 'price',
            'date', 'time', 'location', 'image', 'image_url', 'total_tickets',
            'available_tickets', 'organizer', 'created_at'
        ]

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all(), source='event', write_only=True, required=False
    )
    service = ServiceSerializer(read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(), source='service', write_only=True, required=False
    )
    user = UserSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'event', 'event_id', 'service', 'service_id',
            'date', 'quantity', 'total_price', 'paid', 'ticket_uuid',
            'qr_code', 'stripe_session_id', 'created_at'
        ]
        read_only_fields = ['paid', 'qr_code', 'ticket_uuid', 'total_price', 'created_at', 'user']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'title', 'message', 'type', 'is_read', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

