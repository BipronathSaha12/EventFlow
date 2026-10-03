# Backend Documentation (Django)

## 1. Core Configuration
*   **Database:** Configured to use `mysqlclient`. Connection pooling is recommended for production.
*   **Authentication:** Configured in `settings.py` using `rest_framework_simplejwt.authentication.JWTAuthentication`.

## 2. Django Apps

### 2.1 `users`
*   Handles user registration, login, and token generation.
*   **Endpoints:**
    *   `POST /api/users/register/`
    *   `POST /api/users/token/` (Login)
    *   `POST /api/users/token/refresh/`

### 2.2 `events`
*   Manages categories and event scheduling.
*   **Endpoints:**
    *   `GET /api/events/categories/`
    *   `GET /api/events/` (List all, supports filtering `?category=X`)
    *   `GET /api/events/<id>/`

### 2.3 `payments`
*   Integrates with Stripe. Strictly utilizes server-side API keys.
*   **Endpoints:**
    *   `POST /api/payments/create-checkout-session/` - Requires JWT. Expects `event_id`. Returns a Stripe checkout URL.
    *   `POST /api/payments/webhook/` - **Public Endpoint**. Protected by Stripe Signature validation. Handles `checkout.session.completed`.

### 2.4 `tickets`
*   Manages generated tickets and QR code serving.
*   **Endpoints:**
    *   `GET /api/tickets/my-tickets/` - Requires JWT. Returns list of user's tickets.
    *   `GET /api/tickets/qr/<uuid>/` - Serves the generated QR image.
    *   `POST /api/tickets/scan/` - API for scanning a QR code to retrieve ticket data or mark as attended.

## 3. Security Considerations
*   **NEVER** expose the `STRIPE_SECRET_KEY` to the frontend.
*   Ensure MySQL user permissions are restricted (Principle of Least Privilege).
*   Webhook endpoints must verify the `HTTP_STRIPE_SIGNATURE` header to prevent spoofed payment confirmations.