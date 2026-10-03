# Frontend Documentation (React)

## 1. Core Configuration
*   **Framework:** React (Bootstrapped with Vite or CRA).
*   **Styling:** Tailwind CSS for a production-ready, highly responsive grid/flex layout.
*   **State Management:** React Context API for global state (Auth, Theme).

## 2. Global Contexts
*   **`ThemeProvider`:** Manages Dark/Light mode state. Saves preference in `localStorage`. Toggles a `dark` class on the root HTML element.
*   **`AuthProvider`:** Manages JWT tokens. On login, tokens are stored (preferably in secure `httpOnly` cookies or memory, with `localStorage` as a fallback). Provides login, logout, and token refresh utility.

## 3. Routing & Pages (React Router)
*   **Public Routes:** 
    *   `/` (Home/Event List)
    *   `/login`, `/register`
*   **Protected Routes (Requires Auth Context):**
    *   `/checkout/:eventId` - Initiates payment flow.
    *   `/dashboard` - Shows user's purchased tickets.
    *   `/calendar` - Renders the event calendar.
    *   `/payment/success` - Redirection page post-Stripe checkout.

## 4. Key Components
*   **`Axios Interceptor`:** A utility in `/services/api.js` that intercepts every outgoing request and injects the `Authorization: Bearer <token>` header. It also handles automatic token refreshing on 401 Unauthorized responses.
*   **`QRScanner`:** Utilizes `react-qr-reader` to access the device camera. When a QR is scanned, it extracts the UUID and hits the backend to fetch ticket details for re-downloading.
*   **`EventCalendar`:** Utilizes a library like `react-big-calendar`. Fetches data from `/api/tickets/my-tickets/` and maps the event dates to the calendar view.
*   **`Notification/Reminder Engine`:** 
    *   Uses the standard browser Web Notifications API.
    *   Prompts the user for notification permissions on the Calendar page.
    *   Sets local `setTimeout` triggers based on event start times to push reminders to the user's desktop/mobile OS.