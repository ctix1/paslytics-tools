import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import Navbar from '../components/Navbar';
import { useSubscription } from '../context/SubscriptionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ChevronDown, 
  Zap, 
  ShieldCheck, 
  Users, 
  Headphones,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const Plan = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  const { subscription } = useSubscription();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: t('faq_cancel_q'), a: t('faq_cancel_a') },
    { q: t('faq_pas_q'), a: t('faq_pas_a') },
    { q: t('faq_enterprise_q'), a: t('faq_enterprise_a') },
  ];

  const monthlyFeatures = [
    { label: t('plan_feature_image'), icon: Sparkles },
    { label: t('plan_feature_pas'), icon: CheckCircle2 },
    { label: t('plan_feature_logs'), icon: ShieldCheck },
    { label: t('plan_feature_team'), icon: Users, disabled: true },
    { label: t('plan_feature_support'), icon: Headphones, disabled: true },
  ];

  const annualFeatures = [
    { label: t('plan_feature_image'), icon: Sparkles },
    { label: t('plan_feature_pas'), icon: CheckCircle2 },
    { label: t('plan_feature_logs'), icon: ShieldCheck },
    { label: t('plan_feature_team'), icon: Users, highlight: true },
    { label: t('plan_feature_support'), icon: Headphones, highlight: true },
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
            className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-tight"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32 items-stretch">
          
          {/* Monthly Plan */}
          <motion.div 
            variants={itemVariants}
            className="glass-panel p-10 group relative flex flex-col h-full bg-slate-900/40"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-black text-white mb-2">{t('plan_monthly_title')}</h2>
              <p className="text-slate-400 text-sm">{t('plan_monthly_desc')}</p>
            </div>

            <div className="mb-10 flex items-end gap-2">
              <span className="text-6xl font-black text-white tracking-tighter">$19</span>
              <span className="text-slate-500 font-bold mb-2 uppercase text-xs tracking-widest">/ {t('per_month')}</span>
            </div>

            <div className="flex-grow space-y-8 mb-10">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                {t('whats_included')}
              </div>
              <ul className="space-y-4">
                {monthlyFeatures.map((f, i) => (
                  <li key={i} className={`flex items-center gap-4 transition-opacity ${f.disabled ? 'opacity-30' : 'opacity-100'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${f.disabled ? 'bg-slate-800' : 'bg-purple-500/20'}`}>
                      <f.icon className={`w-4 h-4 ${f.disabled ? 'text-slate-600' : 'text-purple-400'}`} />
                    </div>
                    <span className="text-sm font-bold text-slate-200">{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {subscription.plan === 'monthly' ? (
              <div className="w-full py-4 bg-purple-500/10 border border-purple-500/30 text-purple-400 font-black rounded-2xl text-center text-sm">
                 ✓ {t('paysettings_active_plan')}
              </div>
            ) : (
              <button
                onClick={() => subscription.plan === 'none' && navigate('/checkout/monthly')}
                disabled={subscription.plan === 'annual'}
                className="btn-premium w-full !bg-white !text-slate-950 !py-4 hover:!bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
              >
                {t('choose_plan')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </motion.div>

          {/* Annual Plan */}
          <motion.div 
            variants={itemVariants}
            className="glass-panel p-10 group relative border-purple-500/50 flex flex-col h-full bg-gradient-to-br from-purple-500/10 to-transparent"
          >
            {/* Recommendation Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_5px_15px_rgba(109,40,217,0.4)]">
              {t('best_value')}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-white mb-2">{t('plan_annual_title')}</h2>
              <p className="text-slate-400 text-sm">{t('plan_annual_desc')}</p>
            </div>

            <div className="mb-10 min-h-[100px]">
              <div className="flex items-end gap-2">
                <span className="text-6xl font-black text-white tracking-tighter">$204</span>
                <span className="text-slate-500 font-bold mb-2 uppercase text-xs tracking-widest">/ {t('per_year')}</span>
              </div>
              <div className="text-brand-primary font-black text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {t('annual_savings')}
              </div>
            </div>

            <div className="flex-grow space-y-8 mb-10">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                {t('everything_monthly_plus')}
              </div>
              <ul className="space-y-4">
                {annualFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${f.highlight ? 'bg-amber-500/20' : 'bg-purple-500/20'}`}>
                      <f.icon className={`w-4 h-4 ${f.highlight ? 'text-amber-400' : 'text-purple-400'}`} />
                    </div>
                    <span className={`text-sm font-bold ${f.highlight ? 'text-amber-400' : 'text-slate-200'}`}>
                      {f.label}
                    </span>
                    {f.highlight && <div className="ml-auto text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">Pro</div>}
                  </li>
                ))}
              </ul>
            </div>

            {subscription.plan === 'annual' ? (
              <div className="w-full py-4 bg-brand-primary/20 border border-brand-primary/50 text-white font-black rounded-2xl text-center text-sm">
                 ✓ {t('paysettings_active_plan')}
              </div>
            ) : (
              <button
                onClick={() => subscription.plan !== 'annual' && navigate('/checkout/annual')}
                disabled={subscription.plan === 'monthly'}
                className="btn-premium w-full !py-4 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
              >
                {t('choose_plan')}
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            )}
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
