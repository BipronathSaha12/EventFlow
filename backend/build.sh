#!/usr/bin/env bash
# exit on error
set -o errexit

# Fix for Rust-based packages (python-bidi) failing on Render's read-only file system
export CARGO_HOME=/opt/render/project/src/.cargo

python -m pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@eventflow.com', 'Admin@123')
    print('Auto-generated superuser: admin / Admin@123')
"