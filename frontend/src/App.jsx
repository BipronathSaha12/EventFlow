import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationDrawer from './components/NotificationDrawer';

import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import EventCalendar from './pages/EventCalendar';
import VerifyTicket from './pages/VerifyTicket';
import Login from './pages/Login';
import Register from './pages/Register';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import About from './pages/About';
import Careers from './pages/Careers';
import Contact from './pages/Contact';

function ToastContainer() {
  const { toast } = useNotifications();
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`px-5 py-3.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-3 backdrop-blur-md border ${
        toast.type === 'success'
          ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
          : toast.type === 'warning'
          ? 'bg-amber-950/90 text-amber-200 border-amber-500/50'
          : 'bg-slate-900/90 text-slate-100 border-slate-700'
      }`}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
              <Navbar />
              <NotificationDrawer />
              <ToastContainer />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/calendar" element={<EventCalendar />} />
                  <Route path="/verify" element={<VerifyTicket />} />
                  <Route path="/verify/:code" element={<VerifyTicket />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-cancel" element={<PaymentCancel />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
