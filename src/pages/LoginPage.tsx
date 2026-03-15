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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-violet-100 selection:text-violet-900 font-sans" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      
      {/* Background patterns */}
      <div className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full`}></div>
      <div className={`absolute bottom-0 ${language === 'ar' ? 'right-0' : 'left-0'} w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full`}></div>

      {/* Language Toggle */}
      <div className={`absolute top-8 ${language === 'ar' ? 'left-8' : 'right-8'}`}>
        <button onClick={toggleLanguage} className="bg-white/80 backdrop-blur-sm border border-slate-200 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
          {language === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <div className="w-full max-w-[460px] relative z-10 py-12">
        
        {/* Logo & Header */}
        <div className="text-center mb-10 group">
          <Link to="/" className="inline-block transition-transform group-hover:scale-105 active:scale-95">
             <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-slate-200 mb-6 mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent"></div>
                <svg className="w-8 h-8 text-white relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 14l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </div>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter uppercase leading-none">{t('pas_analysis_title')}</h1>
          <p className="text-slate-500 text-sm font-medium max-w-[320px] mx-auto leading-relaxed">
            {t('login_desc')}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/60 relative overflow-hidden backdrop-blur-xl">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 animate-gradient-x"></div>
           
           <button disabled={isLoading} type="button" className="w-full h-14 rounded-2xl border-2 border-slate-50 hover:bg-slate-50 flex items-center justify-center gap-3 transition-all group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{t('sign_in_google')}</span>
          </button>

          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('or_email')}</span></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('work_email')}</label>
              <input type="email" id="email" className="w-full h-14 bg-slate-50 border-2 border-slate-50 focus:border-violet-100 focus:bg-white rounded-2xl px-5 text-sm font-bold text-slate-900 transition-all outline-none" placeholder="name@company.com" required />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('password')}</label>
                <button type="button" onClick={(e) => { e.preventDefault(); alert('Opening Password Reset Flow...'); }} className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:text-violet-700">{t('forgot')}</button>
              </div>
              <input type="password" id="password" className="w-full h-14 bg-slate-50 border-2 border-slate-50 focus:border-violet-100 focus:bg-white rounded-2xl px-5 text-sm font-bold text-slate-900 transition-all outline-none" required />
            </div>

            <button disabled={isLoading} type="submit" className="w-full h-14 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-xl shadow-violet-200 hover:bg-violet-700 hover:shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...') : t('sign_in_pas')}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <span className="text-xs font-bold text-slate-400">{t('new_to_pas')}</span> 
            <Link to="/register" className="text-xs font-black text-violet-600 uppercase tracking-widest ml-2 hover:text-violet-700 transition-all">{t('create_account')}</Link>
          </div>
        </div>

        {/* Footer Secure */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="w-5 h-5 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          {t('secure_env')}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
