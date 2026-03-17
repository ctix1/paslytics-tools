import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';
import { motion, Variants } from 'framer-motion';
import { 
  Sparkles, 
  Play, 
  Zap, 
  Rocket, 
  BarChart3, 
  BrainCircuit,
  Globe
} from 'lucide-react';

const LandingPage = () => {
  const { t, language } = useLanguage();
  const { homepage } = useContent();
  const isRtl = language === 'ar';
  const get = (en: string, ar: string) => isRtl ? ar : en;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const floatingVariants: Variants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-white overflow-hidden ${isRtl ? 'font-arabic' : ''}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <motion.main 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto px-6"
        >
          {/* Hero Section */}
          <section className="py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 text-center lg:text-start">
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-purple-400 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t('next_gen')}
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white"
              >
                {get(homepage.heroTitle1_en, homepage.heroTitle1_ar)}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-amber-400">
                  {get(homepage.heroTitle2_en, homepage.heroTitle2_ar)}
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-slate-400 text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                {get(homepage.heroDesc_en, homepage.heroDesc_ar)}
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
              >
                <Link to="/login" className="btn-premium flex items-center gap-3 px-10 py-5 group no-underline text-lg">
                  {t('start_analyzing')}
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
                <button 
                  onClick={() => alert('Launching neural interface...')}
                  className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all text-lg"
                >
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 fill-purple-400 text-purple-400" />
                  </div>
                  {t('watch_demo')}
                </button>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center lg:items-start gap-4"
              >
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-brand-primary flex items-center justify-center text-[10px] font-black">
                    +2k
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {t('trusted_by')}
                </span>
              </motion.div>
            </div>
            
            <motion.div 
              variants={itemVariants}
              className="relative hidden lg:block"
            >
              <motion.div 
                variants={floatingVariants}
                animate="animate"
                className="glass-panel p-2 aspect-[4/3] rounded-[40px] relative z-20 overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent" />
                <div className="w-full h-full bg-slate-900/80 rounded-[34px] flex items-center justify-center overflow-hidden">
                   {/* Abstract Neural Grid */}
                   <div className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)', backgroundSize: '24px 24px'}} />
                   <BrainCircuit className="w-32 h-32 text-purple-500/50 relative z-10" />
                </div>
              </motion.div>

              {/* Floating Widgets */}
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute -top-8 -left-8 glass-panel p-6 bg-slate-900/90 z-30"
              >
                 <Zap className="text-amber-400 w-8 h-8 mb-3" />
                 <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Processing</div>
                 <div className="text-lg font-black text-white">Neuro-PAS™</div>
              </motion.div>

              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute -bottom-8 -right-8 glass-panel p-6 bg-brand-primary z-30 shadow-[0_15px_40px_rgba(109,40,217,0.4)]"
              >
                 <BarChart3 className="text-white w-8 h-8 mb-3" />
                 <div className="text-xs font-black uppercase tracking-widest text-purple-200 mb-1">Efficiency</div>
                 <div className="text-2xl font-black text-white">+88.4%</div>
              </motion.div>
            </motion.div>
          </section>

          {/* CTA Section */}
          <section className="py-32 relative text-center">
            <motion.div 
              variants={itemVariants}
              className="glass-panel p-16 md:p-24 bg-gradient-to-br from-purple-600/10 via-transparent to-amber-500/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-500 opacity-50" />
              
              <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                  {get(homepage.ctaHeading_en, homepage.ctaHeading_ar)}
                </h2>
                <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                  {get(homepage.ctaDesc_en, homepage.ctaDesc_ar)}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                  <Link to="/login" className="btn-premium px-12 py-5 no-underline text-lg">
                    {t('start_free_trial')}
                  </Link>
                  <button 
                    onClick={() => alert('Connecting to sales nexus...')}
                    className="px-10 py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-purple-50 transition-all text-lg shadow-xl"
                  >
                    {t('contact_sales')}
                  </button>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-[20%] -right-[20%] w-[50%] h-[50%] bg-purple-500/20 blur-[120px] rounded-full group-hover:bg-purple-500/30 transition-all duration-1000" />
            </motion.div>
          </section>

          {/* Footer Component */}
          <footer className="py-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Link to="/" className="flex items-center gap-2 no-underline group">
                <Sparkles className="text-purple-500 w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span className="text-lg font-black tracking-widest uppercase">
                  PAS<span className="text-purple-400">lytics</span>
                </span>
              </Link>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                Neural Marketing Intelligence
              </p>
            </div>
            
            <div className="flex gap-12">
              <a href="#" className="text-slate-500 hover:text-white text-xs font-black no-underline uppercase tracking-widest transition-colors">{t('privacy_policy')}</a>
              <a href="#" className="text-slate-500 hover:text-white text-xs font-black no-underline uppercase tracking-widest transition-colors">{t('terms_of_service')}</a>
              <a href="#" className="text-slate-500 hover:text-white text-xs font-black no-underline uppercase tracking-widest transition-colors">{t('contact')}</a>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex gap-4">
                 {[Globe, Rocket, Zap].map((Icon, i) => (
                   <div key={i} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-purple-400 hover:bg-white/10 transition-all cursor-pointer">
                     <Icon className="w-4 h-4" />
                   </div>
                 ))}
              </div>
              <div className="text-[10px] font-medium text-slate-700 uppercase tracking-widest">
                © {new Date().getFullYear()} PASlytics AI. {t('all_rights_reserved')}
              </div>
            </div>
          </footer>
        </motion.main>
      </div>
    </div>
  );
};

export default LandingPage;
