import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const redirectPath = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        setSuccess(true);
        setTimeout(() => {
          if (redirectPath === 'checkout') {
            navigate('/checkout');
          } else {
            navigate('/login');
          }
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 ${isRtl ? 'font-arabic' : ''}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-3 mb-10 text-center">
          <div className="w-16 h-16 bg-brand-primary rounded-[20px] flex items-center justify-center shadow-[0_10px_30px_rgba(109,40,217,0.4)] mx-auto mb-8">
            <Sparkles className="text-white w-8 h-8" />
          </div>
        </div>

        <div className="glass-panel p-10 bg-slate-900/60 backdrop-blur-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-24 h-24 text-white" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-white mb-2">{t('create_account')}</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">{t('register_hero_desc')}</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-bold"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {t('register_success_title')}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">{t('full_name')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-white text-sm focus:border-brand-primary outline-none transition-all`}
                  placeholder={t('full_name')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">{t('work_email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-white text-sm focus:border-brand-primary outline-none transition-all`}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-white text-sm focus:border-brand-primary outline-none transition-all`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full h-14 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="font-black uppercase tracking-widest text-xs relative z-10">{t('register')}</span>
                  <ArrowRight className={`w-4 h-4 relative z-10 group-hover:${isRtl ? '-translate-x-1' : 'translate-x-1'} transition-transform`} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              {t('already_have_account')}{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-brand-primary hover:text-white ml-1 transition-colors bg-transparent border-none cursor-pointer uppercase font-black"
              >
                {t('login')}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
