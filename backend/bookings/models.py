import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, default='calendar', help_text="Lucide icon name (e.g. music, laptop, trophy, briefcase, palette)")
    description = models.TextField(blank=True, default='')

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Event(models.Model):
    title = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='events')
    description = models.TextField()
    price = models.FloatField(default=0.0)
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default='18:00:00')
    location = models.CharField(max_length=255, default='Main Convention Center')
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="Fallback external image URL")
    total_tickets = models.IntegerField(default=100)
    available_tickets = models.IntegerField(default=100)
    organizer = models.CharField(max_length=150, default='EventFlow Authorities')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.category.name})"

class Service(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.FloatField()
    image = models.ImageField(upload_to='services/', blank=True, null=True)

    def __str__(self):
        return self.name

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookings', null=True, blank=True)
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField(default=timezone.now)
    quantity = models.IntegerField(default=1)
    total_price = models.FloatField(default=0.0)
    paid = models.BooleanField(default=False)
    ticket_uuid = models.CharField(max_length=64, blank=True, null=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    stripe_session_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def save(self, *args, **kwargs):
        if not self.ticket_uuid:
            self.ticket_uuid = str(uuid.uuid4())
        if self.event and not self.total_price:
            self.total_price = self.event.price * self.quantity
        elif self.service and not self.total_price:
            self.total_price = self.service.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        event_name = self.event.title if self.event else (self.service.name if self.service else 'Event')
        return f"Booking #{self.id} - {self.user.username} ({event_name})"

class Notification(models.Model):
    TYPE_CHOICES = (
        ('payment', 'Payment Confirmation'),
        ('reminder', 'Event Reminder'),
        ('ticket', 'Ticket Status'),
        ('system', 'System Update'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='system')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"

