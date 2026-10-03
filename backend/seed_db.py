import os
import django
from datetime import date, timedelta
from django.utils import timezone

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'booking_project.settings')
django.setup()

from bookings.models import Category, Event

def seed_database():
    print("Clearing old mock data...")
    # Optional: Event.objects.all().delete()
    # Optional: Category.objects.all().delete()

    print("Creating Categories...")
    tech_cat, _ = Category.objects.get_or_create(
        name="Technology & AI",
        slug="tech-ai",
        defaults={"description": "All events related to tech, software, and AI.", "icon": "laptop"}
    )
    
    music_cat, _ = Category.objects.get_or_create(
        name="Music Festivals",
        slug="music-festivals",
        defaults={"description": "Live concerts and music festivals.", "icon": "music"}
    )
    
    art_cat, _ = Category.objects.get_or_create(
        name="Art & Design",
        slug="art-design",
        defaults={"description": "Design workshops, art galleries, and exhibitions.", "icon": "palette"}
    )

    print("Creating Events...")
    today = timezone.now().date()
    
    events_data = [
        {
            "title": "Global AI Summit 2026",
            "description": "Join the world's leading experts in Artificial Intelligence to discuss the future of machine learning, neural networks, and scalable AGI.",
            "category": tech_cat,
            "date": today + timedelta(days=15),
            "time": "09:00:00",
            "location": "Moscone Center, San Francisco",
            "price": 299.99,
            "total_tickets": 500,
            "available_tickets": 500,
            "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
        },
        {
            "title": "Neon Nights Synthwave Festival",
            "description": "Experience the ultimate retro-futuristic music festival with top synthwave artists, immersive light shows, and arcade zones.",
            "category": music_cat,
            "date": today + timedelta(days=30),
            "time": "18:30:00",
            "location": "Downtown Arena, Miami",
            "price": 85.00,
            "total_tickets": 2000,
            "available_tickets": 1950,
            "image_url": "https://images.unsplash.com/photo-1470229722913-7c092dbbba3b?auto=format&fit=crop&w=800&q=80",
        },
        {
            "title": "Modern Abstract Art Exhibition",
            "description": "A curated gallery event showcasing contemporary abstract art from emerging European artists. Wine and cheese included.",
            "category": art_cat,
            "date": today + timedelta(days=7),
            "time": "14:00:00",
            "location": "The Louvre, Paris",
            "price": 45.00,
            "total_tickets": 150,
            "available_tickets": 12,
            "image_url": "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=800&q=80",
        },
        {
            "title": "React Advanced Workshop",
            "description": "A deep dive into advanced React patterns, performance optimization, and concurrent rendering features.",
            "category": tech_cat,
            "date": today + timedelta(days=20),
            "time": "10:00:00",
            "location": "Tech Hub, London",
            "price": 150.00,
            "total_tickets": 100,
            "available_tickets": 80,
            "image_url": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
        },
        {
            "title": "Classical Symphony Night",
            "description": "An evening of breathtaking classical music performed by the National Symphony Orchestra.",
            "category": music_cat,
            "date": today + timedelta(days=5),
            "time": "19:00:00",
            "location": "Royal Albert Hall, London",
            "price": 120.00,
            "total_tickets": 800,
            "available_tickets": 340,
            "image_url": "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80",
        },
        {
            "title": "Digital Illustration Masterclass",
            "description": "Learn digital painting techniques and character design from top industry professionals.",
            "category": art_cat,
            "date": today + timedelta(days=45),
            "time": "13:00:00",
            "location": "Creative Studio, Berlin",
            "price": 80.00,
            "total_tickets": 50,
            "available_tickets": 50,
            "image_url": "https://images.unsplash.com/photo-1561089287-3932e67341e3?auto=format&fit=crop&w=800&q=80",
        },
        {
            "title": "Cybersecurity Summit 2026",
            "description": "Protecting the digital frontier. Discussions on zero-trust architectures and threat modeling.",
            "category": tech_cat,
            "date": today + timedelta(days=60),
            "time": "08:30:00",
            "location": "Convention Center, Tokyo",
            "price": 400.00,
            "total_tickets": 1000,
            "available_tickets": 900,
            "image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
        },
        {
            "title": "Indie Rock Weekend",
            "description": "Two days of non-stop indie rock music featuring breakthrough bands from around the country.",
            "category": music_cat,
            "date": today + timedelta(days=12),
            "time": "16:00:00",
            "location": "Central Park, New York",
            "price": 60.00,
            "total_tickets": 5000,
            "available_tickets": 1200,
            "image_url": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80",
        }
    ]

    for data in events_data:
        event, created = Event.objects.get_or_create(
            title=data["title"],
            defaults=data
        )
        if created:
            print(f"Created Event: {event.title}")
        else:
            print(f"Event already exists: {event.title}")

    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
