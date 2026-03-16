import React from 'react';
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
import { AuthProvider, useAuth } from './context/AuthContext';
import { css } from '../styled-system/css';

// Simple Protected Route Wrapper using AuthContext
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className={css({ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'slate.50', 
        color: 'slate.600' 
      })}>
        <div className={css({ 
          width: '40px', 
          height: '40px', 
          border: '4px solid', 
          borderColor: 'brand.light', 
          borderTopColor: 'brand.primary', 
          borderRadius: 'full', 
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        })} />
        <span className={css({ fontWeight: 'bold' })}>Authenticating...</span>
      </div>
    );
  }

  if (!user) {
    // Check if we are in the middle of a hash-based callback
    if (window.location.hash.includes('access_token=')) {
      return <div>Completing login...</div>;
    }
    return <Navigate to="/login" replace />; 
  }

  return <>{children}</>;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <ContentProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/plan" element={<Pricing />} />
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
      </AuthProvider>
    </LanguageProvider>
  );
}

export { App };
