# 🎟️ EventFlow | Enterprise Event Scheduling & Ticketing Platform

[![Django](https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📌 Project Overview

**EventFlow** is a production-level, decoupled full-stack event scheduling, ticketing, and payment platform built with a **Django REST Framework** backend and a **React 19** frontend. 

The system strictly utilizes **MySQL** for high-volume dataset scalability, data integrity, and complex queries. It features category-wise event schedule browsing, secure **Stripe payment gateway** integration, **JWT authentication**, automated **QR code generation**, **PDF ticket download and re-download**, an **interactive calendar schedule** with browser reminders and `.ics` exports, real-time **notifications**, a dynamic **Dark/Light theme engine**, and an **Admin Control Panel** for event authorities.

---

## 🚀 Key Features & Specifications

### 🖥️ Client-Side UI (React 19 + Vite)
- **Category-Wise Schedule Browsing**: Filter events dynamically by categories (*Music & Concerts, Tech & AI, Workshops & Masterclasses, Sports & Fitness, Business & Networking, Arts & Culture*) or search by keywords.
- **Ticket Reservation & Stripe Checkout**: Quantity selector, real-time price calculation, and direct redirect to Stripe's 256-bit encrypted Checkout session.
- **QR Ticket Verification Tool**: Public & authenticated lookup tool (`/verify`) allowing users or event staff to scan/paste QR codes or UUIDs to inspect ticket validity and payment status.
- **Loss-Proof Ticket Re-Download**: Clients can re-download lost PDF tickets anytime directly from the User Dashboard (`/dashboard`) or QR verification screen.
- **Schedule Calendar & Reminders**: Visual event calendar (`/calendar`) to track scheduled occasion dates, trigger browser notification alerts, and download standard `.ics` invitation files for Google Calendar, Apple iCal, or Outlook.
- **Live Notification Drawer**: Slide-over notification panel displaying payment confirmations, upcoming event reminders, and ticket ready alerts with unread badge counters.
- **Dynamic Dark/Light Theme Engine**: Instant theme switcher with smooth CSS transitions and saved `localStorage` preferences.

### ⚙️ Backend & Database Architecture (Django REST Framework + MySQL)
- **MySQL Database Engine**: Standardized on **MySQL (`eventflow_db`)** via `PyMySQL` for handling large datasets, transactional integrity, and scalable indexing.
- **Strict JWT Authentication**: Secured via `rest_framework_simplejwt` (`/api/auth/login/`, `/api/auth/register/`, `/api/auth/me/`, `/api/auth/refresh/`).
- **Stripe Integration & Webhooks**: Backend Stripe Checkout session generation (`/api/bookings/:id/create-checkout-session/`), webhook listener (`/api/stripe/webhook/`), and return confirmation fallback (`/api/bookings/:id/confirm-payment/`).
- **In-Memory PDF & QR Ticket Generation**: Uses `xhtml2pdf` and `qrcode` to generate printable PDF passes containing unique ticket UUIDs and QR verification links.
- **Enhanced Django Admin Control Panel**: Custom admin interface for event managers to handle categories, events, bookings, payment statuses, and QR code regenerations (`/admin/`).

---

## 📂 Repository Structure

```
EventFlow/
├── backend/                  # Django REST Framework Application
│   ├── booking_project/      # Settings, URL Routing, WSGI Configuration
│   │   ├── settings.py       # Configured strictly for MySQL (eventflow_db)
│   │   └── urls.py           # Main URL routing
│   ├── bookings/             # Core Django App
│   │   ├── admin.py          # Custom Admin Control Panel
│   │   ├── api_views.py      # DRF API endpoints (Events, Stripe, QR, Notifications)
│   │   ├── api_urls.py       # DRF API Route declarations
│   │   ├── models.py         # Category, Event, Booking, Notification models
│   │   ├── serializers.py    # Serializers for API responses
│   │   ├── utils.py          # QR Code Generator
│   │   └── views.py          # PDF Ticket Renderer & Email Delivery
│   ├── create_db.py          # MySQL Database Auto-Initializer
│   ├── seed_data.py          # Sample Event & Category Data Seeder
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                 # React 19 + Vite Single Page Application
│   ├── src/
│   │   ├── api/              # Axios client with JWT request/response interceptors
│   │   ├── components/       # Navbar, Footer, EventCard, BookingModal, NotificationDrawer, CategoryPills
│   │   ├── context/          # AuthContext, ThemeContext, NotificationContext
│   │   ├── pages/            # Home, UserDashboard, EventCalendar, VerifyTicket, Login, Register, PaymentSuccess
│   │   ├── App.jsx           # React Router & Layout Component
│   │   └── index.css         # CSS Variables, Glassmorphism, Theme System
│   ├── package.json
│   └── vite.config.js
│
└── doc/                      # Technical Documentation
    ├── backend_setup.md
    └── frontend_setup.md
```

---

## 🛢️ Database Configuration (MySQL)

This project strictly utilizes **MySQL** as its production database engine.

### Database Credentials (`backend/booking_project/settings.py`)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME', 'eventflow_db'),
        'USER': os.environ.get('DB_USER', 'root'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '3306'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    }
}
```

---

## ⚙️ Quick Start Guide

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **MySQL Server** (Running on `localhost:3306`)

---

### 2. Backend Setup (Django + DRF)

1. **Activate Environment & Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Initialize MySQL Database & Run Migrations**:
   ```bash
   python create_db.py
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Seed Initial Categories & Events**:
   ```bash
   python seed_data.py
   ```

4. **Create Admin Superuser**:
   ```bash
   python manage.py createsuperuser
   ```

5. **Start Django API Server**:
   ```bash
   python manage.py runserver 8000
   ```
   - REST API Base URL: `http://localhost:8000/api/`
   - Admin Panel: `http://localhost:8000/admin/`

---

### 3. Frontend Setup (React.js + Vite)

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   - Client Application URL: `http://localhost:5173/`

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🛡️ Security & Production Best Practices

1. **Strict Authentication**: JWT Access Tokens expire in 1 day, Refresh Tokens in 7 days.
2. **Stripe Payment Integrity**: Webhooks validate Stripe event signatures (`STRIPE_WEBHOOK_SECRET`) to prevent payment spoofing.
3. **QR Code Verification**: Each ticket contains a cryptographically secure UUID (`ticket_uuid`) linked to the database record.
4. **Data Protection**: User tickets and PDFs are restricted to authenticated owners and staff members.

---

## 📄 License
This software is licensed under the MIT License.
