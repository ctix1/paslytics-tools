import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '../context/SubscriptionContext';
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  Headphones,
  Sparkles,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Plan = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  const { subscribe } = useSubscription();
  const { } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: t('faq_cancel_q'), a: t('faq_cancel_a') },
    { q: t('faq_pas_q'), a: t('faq_pas_a') },
    { q: t('faq_enterprise_q'), a: t('faq_enterprise_a') },
  ];

  const allFeatures = [
    { label: t('plan_feature_image'), icon: Sparkles },
    { label: t('plan_feature_pas'), icon: CheckCircle2 },
    { label: t('plan_feature_tools'), icon: Zap },
    { label: t('plan_feature_logs'), icon: ShieldCheck },
    { label: t('plan_feature_support'), icon: Headphones },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-white ${isRtl ? 'font-arabic' : ''}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <Navbar />

      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-6 py-20"
      >
        {/* Hero Section */}
        <section className="text-center mb-24">
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-black uppercase tracking-widest mb-8"
          >
            <Zap className="w-3.5 h-3.5" />
            {t('plan_plans_badge')}
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-black mb-8 tracking-tighter leading-tight"
          >
            {t('plan_title_1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
              {t('plan_title_2')}
            </span>{' '}
            {t('plan_title_3')}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {t('plan_subtitle')}
          </motion.p>
        </section>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32 items-stretch">
          
          {/* Starter Plan */}
          <motion.div 
            variants={itemVariants}
            className="glass-panel p-8 group relative flex flex-col h-full bg-slate-900/40 border-white/5"
          >
            <div className="mb-8">
              <h2 className="text-xl font-black text-white mb-2">{isRtl ? 'خطة المبتدئين' : 'Beginner Plan'}</h2>
              <p className="text-slate-400 text-xs">{isRtl ? 'صالحة لمدة 5 أيام' : 'Valid for 5 days'}</p>
            </div>

            <div className="mb-10 flex items-end gap-2">
              <span className="text-5xl font-black text-white tracking-tighter">$3.94</span>
            </div>

            <div className="flex-grow space-y-6 mb-10">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                {t('whats_included')}
              </div>
              <ul className="space-y-4">
                {allFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/5">
                      <f.icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-300">{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => { subscribe('starter'); navigate('/dashboard'); }}
              className="btn-premium w-full !bg-white/5 !text-white !py-3 hover:!bg-white/10 group flex items-center justify-center gap-2"
            >
              {t('choose_plan')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Monthly Plan */}
          <motion.div 
            variants={itemVariants}
            className="glass-panel p-8 group relative flex flex-col h-full bg-slate-900/40"
          >
            <div className="mb-8">
              <h2 className="text-xl font-black text-white mb-2">{isRtl ? 'خطة برو' : 'Pro Plan'}</h2>
              <p className="text-slate-400 text-xs">{isRtl ? 'لمدة 1 شهر' : 'For 1 month'}</p>
            </div>

            <div className="mb-10 flex items-end gap-2">
              <span className="text-5xl font-black text-white tracking-tighter">$19</span>
            </div>

            <div className="flex-grow space-y-6 mb-10">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                {t('whats_included')}
              </div>
              <ul className="space-y-4">
                {allFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-purple-500/20">
                      <f.icon className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => { subscribe('monthly'); navigate('/dashboard'); }}
              className="btn-premium w-full !bg-white !text-slate-950 !py-3 hover:!bg-purple-50 group flex items-center justify-center gap-2"
            >
              {t('choose_plan')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Annual Plan */}
          <motion.div 
            variants={itemVariants}
            className="glass-panel p-8 group relative border-purple-500/50 flex flex-col h-full bg-gradient-to-br from-purple-500/10 to-transparent"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-brand-primary text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
              {t('best_value')}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-black text-white mb-2">{isRtl ? 'خطة بريميوم' : 'Premium Plan'}</h2>
              <p className="text-slate-400 text-xs">{isRtl ? 'لمدة 1 سنة' : 'For 1 year'}</p>
            </div>

            <div className="mb-10">
                <span className="text-5xl font-black text-white tracking-tighter">$49</span>
              <div className="text-brand-primary font-black text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {t('annual_savings')}
              </div>
            </div>

            <div className="flex-grow space-y-6 mb-10">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                {t('whats_included')}
              </div>
              <ul className="space-y-4">
                {allFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-purple-500/20">
                      <f.icon className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => { subscribe('annual'); navigate('/dashboard'); }}
              className="btn-premium w-full !py-3 group flex items-center justify-center gap-2"
            >
              {t('choose_plan')}
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto mb-32">
          <motion.h2 variants={itemVariants} className="text-4xl font-black text-center mb-16 tracking-tight">
            {t('faq_title')}
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-panel overflow-hidden cursor-pointer hover:bg-white/[0.03] transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="p-6 flex items-center justify-between">
                  <span className="text-base font-black text-slate-200">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-slate-400 text-sm leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-16 pb-32 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-2 no-underline opacity-50 hover:opacity-100 transition-opacity">
            <Sparkles className="text-purple-500 w-5 h-5" />
            <span className="font-black text-white text-sm uppercase tracking-widest">PASlytics</span>
          </Link>

          <div className="flex gap-8">
            <a href="#" className="text-slate-500 hover:text-white text-xs font-bold no-underline uppercase tracking-widest">{t('privacy_policy')}</a>
            <a href="#" className="text-slate-500 hover:text-white text-xs font-bold no-underline uppercase tracking-widest">{t('terms_of_service')}</a>
            <a href="#" className="text-slate-500 hover:text-white text-xs font-bold no-underline uppercase tracking-widest">{t('contact')}</a>
          </div>

          <div className="text-slate-600 text-[10px] font-medium uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} PASlytics AI. {t('all_rights_reserved')}
          </div>
        </footer>
      </motion.main>
    </div>
  );
};

export default Plan;
