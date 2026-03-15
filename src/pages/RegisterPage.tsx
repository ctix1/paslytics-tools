mport { Link, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-white font-sans selection:bg-violet-100 selection:text-violet-900 overflow-x-hidden" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      
      {/* Top Nav */}
      <header className="flex items-center justify-between py-6 px-4 md:px-12 border-b border-slate-50 relative z-50">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 text-violet-600 transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 14l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tighter uppercase">{t('app_name')}</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-10">
            <Link to="/" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">{t('home')}</Link>
            <Link to="/pricing" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">{t('plan')}</Link>
            <Link to="/about" className="text-[10px] font-black text-violet-600 uppercase tracking-widest border-b-2 border-violet-600 pb-1">{t('about')}</Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <button onClick={toggleLanguage} className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all px-4 py-2">
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
            <Link to="/login" className="flex text-[10px] font-black text-white uppercase tracking-widest px-8 py-3 rounded-xl bg-violet-600 shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all">{t('login')}</Link>
          </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full -z-10"></div>
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-violet-100">
            {isRtl ? 'انضم إلى الحركة' : 'Join the movement'}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
            {t('create_account')}
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            {isRtl 
              ? 'انضم إلى منصة تحليل المنتجات الرائدة بالذكاء الاصطناعي وابدأ في تحسين استراتيجيات التسويق الخاصة بك اليوم.' 
              : 'Join the leading AI product analysis platform and start optimizing your marketing strategies today.'}
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Column - Benefits */}
          <div className="space-y-6">
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
              <div key={idx} className="group p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 mb-2 uppercase tracking-tight">{benefit.title}</h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Registration Form */}
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600"></div>
            
            <button 
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full h-14 bg-white border-2 border-slate-50 rounded-2xl flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 transition-all group active:scale-[0.98] disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{isRtl ? 'التسجيل باستخدام جوجل' : 'Sign up with Google'}</span>
            </button>

            <div className="relative py-8 flex items-center">
              <div className="flex-1 border-t border-slate-100"></div>
              <span className="bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isRtl ? 'أو عبر البريد الإلكتروني' : 'Or via email'}</span>
              <div className="flex-1 border-t border-slate-100"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{isRtl ? 'الاسم الكامل' : 'Full Name'}</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-slate-300`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <input type="text" required placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className={`w-full h-14 bg-slate-50 border-2 border-slate-50 focus:border-violet-100 focus:bg-white rounded-2xl ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm font-bold text-slate-900 transition-all outline-none`} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-slate-300`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <input type="email" required placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full h-14 bg-slate-50 border-2 border-slate-50 focus:border-violet-100 focus:bg-white rounded-2xl ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm font-bold text-slate-900 transition-all outline-none`} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('password')}</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-slate-300`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <input type="password" required placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className={`w-full h-14 bg-slate-50 border-2 border-slate-50 focus:border-violet-100 focus:bg-white rounded-2xl ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm font-bold text-slate-900 transition-all outline-none`} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{isRtl ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isRtl ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-slate-300`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <input type="password" required placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className={`w-full h-14 bg-slate-50 border-2 border-slate-50 focus:border-violet-100 focus:bg-white rounded-2xl ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm font-bold text-slate-900 transition-all outline-none`} />
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <input type="checkbox" id="terms" required checked={formData.agreed} onChange={e => setFormData({...formData, agreed: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-violet-600 focus:ring-violet-500 transition-all" />
                <label htmlFor="terms" className="text-[10px] font-bold text-slate-400 leading-tight">
                  {isRtl ? 'أوافق على ' : 'I agree to the '}
                  <span className="text-violet-600 underline">{t('terms_of_service')}</span> 
                  {isRtl ? ' و ' : ' and '}
                  <span className="text-violet-600 underline">{t('privacy_policy')}</span>
                </label>
              </div>

              <button disabled={isLoading} type="submit" className="w-full h-14 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-200 hover:bg-violet-700 hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50">
                {isLoading ? (isRtl ? 'جاري التحميل...' : 'Loading...') : t('create_account')}
                {!isLoading && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>}
              </button>

              <div className="text-center pt-8 border-t border-slate-50">
                <span className="text-xs font-bold text-slate-400">{isRtl ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}</span>
                <Link to="/login" className="text-xs font-black text-violet-600 uppercase tracking-widest ml-2 hover:text-violet-700 transition-all">
                  {isRtl ? 'سجل دخولك هنا' : 'Login here'}
                </Link>
              </div>
            </form>
          </div>

        </div>

        {/* Brand Section */}
        <div className="mt-32 text-center">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">
            {isRtl ? 'موثوق به من قبل قادة السوق' : 'Trusted by Market Leaders'}
          </h3>
          <p className="text-xs md:text-sm font-medium text-slate-500 mb-12">
            {isRtl ? 'انضم إلى آلاف الشركات التي تتوسع باستخدام PASlytics.' : 'Join thousands of companies scaling with PASlytics.'}
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-30 grayscale contrast-125">
            {['TECHCORP', 'DATASYNC', 'SOFTFLOW', 'GLOBALWEB'].map(brand => (
              <span key={brand} className="text-lg md:text-2xl font-black italic text-slate-900 tracking-widest">{brand}</span>
            ))}
          </div>
        </div>

      </main>
    </div>

      </main>
    </div>
  );
};

export default RegisterPage;
