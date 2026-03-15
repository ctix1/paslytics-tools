import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Pricing from './pages/Pricing';
import AboutPage from './pages/AboutPage';
import Checkout from './pages/Checkout';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import SystemLogs from './pages/SystemLogs';
import SiteManagement from './pages/SiteManagement';
import Profile from './pages/Profile';
import PaymentSettings from './pages/PaymentSettings';
import ContentManager from './pages/ContentManager';
import { LanguageProvider } from './i18n/LanguageContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ContentProvider } from './context/ContentContext';
import { useState } from 'react';
import { supabase } from './lib/supabase';

import { css } from '../styled-system/css';

// Simple Auth Provider & Protected Route Wrapper for App.tsx
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(undefined);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className={css({ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'slate.50', color: 'slate.600', fontWeight: 'medium' })}>Loading...</div>; // Still checking
  }

  if (!session) {
    return <Navigate to="/login" replace />; // Not logged in
  }

  return <>{children}</>;
};

function App() {
  return (
    <LanguageProvider>
      <SubscriptionProvider>
        <ContentProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<AboutPage />} />
              
              {/* Protected Routes */}
              <Route path="/checkout/:plan" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />

              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/logs" element={<SystemLogs />} />
                <Route path="/management" element={<SiteManagement />} />
                <Route path="/settings" element={<Profile />} />
                <Route path="/admin/payment-settings" element={<PaymentSettings />} />
                <Route path="/admin/content" element={<ContentManager />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ContentProvider>
      </SubscriptionProvider>
    </LanguageProvider>
  );
}

export { App };
