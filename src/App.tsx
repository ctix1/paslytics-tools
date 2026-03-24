import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Plan from './pages/Plan';
import AboutPage from './pages/AboutPage';
import Checkout from './pages/Checkout';
import DashboardLayout from './components/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import SystemLogs from './pages/SystemLogs';
import SiteManagement from './pages/SiteManagement';
import Profile from './pages/Profile';
import PaymentSettings from './pages/PaymentSettings';
import ContentManager from './pages/ContentManager';
import ContentBuilderPage from './pages/ContentBuilderPage';
import ProductCalculatorPage from './pages/ProductCalculatorPage';
import SocialDashboard from './pages/SocialDashboard';
import { LanguageProvider } from './i18n/LanguageContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ContentProvider } from './context/ContentContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogProvider } from './context/LogContext';

// Simple Protected Route Wrapper using AuthContext
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-400">
        <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
        <span className="font-black uppercase tracking-widest text-xs">Authenticating...</span>
      </div>
    );
  }

  if (!user) {
    // Check if we are in the middle of a hash-based callback (Supabase)
    if (window.location.hash.includes('access_token=')) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
          <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
        </div>
      );
    }
    return <Navigate to="/login" replace />; 
  }

  return <>{children}</>;
};

// Admin Route Wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-400">
        <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
        <span className="font-black uppercase tracking-widest text-xs">Verifying Permissions...</span>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <ContentProvider>
            <LogProvider>
              <Router>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/plan" element={<Plan />} />
                    <Route path="/about" element={<AboutPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/checkout/:plan" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />

                    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                      <Route path="/dashboard" element={<Dashboard />} />

                      <Route path="/content-builder" element={<ContentBuilderPage />} />
                      <Route path="/social" element={<SocialDashboard />} />
                      <Route path="/calculator" element={<ProductCalculatorPage />} />
                      <Route path="/logs" element={<SystemLogs />} />
                      <Route path="/settings" element={<Profile />} />
                      
                      {/* Admin Only Routes */}
                      <Route path="/management" element={<AdminRoute><SiteManagement /></AdminRoute>} />
                      <Route path="/admin/payment-settings" element={<AdminRoute><PaymentSettings /></AdminRoute>} />
                      <Route path="/admin/content" element={<AdminRoute><ContentManager /></AdminRoute>} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ErrorBoundary>
              </Router>
          </LogProvider>
        </ContentProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
