import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';

const RegisterPage = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === 'ar';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(isRtl ? 'كلمات المرور لا تتطابق' : 'Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (error) throw error;

      alert(isRtl ? 'تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني إذا تطلب الأمر.' : 'Registration successful! Check your email if confirmation is required.');
      
      // Fallback for immediate dashboard if email confirmation is off
      if (data.session) {
        localStorage.setItem('user_profile', JSON.stringify({
          email: formData.email,
          name: formData.fullName,
          role: formData.email.toLowerCase() === 'koo111333@gmail.com' ? 'admin' : 'user'
        }));
        navigate('/dashboard');
      } else {
        navigate('/login');
      }

    } catch (error: any) {
      console.error('Error during registration:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', direction: isRtl ? 'rtl' : 'ltr', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar Simulation */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <div className="flex items-center gap-2">
          <div style={{ width: '28px', height: '28px', backgroundColor: '#6c2bd9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="16" height="16"><path d="M3 14l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>PASlytics</span>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', fontWeight: 600, fontSize: '14px', color: '#64748b' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>{t('home')}</Link>
          <Link to="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>{t('plan')}</Link>
          <Link to="/about" style={{ color: '#6c2bd9', textDecoration: 'none', borderBottom: '2px solid #6c2bd9', paddingBottom: '4px' }}>{t('about')}</Link>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={toggleLanguage} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            {isRtl ? 'English' : 'العربية'}
          </button>
          <Link to="/login" style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>{t('login')}</Link>
          <button onClick={() => alert('Start your journey')} style={{ padding: '8px 16px', background: '#6c2bd9', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>{t('get_started')}</button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px' }}>
        
        {/* Badge & Headlines */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: '#f3e8ff', color: '#6c2bd9', borderRadius: '24px', fontSize: '12px', fontWeight: 700, marginBottom: '24px' }}>
            {isRtl ? 'انضم إلى الحركة' : 'Join the movement'}
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            {t('create_account')}
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '460px', margin: '0 auto', lineHeight: 1.6 }}>
            {isRtl 
              ? 'انضم إلى منصة تحليل المنتجات الرائدة بالذكاء الاصطناعي وابدأ في تحسين استراتيجيات التسويق الخاصة بك اليوم.' 
              : 'Join the leading AI product analysis platform and start optimizing your marketing strategies today.'}
          </p>
        </div>

        {/* 2-Column Layout */}
        <div style={{ display: 'flex', gap: '40px', maxWidth: '1000px', width: '100%', alignItems: 'flex-start' }}>
          
          {/* Left Column - Benefits */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                title: isRtl ? 'تحليل ذكاء اصطناعي متقدم' : 'Advanced AI Analysis',
                desc: isRtl ? 'اكتشف الرؤى من خلال أدوات تحليل المنتجات المتقدمة بالذكاء الاصطناعي.' : 'Unlock insights with our cutting-edge AI product analysis tools.'
              },
              {
                title: isRtl ? 'تتبع التحويل' : 'Conversion Tracking',
                desc: isRtl ? 'راقب وقم بتحسين معدلات التحويل الخاصة بك في الوقت الفعلي.' : 'Monitor and improve your conversion rates in real-time.'
              },
              {
                title: isRtl ? 'التعاون الجماعي' : 'Team Collaboration',
                desc: isRtl ? 'ادعُ خبرائك للعمل معًا في مساحة عمل موحدة.' : 'Invite your experts to work together in a unified workspace.'
              }
            ].map((benefit, idx) => (
              <div key={idx} style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', backgroundColor: '#f3e8ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c2bd9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{benefit.title}</h3>
                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Registration Form */}
          <div style={{ flex: 1, backgroundColor: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            
            <button 
              onClick={handleGoogleSignup}
              disabled={isLoading}
              style={{ width: '100%', padding: '12px', marginBottom: '24px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#334155', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isRtl ? 'التسجيل باستخدام جوجل' : 'Sign up with Google'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600 }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
              <span style={{ padding: '0 12px' }}>{isRtl ? 'أو عبر البريد الإلكتروني' : 'Or via email'}</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  {isRtl ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', top: '12px', left: isRtl ? 'auto' : '12px', right: isRtl ? '12px' : 'auto', color: '#94a3b8' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input type="text" required placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '10px 12px', paddingLeft: isRtl ? '12px' : '40px', paddingRight: isRtl ? '40px' : '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', top: '12px', left: isRtl ? 'auto' : '12px', right: isRtl ? '12px' : 'auto', color: '#94a3b8' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input type="email" required placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px 12px', paddingLeft: isRtl ? '12px' : '40px', paddingRight: isRtl ? '40px' : '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  {t('password')}
                </label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', top: '12px', left: isRtl ? 'auto' : '12px', right: isRtl ? '12px' : 'auto', color: '#94a3b8' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input type="password" required placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '10px 12px', paddingLeft: isRtl ? '12px' : '40px', paddingRight: isRtl ? '40px' : '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                  <svg style={{ position: 'absolute', top: '12px', right: isRtl ? 'auto' : '12px', left: isRtl ? '12px' : 'auto', color: '#94a3b8', cursor: 'pointer' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  {isRtl ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', top: '12px', left: isRtl ? 'auto' : '12px', right: isRtl ? '12px' : 'auto', color: '#94a3b8' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input type="password" required placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} style={{ width: '100%', padding: '10px 12px', paddingLeft: isRtl ? '12px' : '40px', paddingRight: isRtl ? '40px' : '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                  <svg style={{ position: 'absolute', top: '12px', right: isRtl ? 'auto' : '12px', left: isRtl ? '12px' : 'auto', color: '#94a3b8', cursor: 'pointer' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input type="checkbox" id="terms" required checked={formData.agreed} onChange={e => setFormData({...formData, agreed: e.target.checked})} style={{ width: '16px', height: '16px', accentColor: '#6c2bd9' }} />
                <label htmlFor="terms" style={{ fontSize: '13px', color: '#64748b' }}>
                  {isRtl ? 'أوافق على ' : 'I agree to the '}
                  <span style={{ color: '#6c2bd9', fontWeight: 600 }}>{t('terms_of_service')}</span> 
                  {isRtl ? ' و ' : ' and '}
                  <span style={{ color: '#6c2bd9', fontWeight: 600 }}>{t('privacy_policy')}</span>
                </label>
              </div>

              <button disabled={isLoading} type="submit" style={{ width: '100%', padding: '14px', backgroundColor: isLoading ? '#9ca3af' : '#6c2bd9', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background 0.3s' }}>
                {isLoading ? (isRtl ? 'جاري التحميل...' : 'Loading...') : t('create_account')}
                {!isLoading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
                {isRtl ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                <Link to="/login" style={{ color: '#6c2bd9', fontWeight: 700, textDecoration: 'none' }}>
                  {isRtl ? 'سجل دخولك هنا' : 'Login here'}
                </Link>
              </div>
            </form>
          </div>

        </div>

        {/* Footer Trusted By */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            {isRtl ? 'موثوق به من قبل قادة السوق' : 'Trusted by Market Leaders'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
            {isRtl ? 'انضم إلى آلاف الشركات التي تتوسع باستخدام PASlytics.' : 'Join thousands of companies scaling with PASlytics.'}
          </p>
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap', opacity: 0.5 }}>
            {['TECHCORP', 'DATASYNC', 'SOFTFLOW', 'GLOBALWEB'].map(brand => (
              <span key={brand} style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '1px', fontStyle: 'italic', color: '#334155' }}>{brand}</span>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default RegisterPage;
