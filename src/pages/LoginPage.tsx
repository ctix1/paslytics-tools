import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Lock, Globe, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect');
  const isRtl = language === 'ar';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + (redirect ? `/${redirect}` : '/dashboard'),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (authError) throw authError;
    } catch (err: any) {
      console.error('Error with Google Auth:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const password = (document.getElementById('password') as HTMLInputElement)?.value;
    
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (data.session) {
        navigate(redirect ? `/${redirect}` : '/dashboard');
      }

    } catch (err: any) {
      console.error('Error during login:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden ${isRtl ? 'font-arabic' : ''}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Language Toggle */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-8 right-8 z-50"
      >
        <button 
          onClick={toggleLanguage} 
          className="flex items-center gap-2 px-4 py-2 glass-panel hover:bg-white/10 transition-all border-none text-slate-400 hover:text-white cursor-pointer"
        >
          <Globe className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {language === 'ar' ? 'English' : 'العربية'}
          </span>
        </button>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-16 h-16 bg-brand-primary rounded-[20px] flex items-center justify-center shadow-[0_10px_30px_rgba(109,40,217,0.4)] mx-auto mb-8"
          >
            <Sparkles className="text-white w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">{t('pas_analysis_title')}</h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            {t('login_desc')}
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 md:p-10 bg-slate-900/60 backdrop-blur-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-30" />
          
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <button 
            disabled={isLoading} 
            onClick={handleGoogleLogin}
            className="w-full h-14 glass-panel flex items-center justify-center gap-4 bg-white/[0.03] hover:bg-white/[0.08] transition-all border-white/10 group/btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="mr-2">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-white font-black text-sm uppercase tracking-widest">{t('sign_in_google')}</span>
          </button>

          <div className="flex items-center gap-4 my-10">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('or_email')}</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('work_email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  id="email" 
                  className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-12 text-sm text-white placeholder:text-slate-600 focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all outline-none" 
                  placeholder="name@company.com" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between px-1">
                <label htmlFor="password" className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('password')}</label>
                <button 
                  type="button" 
                  onClick={() => alert('Accessing recovery protocol...')}
                  className="text-[10px] font-black text-brand-primary uppercase tracking-widest no-underline hover:text-white transition-colors"
                >
                  {t('forgot')}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  id="password" 
                  className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-12 text-sm text-white focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all outline-none" 
                  required 
                />
              </div>
            </div>

            <button 
              disabled={isLoading} 
              type="submit" 
              className="btn-premium w-full h-14 flex items-center justify-center gap-3 !text-sm group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="font-black uppercase tracking-[0.2em]">{t('sign_in_pas')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <span className="text-xs font-medium text-slate-500">{t('new_to_pas')}</span> 
            <Link to="/register" className="text-xs font-black text-brand-primary uppercase tracking-widest no-underline ml-2 hover:text-white transition-colors">
              {t('create_account')}
            </Link>
          </div>
        </div>

        {/* Security Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-3 text-slate-600"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('secure_env')}</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
