import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // 1. Sign out from Supabase
        await supabase.auth.signOut();
        
        // 2. Clear local session data
        localStorage.removeItem('user_profile');
        localStorage.removeItem('sb-access-token'); // Standard Supabase token key if any
        localStorage.removeItem('sb-refresh-token');
        
        // 3. Clear any other app-specific state if necessary
        // (SubscriptionContext and other contexts will re-evaluate on redirect)
        
        console.log('User signed out successfully');
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        // 4. Redirect to login page
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #6c2bd9', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Logging you out...</h2>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Logout;
