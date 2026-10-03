from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Event, Service, Booking, Notification
from .utils import generate_qr

admin.site.site_header = "EventFlow Administration Dashboard"
admin.site.site_title = "EventFlow Admin Portal"
admin.site.index_title = "Event Management & Ticketing Control Panel"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon', 'description')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'date', 'time', 'location', 'available_tickets', 'total_tickets', 'image_preview')
    list_filter = ('category', 'date', 'location')
    search_fields = ('title', 'description', 'location', 'organizer')
    list_editable = ('price', 'available_tickets')

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height: 40px; border-radius: 6px;" />', obj.image.url)
        elif obj.image_url:
            return format_html('<img src="{}" style="height: 40px; border-radius: 6px;" />', obj.image_url)
        return "No Image"
    image_preview.short_description = "Preview"

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'get_event_name', 'quantity', 'total_price', 'paid', 'ticket_uuid', 'qr_code_preview', 'created_at')
    list_filter = ('paid', 'created_at', 'event__category')
    search_fields = ('id', 'user__username', 'user__email', 'ticket_uuid', 'event__title', 'service__name')
    actions = ['mark_as_paid', 'regenerate_qr_codes']

    def get_event_name(self, obj):
        return obj.event.title if obj.event else (obj.service.name if obj.service else "Event")
    get_event_name.short_description = "Event / Occasion"

    def qr_code_preview(self, obj):
        if obj.qr_code:
            return format_html('<img src="{}" style="height: 45px; border-radius: 4px;" />', obj.qr_code.url)
        return "No QR"
    qr_code_preview.short_description = "QR Ticket"

    def mark_as_paid(self, request, queryset):
        updated = queryset.update(paid=True)
        for booking in queryset:
            generate_qr(booking)
        self.message_user(request, f"{updated} bookings successfully marked as paid.")
    mark_as_paid.short_description = "Mark selected bookings as PAID"

    def regenerate_qr_codes(self, request, queryset):
        for booking in queryset:
            generate_qr(booking)
        self.message_user(request, f"QR codes regenerated for {queryset.count()} bookings.")
    regenerate_qr_codes.short_description = "Regenerate QR Codes"

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'type', 'is_read', 'created_at')
    list_filter = ('type', 'is_read', 'created_at')
    search_fields = ('title', 'message', 'user__username')

admin.site.register(Service)