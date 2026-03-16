import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../i18n/LanguageContext';
import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';
import { css } from '../../styled-system/css';

const RegisterPage = () => {
  const { t, language } = useLanguage();
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
          redirectTo: window.location.origin + '/dashboard',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
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
    <div className={css({ 
      backgroundColor: 'slate.50', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    })} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      
      <Navbar />

      {/* Main Content */}
      <main className={css({ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px' })}>
        
        {/* Badge & Headlines */}
        <div className={css({ textAlign: 'center', marginBottom: '10' })}>
          <div className={css({ display: 'inline-block', paddingX: '4', paddingY: '1.5', backgroundColor: 'brand.light', color: 'brand.primary', borderRadius: 'full', fontSize: 'xs', fontWeight: 'bold', marginBottom: '6' })}>
            {isRtl ? 'انضم إلى الحركة' : 'Join the movement'}
          </div>
          <h1 className={css({ fontSize: '42px', fontWeight: '900', color: 'slate.900', marginBottom: '4', letterSpacing: 'tight' })}>
            {t('create_account')}
          </h1>
          <p className={css({ color: 'slate.500', fontSize: 'md', maxWidth: '460px', marginX: 'auto', lineHeight: 'relaxed' })}>
            {isRtl 
              ? 'انضم إلى منصة تحليل المنتجات الرائدة بالذكاء الاصطناعي وابدأ في تحسين استراتيجيات التسويق الخاصة بك اليوم.' 
              : 'Join the leading AI product analysis platform and start optimizing your marketing strategies today.'}
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className={css({ display: 'flex', gap: '10', maxWidth: '1000px', width: '100%', alignItems: 'start', flexDir: { base: 'column', md: 'row' } })}>
          
          {/* Left Column - Benefits */}
          <div className={css({ flex: '1', display: 'flex', flexDirection: 'column', gap: '5' })}>
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
              <div key={idx} className={css({ padding: '6', backgroundColor: 'white', borderRadius: '2xl', border: '1px solid', borderColor: 'slate.100', boxShadow: 'sm' })}>
                <div className={css({ display: 'flex', gap: '4', alignItems: 'start' })}>
                  <div className={css({ width: '9', height: '9', backgroundColor: 'brand.light', borderRadius: 'xl', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 })}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c2bd9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className={css({ fontSize: 'md', fontWeight: 'bold', color: 'slate.900', marginBottom: '2' })}>{benefit.title}</h3>
                    <p className={css({ fontSize: 'sm', color: 'slate.500', lineHeight: 'normal' })}>{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Registration Form */}
          <div className={css({ flex: '1', backgroundColor: 'white', padding: '10', borderRadius: '3xl', boxShadow: 'xl', border: '1px solid', borderColor: 'slate.100' })}>
            
            <button 
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className={css({ width: '100%', padding: '3', marginBottom: '6', backgroundColor: 'white', border: '1px solid', borderColor: 'slate.200', borderRadius: 'xl', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2', fontSize: 'sm', fontWeight: 'semibold', color: 'slate.700', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, _hover: { backgroundColor: 'slate.50' } })}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isRtl ? 'التسجيل باستخدام جوجل' : 'Sign up with Google'}
            </button>

            <div className={css({ display: 'flex', alignItems: 'center', marginY: '5', color: 'slate.400', fontSize: 'xs', textTransform: 'uppercase', fontWeight: 'bold' })}>
              <div className={css({ flex: '1', height: '1px', backgroundColor: 'slate.100' })}></div>
              <span className={css({ paddingX: '3' })}>{isRtl ? 'أو عبر البريد الإلكتروني' : 'Or via email'}</span>
              <div className={css({ flex: '1', height: '1px', backgroundColor: 'slate.100' })}></div>
            </div>

            <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
              <div>
                <label className={css({ display: 'block', fontSize: 'xs', fontWeight: 'bold', color: 'slate.700', marginBottom: '2' })}>
                  {isRtl ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <div className={css({ position: 'relative' })}>
                  <svg className={css({ position: 'absolute', top: '3', left: isRtl ? 'auto' : '3.5', right: isRtl ? '3.5' : 'auto', color: 'slate.400' })} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input type="text" required placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className={css({ width: '100%', paddingY: '2.5', paddingX: '3.5', paddingLeft: isRtl ? '3.5' : '10', paddingRight: isRtl ? '10' : '3.5', border: '1px solid', borderColor: 'slate.200', borderRadius: 'xl', fontSize: 'sm', backgroundColor: 'slate.50', _focus: { borderColor: 'brand.primary', ring: '1', ringColor: 'brand.primary' } })} />
                </div>
              </div>

              <div>
                <label className={css({ display: 'block', fontSize: 'xs', fontWeight: 'bold', color: 'slate.700', marginBottom: '2' })}>
                  {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className={css({ position: 'relative' })}>
                  <svg className={css({ position: 'absolute', top: '3', left: isRtl ? 'auto' : '3.5', right: isRtl ? '3.5' : 'auto', color: 'slate.400' })} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input type="email" required placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={css({ width: '100%', paddingY: '2.5', paddingX: '3.5', paddingLeft: isRtl ? '3.5' : '10', paddingRight: isRtl ? '10' : '3.5', border: '1px solid', borderColor: 'slate.200', borderRadius: 'xl', fontSize: 'sm', backgroundColor: 'slate.50', _focus: { borderColor: 'brand.primary', ring: '1', ringColor: 'brand.primary' } })} />
                </div>
              </div>

              <div>
                <label className={css({ display: 'block', fontSize: 'xs', fontWeight: 'bold', color: 'slate.700', marginBottom: '2' })}>
                  {t('password')}
                </label>
                <div className={css({ position: 'relative' })}>
                  <svg className={css({ position: 'absolute', top: '3', left: isRtl ? 'auto' : '3.5', right: isRtl ? '3.5' : 'auto', color: 'slate.400' })} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input type="password" required placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className={css({ width: '100%', paddingY: '2.5', paddingX: '3.5', paddingLeft: isRtl ? '3.5' : '10', paddingRight: isRtl ? '10' : '3.5', border: '1px solid', borderColor: 'slate.200', borderRadius: 'xl', fontSize: 'sm', backgroundColor: 'slate.50', _focus: { borderColor: 'brand.primary', ring: '1', ringColor: 'brand.primary' } })} />
                </div>
              </div>

              <div>
                <label className={css({ display: 'block', fontSize: 'xs', fontWeight: 'bold', color: 'slate.700', marginBottom: '2' })}>
                  {isRtl ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <div className={css({ position: 'relative' })}>
                  <svg className={css({ position: 'absolute', top: '3', left: isRtl ? 'auto' : '3.5', right: isRtl ? '3.5' : 'auto', color: 'slate.400' })} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <input type="password" required placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className={css({ width: '100%', paddingY: '2.5', paddingX: '3.5', paddingLeft: isRtl ? '3.5' : '10', paddingRight: isRtl ? '10' : '3.5', border: '1px solid', borderColor: 'slate.200', borderRadius: 'xl', fontSize: 'sm', backgroundColor: 'slate.50', _focus: { borderColor: 'brand.primary', ring: '1', ringColor: 'brand.primary' } })} />
                </div>
              </div>

              <div className={css({ display: 'flex', alignItems: 'center', gap: '2', marginTop: '1' })}>
                <input type="checkbox" id="terms" required checked={formData.agreed} onChange={e => setFormData({...formData, agreed: e.target.checked})} className={css({ width: '4', height: '4', accentColor: 'brand.primary' })} />
                <label htmlFor="terms" className={css({ fontSize: 'xs', color: 'slate.500' })}>
                  {isRtl ? 'أوافق على ' : 'I agree to the '}
                  <span className={css({ color: 'brand.primary', fontWeight: 'bold' })}>{t('terms_of_service')}</span> 
                  {isRtl ? ' و ' : ' and '}
                  <span className={css({ color: 'brand.primary', fontWeight: 'bold' })}>{t('privacy_policy')}</span>
                </label>
              </div>

              <button disabled={isLoading} type="submit" className={css({ width: '100%', padding: '3.5', backgroundColor: isLoading ? 'slate.400' : 'brand.primary', color: 'white', border: 'none', borderRadius: 'xl', fontSize: 'md', fontWeight: 'bold', marginTop: '2', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', _hover: { backgroundColor: 'brand.secondary' } })}>
                {isLoading ? (isRtl ? 'جاري التحميل...' : 'Loading...') : t('create_account')}
                {!isLoading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>}
              </button>

              <div className={css({ textAlign: 'center', marginTop: '4', fontSize: 'sm', color: 'slate.500' })}>
                {isRtl ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                <Link to="/login" className={css({ color: 'brand.primary', fontWeight: 'bold', textDecoration: 'none', _hover: { textDecoration: 'underline' } })}>
                  {isRtl ? 'سجل دخولك هنا' : 'Login here'}
                </Link>
              </div>
            </form>
          </div>

        </div>

        {/* Footer Trusted By */}
        <div className={css({ marginTop: '20', textAlign: 'center' })}>
          <h3 className={css({ fontSize: '2xl', fontWeight: '800', color: 'slate.900', marginBottom: '3' })}>
            {isRtl ? 'موثوق به من قبل قادة السوق' : 'Trusted by Market Leaders'}
          </h3>
          <p className={css({ color: 'slate.500', fontSize: 'md', marginBottom: '8' })}>
            {isRtl ? 'انضم إلى آلاف الشركات التي تتوسع باستخدام PASlytics.' : 'Join thousands of companies scaling with PASlytics.'}
          </p>
          <div className={css({ display: 'flex', gap: '10', justifyContent: 'center', flexWrap: 'wrap', opacity: 0.5 })}>
            {['TECHCORP', 'DATASYNC', 'SOFTFLOW', 'GLOBALWEB'].map(brand => (
              <span key={brand} className={css({ fontSize: 'xl', fontWeight: '900', letterSpacing: 'wider', fontStyle: 'italic', color: 'slate.700' })}>{brand}</span>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default RegisterPage;
