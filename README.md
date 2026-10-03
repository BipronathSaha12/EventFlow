# 🎟️ EventFlow | Enterprise Event Scheduling & Ticketing Platform

[![Django](https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📌 Project Overview

**EventFlow** is a production-level, decoupled full-stack event scheduling, ticketing, and payment platform built with a **Django REST Framework** backend and a **React 19** frontend. 

The system utilizes an advanced relational database setup (supporting both **MySQL** for local scaling and **PostgreSQL** for seamless cloud deployment on platforms like Render). It features category-wise event schedule browsing, a secure **Stripe payment gateway**, **JWT authentication**, automated **QR code generation**, **PDF ticket generation**, interactive **calendar schedules**, real-time **notifications**, a dynamic **Dark/Light theme engine**, and a dedicated **Admin Dashboard** for event authorities.

---

## ✨ Core Features

*   **Authentication Engine:** Secure JWT-based registration and login system.
*   **Stripe Payment Integration:** PCI-compliant checkout session generation. Features a "Demo Mode" fallback that bypasses checkout if API keys aren't present.
*   **Automated QR Code Tickets:** Generates secure QR codes upon successful payment, which can be viewed or re-downloaded as PDFs from the user dashboard.
*   **Dynamic Pagination & Filtering:** Lightning-fast frontend category filtering and client-side pagination for handling 100+ events natively.
*   **Interactive Calendar:** Visual event schedule tracking with `.ics` calendar exports for native OS calendar integration.
*   **Advanced UI/UX:** Built with TailwindCSS v4. Features a completely responsive layout, elegant dark/light mode toggling, and clean, enterprise-grade layouts.

---

## 🏗️ System Architecture

*   **Frontend Directory (`/frontend`):** Built with React 19, Vite, TailwindCSS v4, React Router DOM, and Lucide React Icons.
*   **Backend Directory (`/backend`):** Built with Django 6.0, Django REST Framework, SimpleJWT, Stripe, ReportLab (for PDFs), and QRcode.

---

## 🚀 Local Development Setup

### 1. Backend Setup (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Setup the database (Uses local MySQL by default):
   Ensure you have a MySQL server running and create a database named `eventflow_db`.
   ```bash
   python manage.py migrate
   ```
5. Seed the database with 100+ mock events:
   ```bash
   python seed_100_events.py
   ```
6. Run the server:
   ```bash
   python manage.py runserver 8000
   ```

### 2. Frontend Setup (React/Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:5173`.

---

## ☁️ Production Deployment Guide

This project is meticulously configured for easy deployment on modern cloud platforms.

### 🌐 Deploying the Backend to Render
1. Create a **PostgreSQL** database on Render and copy its Internal Database URL.
2. Create a new **Web Service** on Render connected to this repository.
3. Configure the service:
   * **Root Directory:** `backend`
   * **Build Command:** `bash build.sh`
   * **Start Command:** `gunicorn booking_project.wsgi:application`
4. Add Environment Variables:
   * `DATABASE_URL`: Your Render PostgreSQL Internal URL.
   * `STRIPE_SECRET_KEY`: (Optional) Your Stripe secret key. If left blank, the app will run in Demo Mode.

### ⚡ Deploying the Frontend to GitHub Pages / Vercel
**For GitHub Pages:**
Navigate to the frontend folder and run the provided deploy script:
```bash
cd frontend
npm run deploy
```
This automatically builds the React bundle and pushes it to the `gh-pages` branch.

**For Vercel:**
1. Import the repository in Vercel.
2. Set the Root Directory to `frontend`.
3. Vercel will automatically detect Vite and run `npm run build`. 
4. Deploy!

---

## 📜 Legal & Documentation

Refer to the `/doc` folder for extensive documentation including the **Product Requirements Document (PRD)**, **System Architecture**, and further technical manuals.

**EventFlow © 2026. All rights reserved.**
