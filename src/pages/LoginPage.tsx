import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { motion } from 'framer-motion';
import { 
  LogIn, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Loader2 
} from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 ${isRtl ? 'font-arabic' : ''}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center shadow-xl">
             <LogIn className="text-purple-400 w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            PAS<span className="text-purple-500">lytics</span>
          </h1>
        </div>

        <div className="glass-panel p-10 bg-slate-900/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-24 h-24 text-white" />
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-black text-white mb-2">{t('login_title')}</h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{t('login_subtitle')}</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">{t('email_label')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-white text-sm focus:border-purple-500/50 outline-none transition-all placeholder:text-slate-700`}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">{t('password_label')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-white text-sm focus:border-purple-500/50 outline-none transition-all placeholder:text-slate-700`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-5 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin relative z-10" />
              ) : (
                <>
                  <span className="font-black uppercase tracking-widest text-xs relative z-10">{t('login_button')}</span>
                  <ArrowRight className={`w-4 h-4 relative z-10 group-hover:${isRtl ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
            {t('no_account')}{' '}
            <Link to="/plans" className="text-purple-400 hover:text-purple-300 ml-1 transition-colors no-underline">
              {t('register_link')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
