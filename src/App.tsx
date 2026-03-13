import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
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

function App() {
  return (
    <LanguageProvider>
      <SubscriptionProvider>
        <ContentProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/checkout/:plan" element={<Checkout />} />

              <Route element={<DashboardLayout />}>
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
