import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  BrainCircuit,
  Lock,
  Mail,
  User,
  Loader2
} from 'lucide-react';

const RegisterPage = () => {
  const { t, language } = useLanguage();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect');
  const isRtl = language === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await signUp(formData.email, formData.password, formData.name);
      if (signUpError) throw signUpError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { icon: Zap, text: t('register_feature_1') },
    { icon: BrainCircuit, text: t('register_feature_2') },
    { icon: CheckCircle2, text: t('register_feature_3') },
  ];

  if (success) {
    return (
      <div className={`min-h-screen bg-slate-950 flex items-center justify-center p-6 ${isRtl ? 'font-arabic' : ''}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel max-w-md w-full p-12 text-center space-y-8"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">{t('register_success_title')}</h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            {t('register_success_desc')}
          </p>
          <button 
            onClick={() => navigate(redirect ? `/${redirect}` : '/login')}
            className="btn-premium w-full py-4 rounded-2xl flex items-center justify-center gap-3 group"
          >
            {redirect ? t('next') : t('login')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row overflow-hidden ${isRtl ? 'font-arabic' : ''}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Left Column: Visual/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative p-16 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-slate-950 to-slate-950 -z-10" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full" />
        
        <Link to="/" className="flex items-center gap-3 no-underline group relative z-10 w-fit">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center shadow-2xl"
          >
            <Sparkles className="text-white w-6 h-6" />
          </motion.div>
          <span className="text-2xl font-black tracking-widest uppercase">
            PAS<span className="text-purple-400">lytics</span>
          </span>
        </Link>

        <div className="relative z-10 space-y-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl xl:text-7xl font-black tracking-tighter leading-[0.9]"
          >
            {t('register_hero_title')}
          </motion.h1>
          <p className="text-xl text-slate-400 max-w-lg font-medium leading-relaxed">
            {t('register_hero_desc')}
          </p>
          
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-primary/20 group-hover:border-brand-primary/30 transition-all">
                  <step.icon className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">{step.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1,2,3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800" />
            ))}
          </div>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
            {t('trusted_by')}
          </span>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-10"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tight">{t('create_account')}</h2>
            <p className="text-slate-400 font-medium">
              {t('new_to_pas')} <Link to="/login" className="text-purple-400 hover:text-purple-300 no-underline font-black">{t('login')}</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">{t('full_name')}</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">{t('email')}</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">{t('password')}</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  <input 
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm font-bold animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-5 rounded-2xl flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="text-lg">{t('get_started')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-6">
             <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('secure_env')}</span>
             </div>
             <p className="text-[10px] text-center text-slate-600 uppercase font-bold tracking-widest leading-relaxed">
               {t('terms_privacy_notice')}
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
