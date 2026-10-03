import os
import django
import random
from datetime import date, timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'booking_project.settings')
django.setup()

from bookings.models import Category, Event

def seed_100_events():
    print("Seeding 100+ events...")
    categories = list(Category.objects.all())
    
    if not categories:
        print("Creating a default category...")
        default_cat = Category.objects.create(name="General", slug="general")
        categories.append(default_cat)

    adjectives = ["Global", "Annual", "International", "Regional", "Exclusive", "Advanced", "Introductory", "Professional"]
    nouns = ["Summit", "Conference", "Festival", "Workshop", "Symposium", "Exhibition", "Masterclass", "Meetup"]
    topics = ["AI & Machine Learning", "Blockchain", "Digital Art", "Cybersecurity", "Cloud Computing", "Jazz", "Indie Rock", "Modern Dance", "Web Development", "Startup Growth"]
    locations = ["San Francisco", "New York", "London", "Tokyo", "Berlin", "Paris", "Singapore", "Sydney", "Remote", "Chicago"]

    images = [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    ]

    today = timezone.now().date()
    events_created = 0

    for i in range(110):  # Generate 110 events to ensure we have > 100
        title = f"{random.choice(adjectives)} {random.choice(topics)} {random.choice(nouns)} {2026 + (i%2)}"
        
        # Make sure title is unique enough
        if Event.objects.filter(title=title).exists():
            title = f"{title} - Edition {i}"

        date_offset = random.randint(1, 365)
        event_date = today + timedelta(days=date_offset)
        
        total_tix = random.randint(50, 5000)
        
        Event.objects.create(
            title=title,
            description=f"Join us for the {title}. This event will feature industry leaders and excellent networking opportunities. Don't miss out on this incredible experience.",
            category=random.choice(categories),
            date=event_date,
            time=f"{random.randint(8, 20):02d}:00:00",
            location=random.choice(locations),
            price=round(random.uniform(10.0, 500.0), 2),
            total_tickets=total_tix,
            available_tickets=random.randint(0, total_tix),
            image_url=random.choice(images)
        )
        events_created += 1
        
        if events_created % 10 == 0:
            print(f"Created {events_created} events...")

    print(f"Successfully generated {events_created} new events!")

if __name__ == "__main__":
    seed_100_events()
