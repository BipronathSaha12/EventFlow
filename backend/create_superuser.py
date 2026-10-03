import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'booking_project.settings')
django.setup()

from django.contrib.auth.models import User

def create_admin():
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@eventflow.com', 'admin')
        print("Superuser created: username='admin', password='admin'")
    else:
        print("Superuser 'admin' already exists.")

if __name__ == '__main__':
    create_admin()
