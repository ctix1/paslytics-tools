import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { css } from '../../styled-system/css';

const LoginPage = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === 'ar';

  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      console.log('Initiating Google Login...');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) {
        console.error('Supabase Google OAuth Error:', error);
        throw error;
      }
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
        navigate('/dashboard');
      }

    } catch (error: any) {
      console.error('Error during login:', error);
      alert(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className={css({ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      paddingX: '16px',
      backgroundColor: 'slate.50',
      position: 'relative',
      fontFamily: 'sans',
      direction: isRtl ? 'rtl' : 'ltr'
    })}>
      
      {/* Language Toggle */}
      <div className={css({ 
        position: 'absolute', 
        top: '24px', 
        insetEnd: '24px' 
      })}>
        <button onClick={toggleLanguage} className={css({
          paddingY: '6px',
          paddingX: '12px',
          fontSize: '12px',
          borderRadius: 'md',
          border: '1px solid',
          borderColor: 'slate.200',
          backgroundColor: 'white',
          cursor: 'pointer',
          _hover: { backgroundColor: 'slate.50' }
        })}>
          {language === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <div className={css({ width: '100%', maxWidth: '460px', display: 'flex', flexDirection: 'column', alignItems: 'center' })}>
        
        {/* Logo & Header */}
        <div className={css({ textAlign: 'center', marginBottom: '32px' })}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className={css({ marginBottom: '20px' })}>
            <rect width="48" height="48" rx="12" fill="#581c87"/>
            <rect x="14" y="24" width="4" height="12" rx="2" fill="white"/>
            <rect x="22" y="18" width="4" height="18" rx="2" fill="white"/>
            <rect x="30" y="12" width="4" height="24" rx="2" fill="white"/>
          </svg>
          <h1 className={css({ fontSize: '28px', marginBottom: '8px', fontWeight: 'bold', color: 'slate.900' })}>{t('pas_analysis_title')}</h1>
          <p className={css({ color: 'slate.500', fontSize: '15px', maxWidth: '320px', marginX: 'auto', lineHeight: '1.4' })}>
            {t('login_desc')}
          </p>
        </div>

        {/* Login Card */}
        <div className={css({
          width: '100%',
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: 'xl',
          boxShadow: 'xl',
          border: '1px solid',
          borderColor: 'slate.100',
          marginBottom: '40px'
        })}>
          <button 
            disabled={isLoading} 
            type="button" 
            className={css({ 
              width: '100%', 
              height: '44px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 'lg',
              border: '1px solid',
              borderColor: 'slate.200',
              backgroundColor: 'white',
              fontWeight: 'medium',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              _hover: { backgroundColor: 'slate.50' },
              marginBottom: '16px'
            })} 
            onClick={handleGoogleLogin}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={css({ marginInlineEnd: '8px' })}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t('sign_in_google')}
          </button>

          <div className={css({ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            marginY: '24px',
            color: 'slate.400',
            fontSize: '13px'
          })}>
            <div className={css({ height: '1px', flex: 1, backgroundColor: 'slate.100' })} />
            <span>{t('or_email')}</span>
            <div className={css({ height: '1px', flex: 1, backgroundColor: 'slate.100' })} />
          </div>

          <form onSubmit={handleEmailLogin}>
            <div className={css({ marginBottom: '16px' })}>
              <label htmlFor="email" className={css({ display: 'block', fontSize: '14px', fontWeight: 'medium', color: 'slate.700', marginBottom: '6px' })}>{t('work_email')}</label>
              <input type="email" id="email" className={css({ 
                width: '100%', 
                height: '42px', 
                paddingX: '12px', 
                borderRadius: 'lg', 
                border: '1px solid', 
                borderColor: 'slate.200',
                fontSize: '14px',
                _focus: { borderColor: 'brand.primary', outline: 'none', ring: '2px', ringColor: 'brand.light' },
                textAlign: language === 'ar' ? 'right' : 'left'
              })} placeholder="name@company.com" required />
            </div>

            <div className={css({ marginBottom: '24px' })}>
              <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' })}>
                <label htmlFor="password" className={css({ fontSize: '14px', fontWeight: 'medium', color: 'slate.700', margin: 0 })}>{t('password')}</label>
                <button type="button" onClick={(e) => { e.preventDefault(); alert('Opening Password Reset Flow...'); }} className={css({ color: 'brand.primary', fontSize: '13px', fontWeight: 'medium', cursor: 'pointer', background: 'none', border: 'none', padding: 0, _hover: { textDecoration: 'underline' } })}>{t('forgot')}</button>
              </div>
              <input type="password" id="password" className={css({ 
                width: '100%', 
                height: '42px', 
                paddingX: '12px', 
                borderRadius: 'lg', 
                border: '1px solid', 
                borderColor: 'slate.200',
                fontSize: '14px',
                _focus: { borderColor: 'brand.primary', outline: 'none', ring: '2px', ringColor: 'brand.light' },
                textAlign: language === 'ar' ? 'right' : 'left'
              })} required />
            </div>

            <button disabled={isLoading} type="submit" className={css({ 
              width: '100%', 
              height: '44px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 'lg',
              backgroundColor: 'brand.primary', 
              color: 'white',
              fontWeight: 'semibold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              _hover: { backgroundColor: 'brand.secondary' }
            })}>
              {isLoading ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...') : t('sign_in_pas')}
            </button>
          </form>

          <div className={css({ marginTop: '32px', textAlign: 'center', fontSize: '14px' })}>
            <span className={css({ color: 'slate.500' })}>{t('new_to_pas')}</span> 
            <Link to="/register" className={css({ color: 'brand.primary', fontWeight: 'bold', marginInlineStart: '6px', textDecoration: 'none', _hover: { textDecoration: 'underline' } })}>{t('create_account')}</Link>
          </div>
        </div>

        {/* Footer Secure */}
        <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'slate.400', fontSize: '13px' })}>
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
