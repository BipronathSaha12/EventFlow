# System Architecture

## 1. High-Level Overview
The system employs a decoupled client-server architecture. 
*   **Frontend:** React.js Single Page Application (SPA).
*   **Backend:** Django REST Framework (DRF) API.
*   **Database:** MySQL Server.
*   **External Services:** Stripe API (Payments).

## 2. Technology Stack
*   **Frontend:** React.js, Tailwind CSS, Axios, React Router, React Big Calendar, React-QR-Reader.
*   **Backend:** Python 3, Django, Django REST Framework, djangorestframework-simplejwt, Stripe Python SDK, qrcode.
*   **Database:** MySQL.

## 3. Database Schema (MySQL)
The relational schema is designed for high data integrity:
*   **Users Table:** Extends Django's AbstractBaseUser.
*   **Categories Table:** `id`, `name`, `description`.
*   **Events Table:** `id`, `category_id` (FK), `title`, `date_time`, `price`, `capacity`, `created_at`.
*   **Transactions Table:** `id`, `user_id` (FK), `event_id` (FK), `stripe_payment_intent`, `amount`, `status`.
*   **Tickets Table:** `id`, `transaction_id` (FK), `user_id` (FK), `event_id` (FK), `uuid` (unique identifier for QR), `is_scanned`.

## 4. Data Flow: Booking a Ticket
1.  **Client:** User requests to buy a ticket for Event `A`.
2.  **API:** Backend creates a Stripe Checkout Session and returns the Session URL to the client.
3.  **Stripe:** User completes payment on Stripe's hosted page.
4.  **Stripe Webhook:** Stripe sends an async POST request to the Backend Webhook URL confirming payment.
5.  **API (Background):** Backend verifies the webhook signature, logs the Transaction as `Success`, generates a unique `uuid`, creates a Ticket record, and generates the QR code image.
6.  **Client:** User is redirected to a "Success" page, which fetches the newly generated ticket and QR code from the backend.

## 5. Directory Structure
```text
/
├── backend/                  
│   ├── core/                 # Django settings, URLs, WSGI
│   ├── users/                # Auth, JWT config
│   ├── events/               # Event & Category models/views
│   ├── tickets/              # Ticket logic, QR generation
│   └── payments/             # Stripe integrations, Webhooks
└── frontend/                 
    ├── src/
    │   ├── components/       # Reusable UI (Navbar, Cards)
    │   ├── pages/            # Views (Home, Checkout, Calendar)
    │   ├── context/          # Auth & Theme Contexts
    │   └── services/         # API interceptors
```