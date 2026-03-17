import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Zap,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Smartphone
} from 'lucide-react';

const RegisterPage = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (isSuccess) {
    return (
      <div className={`min-h-screen bg-slate-950 flex items-center justify-center p-6 ${isRtl ? 'rtl' : 'ltr'}`}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel max-w-md w-full p-12 text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">{t('register_success_title')}</h2>
          <p className="text-slate-400 mb-8">{t('register_success_desc')}</p>
          <button 
            onClick={() => navigate('/login')}
            className="btn-premium w-full py-4 flex items-center justify-center gap-2 group"
          >
            {t('login')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 flex font-plus-jakarta ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Sidebar Decor */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center p-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-secondary/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-10 space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-primary/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-brand-primary" />
              </div>
              <span className="text-xl font-black text-white tracking-tighter uppercase">{t('app_name')}</span>
            </div>
            
            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tighter">
              {t('register_hero_title')}
            </h1>
            
            <p className="text-lg text-slate-400 font-medium">
              {t('register_hero_desc')}
            </p>

            <div className="space-y-4 pt-4 border-t border-white/5">
              {[
                { icon: CheckCircle2, text: t('register_feature_1') },
                { icon: Smartphone, text: t('register_feature_2') },
                { icon: Globe, text: t('register_feature_3') }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <feature.icon className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-bold">{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 relative">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full space-y-10"
        >
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter">{t('create_account')}</h2>
            <p className="text-slate-500 font-medium">
              {t('already_have_account')}{' '}
              <Link to="/login" className="text-brand-primary hover:text-brand-primary/80 no-underline font-black uppercase tracking-widest text-[10px]">
                {t('login')}
              </Link>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('full_name')}</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-12 text-sm text-white placeholder:text-slate-600 focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all outline-none"
                  placeholder="EX. ALEXANDER VOGEL"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('email')}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-12 text-sm text-white placeholder:text-slate-600 focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('password')}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-12 text-sm text-white focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="btn-premium w-full py-5 flex items-center justify-center gap-3 overflow-hidden group disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="font-black uppercase tracking-widest text-sm">{t('register')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="pt-10 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed max-w-[200px]">
              {t('terms_privacy_notice')}
            </p>
            <div className="flex gap-4">
              <Globe className="w-4 h-4 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
