```javascript
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  CreditCard,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Sparkles,
  Lock,
  Loader2,
  Calendar,
  User,
  Hash
} from 'lucide-react';

type Step = 'summary' | 'payment' | 'processing' | 'success';
type PaymentTab = 'card' | 'bank';

/* ── helpers ── */
function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}
function isValidExpiry(val: string): boolean {
  const parts = val.split('/');
  if (parts.length !== 2) return false;
  const month = parseInt(parts[0], 10);
  const year = parseInt('20' + parts[1], 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const exp = new Date(year, month - 1, 1);
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
}

const Checkout = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';
  const { plan } = useParams<{ plan: string }>();
  const navigate = useNavigate();
  const { subscribe } = useSubscription();

  const isAnnual = plan === 'annual';
  const price = isAnnual ? '$204' : '$19';
  const period = isAnnual ? t('per_year') : t('per_month');

  const [step, setStep] = useState<Step>('summary');
  const [tab, setTab] = useState<PaymentTab>('card');

  // Card fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const features = [
    t('plan_feature_image'),
    t('plan_feature_pas'),
    t('plan_feature_logs'),
    ...(isAnnual ? [t('plan_feature_team'), t('plan_feature_support')] : []),
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (tab === 'card') {
      if (!cardName.trim()) errs.cardName = t('checkout_err_name');
      const digits = cardNumber.replace(/\s/g, '');
      if (digits.length < 16) errs.cardNumber = t('checkout_err_card');
      if (!isValidExpiry(expiry)) errs.expiry = t('checkout_err_expiry');
      if (cvv.length < 3) errs.cvv = t('checkout_err_cvv');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setStep('processing');
    setCardNumber('');
    setCvv('');
    setTimeout(() => {
      subscribe(isAnnual ? 'annual' : 'monthly');
      setStep('success');
    }, 2500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  /* ════════════════════════════════════════════════════
     SIDEBAR (same inline pattern as rest of app)
  ═════════════════════════════════════════════════════ */
  const Sidebar = () => (
    <aside className="sidebar" style={{ borderInlineEnd: '1px solid var(--border)', ...(isRtl ? { left: 'auto', right: 0 } : {}) }}>
      <div className="sidebar-logo flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div style={{ width: '28px', height: '28px', background: '#6c2bd9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
          </div>
          {t('app_name')}
        </div>
        <button onClick={toggleLanguage} className="btn" style={{ padding: '4px 8px', fontSize: '10px' }}>
          {isRtl ? 'EN' : 'AR'}
        </button>
      </div>

      <nav className="sidebar-nav mt-4" style={{ flex: 1 }}>
        <Link to="/dashboard" className="nav-item">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          {t('dashboard')}
        </Link>
        <Link to="/pricing" className="nav-item active" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', [isRtl ? 'right' : 'left']: '-24px', top: 0, bottom: 0, width: '4px', background: 'var(--primary)', borderRadius: isRtl ? '4px 0 0 4px' : '0 4px 4px 0' }}></div>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          {t('plan')}
        </Link>
        <Link to="/settings" className="nav-item">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          {t('profile_settings')}
        </Link>
      </nav>

      <nav className="sidebar-nav mt-auto" style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
        <Link to="/login" className="nav-item">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          {t('logout')}
        </Link>
      </nav>
    </aside>
  );

  /* ══════════════ SUCCESS SCREEN ══════════════ */
  if (step === 'success') {
    return (
      <div className={`min-h-screen bg-slate-950 flex items-center justify-center p-6 ${isRtl ? 'font-arabic' : ''}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel max-w-lg w-full p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500" />

          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>

          <h1 className="text-3xl font-black text-white mb-4 tracking-tighter">{t('checkout_success_title')}</h1>
          <p className="text-slate-400 font-medium mb-10">{t('checkout_success_desc')}</p>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10">
            <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-2">
              {isAnnual ? t('plan_annual_title') : t('plan_monthly_title')}
            </div>
            <div className="text-5xl font-black text-white tracking-tighter">
              {price}<span className="text-sm font-medium text-slate-500 ml-2">{period}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              className="btn-premium py-4 !text-sm flex items-center justify-center gap-2 group"
              onClick={() => navigate('/dashboard')}
            >
              {t('checkout_go_dashboard')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link to="/settings" className="text-xs font-black text-slate-500 uppercase tracking-widest no-underline hover:text-white transition-colors">
              {t('checkout_view_subscription')}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ══════════════ MAIN RENDER ══════════════ */
  return (
    <div className={`min-h-screen bg-slate-950 text-white ${isRtl ? 'font-arabic' : ''}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 lg:py-32">

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/plan')}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">{t('checkout_back')}</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mt-4">{t('checkout_title')}</h1>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
        >
          {/* ── Left: Main Content ── */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {step === 'summary' && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-panel p-10"
                >
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black">{t('checkout_order_summary')}</h2>
                  </div>

                  <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 mb-10">
                    <div className="flex justify-between items-end mb-8 pb-8 border-b border-white/5">
                      <div>
                        <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-1">Current Plan Selection</div>
                        <div className="text-3xl font-black text-white tracking-tighter">{isAnnual ? t('plan_annual_title') : t('plan_monthly_title')}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-white tracking-tighter">{price}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{period}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-bold">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn-premium w-full py-5 !text-lg flex items-center justify-center gap-3 group"
                    onClick={() => setStep('payment')}
                  >
                    <span>{t('checkout_proceed')}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-panel p-10"
                >
                  <div className="flex items-center justify-between gap-3 mb-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-black">{t('checkout_secure')}</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                      {(['card', 'bank'] as const).map(tb => (
                        <button
                          key={tb}
                          onClick={() => setTab(tb)}
                          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer ${
                            tab === tb ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'
                          }`}
                        >
                          {tb === 'card' ? t('checkout_tab_card') : t('checkout_tab_bank')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {tab === 'card' ? (
                      <motion.div
                        key="card-form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('checkout_cardholder')}</label>
                           <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                              <input
                                type="text"
                                className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-12 text-sm text-white placeholder:text-slate-600 focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all outline-none"
                                placeholder="ALEXANDER VOGEL"
                                value={cardName}
                                onChange={e => setCardName(e.target.value)}
                              />
                           </div>
                           {errors.cardName && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.cardName}</p>}
                         </div>

                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('checkout_card_number')}</label>
                           <div className="relative">
                              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                              <input
                                type="text"
                                className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-12 text-sm text-white font-mono tracking-widest focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all outline-none"
                                placeholder="4242 4242 4242 4242"
                                value={cardNumber}
                                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                              />
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <CreditCard className="w-6 h-6 text-slate-600" />
                              </div>
                           </div>
                           {errors.cardNumber && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.cardNumber}</p>}
                         </div>

                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('checkout_expiry')}</label>
                              <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                  type="text"
                                  className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-12 text-sm text-white focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all outline-none"
                                  placeholder="MM/YY"
                                  value={expiry}
                                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                                />
                              </div>
                              {errors.expiry && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.expiry}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('checkout_cvv')}</label>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                  type="password"
                                  className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-12 text-sm text-white focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all outline-none"
                                  placeholder="***"
                                  maxLength={4}
                                  value={cvv}
                                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                />
                              </div>
                              {errors.cvv && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">{errors.cvv}</p>}
                            </div>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="bank-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl"
                      >
                         <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                           <Building2 className="w-5 h-5 text-purple-400" />
                           {t('checkout_bank_title')}
                         </h3>
                         <div className="space-y-4">
                            {[
                              { label: t('checkout_bank_name'), value: 'PASlytics Global' },
                              { label: t('checkout_bank_iban'), value: 'SA00 0000 0000 0000 0000 0000' },
                              { label: t('checkout_bank_swift'), value: 'PASLSAXX' },
                              { label: t('checkout_bank_amount'), value: `${price} ${period}` },
                            ].map((row, i) => (
                              <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-none">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{row.label}</span>
                                <span className="text-sm font-mono text-white select-all">{row.value}</span>
                              </div>
                            ))}
                         </div>
                         <p className="mt-6 text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-widest">
                           ℹ️ {t('checkout_bank_note')}
                         </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <button
                      className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all text-sm font-black uppercase tracking-widest cursor-pointer"
                      onClick={() => setStep('summary')}
                    >
                      {t('checkout_back')}
                    </button>
                    <button
                      className="btn-premium flex-1 py-4 !text-sm flex items-center justify-center gap-2 group"
                      onClick={handlePay}
                    >
                      <Sparkles className="w-4 h-4" />
                      {tab === 'card' ? t('checkout_pay_now') : t('checkout_confirm_transfer')}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'processing' && (
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
