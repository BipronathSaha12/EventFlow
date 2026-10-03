#!/usr/bin/env bash
# exit on error
set -o errexit

# Fix for Rust-based packages (python-bidi) failing on Render's read-only file system
export CARGO_HOME=/opt/render/project/src/.cargo

python -m pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate