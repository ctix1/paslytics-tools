import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const LoginPage = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/dashboard');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error with Google Auth:', error);
      alert(error.message);
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const password = (document.getElementById('password') as HTMLInputElement)?.value;
    
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.session) {
        localStorage.setItem('user_profile', JSON.stringify({
          email: data.session.user.email,
          name: data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0],
          role: data.session.user.email?.toLowerCase() === 'koo111333@gmail.com' ? 'admin' : 'user'
        }));
        navigate('/dashboard');
      }

    } catch (error: any) {
      console.error('Error during login:', error);
      alert(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ direction: language === 'ar' ? 'rtl' : 'ltr', position: 'relative' }}>
      
      {/* Language Toggle */}
      <div style={{ position: 'absolute', top: '24px', right: language === 'ar' ? 'auto' : '24px', left: language === 'ar' ? '24px' : 'auto' }}>
        <button onClick={toggleLanguage} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
          {language === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '460px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: '20px' }}>
            <rect width="48" height="48" rx="12" fill="#581c87"/>
            <rect x="14" y="24" width="4" height="12" rx="2" fill="white"/>
            <rect x="22" y="18" width="4" height="18" rx="2" fill="white"/>
            <rect x="30" y="12" width="4" height="24" rx="2" fill="white"/>
          </svg>
          <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 700 }}>{t('pas_analysis_title')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '320px', margin: '0 auto', lineHeight: '1.4' }}>
            {t('login_desc')}
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-8" style={{ width: '100%', marginBottom: '40px' }}>
          <button disabled={isLoading} type="button" className="btn btn-outline w-full" onClick={handleGoogleLogin} style={{ height: '44px', marginBottom: '8px', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginInlineEnd: '8px' }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t('sign_in_google')}
          </button>

          <div className="divider">{t('or_email')}</div>

          <form onSubmit={handleEmailLogin}>
            <label htmlFor="email">{t('work_email')}</label>
            <input type="email" id="email" className="input mb-4" placeholder="name@company.com" required style={{ textAlign: language === 'ar' ? 'right' : 'left' }} />

            <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
              <label htmlFor="password" style={{ margin: 0 }}>{t('password')}</label>
              <button type="button" onClick={(e) => { e.preventDefault(); alert('Opening Password Reset Flow...'); }} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>{t('forgot')}</button>
            </div>
            <input type="password" id="password" className="input mb-6" required style={{ textAlign: language === 'ar' ? 'right' : 'left' }} />

            <button disabled={isLoading} type="submit" className="btn btn-primary w-full" style={{ height: '44px', justifyContent: 'center', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
              {isLoading ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...') : t('sign_in_pas')}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px' }}>
            <span className="text-muted">{t('new_to_pas')}</span> 
            <Link to="/register" style={{ background: 'none', border: 'none', padding: 0, color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, marginInlineStart: '6px', textDecoration: 'none' }}>{t('create_account')}</Link>
          </div>
        </div>

        {/* Footer Secure */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          {t('secure_env')}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
