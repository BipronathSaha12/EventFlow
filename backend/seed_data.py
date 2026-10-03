import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'booking_project.settings')
django.setup()

from bookings.models import Category, Event
from django.utils import timezone
import datetime

def seed():
    print("Seeding EventFlow database...")

    categories_data = [
        {"name": "Music & Concerts", "slug": "music", "icon": "music", "description": "Live concerts, music festivals, and orchestral performances."},
        {"name": "Tech & Innovation", "slug": "tech", "icon": "laptop", "description": "Developer conferences, AI summits, and startup expos."},
        {"name": "Workshops & Masterclasses", "slug": "workshops", "icon": "book-open", "description": "Hands-on learning sessions, UI/UX workshops, and coding bootcamps."},
        {"name": "Sports & Fitness", "slug": "sports", "icon": "trophy", "description": "Marathons, eSports tournaments, and yoga retreats."},
        {"name": "Business & Networking", "slug": "business", "icon": "briefcase", "description": "Corporate summits, leadership forums, and venture pitches."},
        {"name": "Arts & Culture", "slug": "arts", "icon": "palette", "description": "Art exhibitions, theater plays, and cultural galas."}
    ]

    category_objs = {}
    for cat in categories_data:
        obj, created = Category.objects.get_or_create(
            slug=cat['slug'],
            defaults={'name': cat['name'], 'icon': cat['icon'], 'description': cat['description']}
        )
        category_objs[cat['slug']] = obj

    events_data = [
        {
            "title": "Global Tech Summit 2026",
            "category": category_objs["tech"],
            "description": "Join top AI researchers, software engineers, and founders for groundbreaking keynotes and panel discussions.",
            "price": 149.99,
            "date": datetime.date(2026, 11, 15),
            "time": "09:00:00",
            "location": "Silicon Bay Convention Center, Hall A",
            "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
            "total_tickets": 500,
            "available_tickets": 420,
            "organizer": "TechFlow World"
        },
        {
            "title": "Neon Horizons Music Festival",
            "category": category_objs["music"],
            "description": "An unforgettable evening of electronic dance music, laser light shows, and world-class DJ headliners.",
            "price": 89.00,
            "date": datetime.date(2026, 10, 25),
            "time": "18:30:00",
            "location": "Grand Waterfront Amphitheater",
            "image_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
            "total_tickets": 1200,
            "available_tickets": 980,
            "organizer": "Vibe Production Studio"
        },
        {
            "title": "Full-Stack React & AI Masterclass",
            "category": category_objs["workshops"],
            "description": "Learn to integrate LLM APIs and modern design systems into React 19 apps in this intensive full-day masterclass.",
            "price": 65.50,
            "date": datetime.date(2026, 11, 2),
            "time": "10:00:00",
            "location": "Downtown Tech Hub & Online",
            "image_url": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
            "total_tickets": 80,
            "available_tickets": 35,
            "organizer": "CodeCraft Academy"
        },
        {
            "title": "International eSports Championship",
            "category": category_objs["sports"],
            "description": "Watch elite gaming teams battle live in Valorant and Counter-Strike for a \$500,000 prize pool.",
            "price": 45.00,
            "date": datetime.date(2026, 12, 10),
            "time": "14:00:00",
            "location": "Metropolis Arena",
            "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
            "total_tickets": 2000,
            "available_tickets": 1650,
            "organizer": "CyberLeague Global"
        },
        {
            "title": "Venture Capital & Startup Gala",
            "category": category_objs["business"],
            "description": "Network with top angel investors, founders, and industry leaders over a gala dinner and pitch showcase.",
            "price": 199.00,
            "date": datetime.date(2026, 11, 20),
            "time": "19:00:00",
            "location": "The Ritz Pavilion",
            "image_url": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80",
            "total_tickets": 150,
            "available_tickets": 60,
            "organizer": "Innovate Capital Network"
        },
        {
            "title": "Modern Abstract Art & Sculpture Expo",
            "category": category_objs["arts"],
            "description": "Exhibition featuring contemporary digital sculptures, immersive light installations, and gallery talks by featured artists.",
            "price": 30.00,
            "date": datetime.date(2026, 10, 30),
            "time": "11:00:00",
            "location": "Metropolitan Gallery of Fine Art",
            "image_url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80",
            "total_tickets": 300,
            "available_tickets": 210,
            "organizer": "Fine Arts Guild"
        }
    ]

    for ev in events_data:
        Event.objects.get_or_create(
            title=ev["title"],
            defaults=ev
        )

    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed()
