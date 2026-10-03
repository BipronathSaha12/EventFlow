import qrcode
from io import BytesIO
from django.core.files import File

def generate_qr(booking):
    # Target URL for mobile scanning or web verification
    verification_data = f"http://localhost:5173/verify-ticket/{booking.ticket_uuid}"
    qr_img = qrcode.make(verification_data)
    buffer = BytesIO()
    qr_img.save(buffer, format="PNG")
    buffer.seek(0)
    filename = f"ticket_qr_{booking.ticket_uuid[:8]}.png"
    booking.qr_code.save(filename, File(buffer), save=False)
    # Perform direct update on DB to avoid save() recursion
    type(booking).objects.filter(pk=booking.pk).update(qr_code=booking.qr_code.name)