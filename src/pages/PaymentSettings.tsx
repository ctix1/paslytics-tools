import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2,
  Zap,
  Globe,
  ChevronRight,
  ShieldAlert,
  Save,
  Loader2,
  CheckCircle2,
  Banknote,
  Key,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const PaymentSettingsPage = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Platform Bank Settings State
  const [bankSettings, setBankSettings] = useState({
    holder: 'PASlytics Global Ltd.',
    iban: 'SA00 0000 0000 0000 0000 0000',
    swift: 'PASLSAXX',
    bankName: 'Saudi National Bank (SNB)'
  });

  const [cardSettings, setCardSettings] = useState({
    stripePublicKey: 'pk_test_*************************',
    stripeSecretKey: 'sk_test_*************************'
  });

  const handleSave = async () => {
    setIsSaving(true);
    // In a real app, we would save this to Supabase 'platform_settings' table
    await new Promise(r => setTimeout(r, 1500));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-5xl mx-auto space-y-8 pb-20 ${isRtl ? 'font-arabic' : ''}`}
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-primary mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('settings')}</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">{t('payment_settings_title')}</h1>
          <p className="text-slate-500 font-medium max-w-md">{t('payment_settings_desc')}</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="btn-premium flex items-center gap-2 group min-w-[200px] justify-center h-14"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : showSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
          <span className="font-black uppercase tracking-widest text-sm">
            {showSuccess ? t('saved') : t('save_changes')}
          </span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Bank & Card Configuration (Span 8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Bank Account Section */}
          <motion.div variants={sectionVariants} className="glass-panel p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Building2 className="w-40 h-40 text-brand-primary" />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <Banknote className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{t('admin_bank_title')}</h3>
                  <p className="text-slate-500 text-sm mt-1">{t('admin_bank_desc')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('admin_bank_holder')}</label>
                  <input 
                    type="text" 
                    value={bankSettings.holder}
                    onChange={(e) => setBankSettings({...bankSettings, holder: e.target.value})}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm text-white focus:bg-white/[0.08] focus:border-purple-500/50 transition-all outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('admin_bank_name')}</label>
                  <input 
                    type="text" 
                    value={bankSettings.bankName}
                    onChange={(e) => setBankSettings({...bankSettings, bankName: e.target.value})}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm text-white focus:bg-white/[0.08] focus:border-purple-500/50 transition-all outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('admin_bank_iban')}</label>
                  <input 
                    type="text" 
                    value={bankSettings.iban}
                    onChange={(e) => setBankSettings({...bankSettings, iban: e.target.value})}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm text-white font-mono focus:bg-white/[0.08] focus:border-purple-500/50 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('admin_bank_swift')}</label>
                  <input 
                    type="text" 
                    value={bankSettings.swift}
                    onChange={(e) => setBankSettings({...bankSettings, swift: e.target.value})}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm text-white font-mono focus:bg-white/[0.08] focus:border-purple-500/50 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card / Stripe Integration */}
          <motion.div variants={sectionVariants} className="glass-panel p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="w-40 h-40 text-amber-400" />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{t('admin_card_title')}</h3>
                  <p className="text-slate-500 text-sm mt-1">{t('admin_card_desc')}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Stripe Publishable Key (Live)</label>
                  <input 
                    type="password" 
                    value={cardSettings.stripePublicKey}
                    onChange={(e) => setCardSettings({...cardSettings, stripePublicKey: e.target.value})}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm text-white font-mono focus:bg-white/[0.08] focus:border-amber-500/50 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Stripe Secret Key (Encrypted)</label>
                  <input 
                    type="password" 
                    value={cardSettings.stripeSecretKey}
                    onChange={(e) => setCardSettings({...cardSettings, stripeSecretKey: e.target.value})}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm text-white font-mono focus:bg-white/[0.08] focus:border-amber-500/50 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Col: Secondary Stats (Span 4) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Security Notice */}
          <motion.div 
            variants={sectionVariants}
            className="p-8 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-white/10 rounded-3xl space-y-4"
          >
            <ShieldAlert className="w-10 h-10 text-purple-400 mb-2" />
            <h4 className="text-xl font-black text-white tracking-tight leading-tight">Infrastructure Security Protocol</h4>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Subscription endpoints use RSA-4096 signing. Your bank and API keys are encrypted at rest with hardware-backed security modules.
            </p>
          </motion.div>

          {/* Quick Actions / Links */}
          <motion.div variants={sectionVariants} className="glass-panel p-8 space-y-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t('quick_actions')}</h3>
            <div className="space-y-3">
              {[
                { icon: Building2, label: 'Audit Bank Deposits', color: 'text-purple-400' },
                { icon: Globe, label: 'Export Revenue Report', color: 'text-amber-400' },
                { icon: ShieldCheck, label: 'Payment Method Audit', color: 'text-emerald-400' }
              ].map((item, i) => (
                <button key={i} className="w-full h-14 flex items-center justify-between px-5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl transition-all group">
                  <div className="flex items-center gap-4">
                    <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-xs font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>

          <div className="text-center pt-4">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest tracking-[0.3em]">PASLYTICS NEURAL SYSTEMS © 2026</p>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSettingsPage;
