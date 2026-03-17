import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  ShieldCheck, 
  AlertCircle,
  Zap,
  Globe,
  Bell,
  Lock,
  ChevronRight,
  ShieldAlert,
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const PaymentSettingsPage = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
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
      className="max-w-4xl mx-auto space-y-8 pb-20"
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
          className="btn-premium flex items-center gap-2 group min-w-[160px] justify-center"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : showSuccess ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
          <span>{showSuccess ? t('saved') : t('save_changes')}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Main Settings */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Subscription Card */}
          <motion.div variants={sectionVariants} className="glass-panel p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="w-32 h-32 text-brand-primary" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2 px-3 py-1 bg-brand-primary/10 rounded-full w-fit">
                    Active Subscription
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{t('plan_annual_title')}</h3>
                  <p className="text-slate-500 text-sm mt-1">Renews on Oct 24, 2026</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-white tracking-tighter">$204</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Per Year</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer group/item">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-slate-400 group-hover/item:text-brand-primary transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-wider">Visa ending in 4242</div>
                      <div className="text-[10px] text-slate-500 uppercase font-medium">Expires 12/26</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover/item:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                  {t('view_billing_history')}
                </button>
                <button className="flex-1 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/10 rounded-xl text-xs font-black uppercase tracking-widest text-rose-500 transition-all">
                  {t('cancel_subscription')}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Security & Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={sectionVariants} className="glass-panel p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">{t('notifications')}</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Payment Failures', desc: 'Alerts when a payment fails' },
                  { label: 'Renewal Notices', desc: '7 days before your plan renews' },
                  { label: 'Market Updates', desc: 'Weekly AI market performance' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="text-xs font-bold text-slate-300">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </div>
                    <div className="w-10 h-5 bg-slate-800 rounded-full relative cursor-pointer group">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-slate-500 rounded-full group-hover:bg-brand-primary transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={sectionVariants} className="glass-panel p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="w-4 h-5" />
                </div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">{t('security')}</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Two-Factor Auth', val: 'Enabled' },
                  { label: 'Secure Checkout', val: 'Verified' },
                  { label: 'Data Encryption', val: 'AES-256' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{item.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Col: Details & Help */}
        <div className="space-y-8">
          
          {/* Important Notice */}
          <motion.div 
            variants={sectionVariants}
            className="p-8 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/20 rounded-3xl space-y-4"
          >
            <ShieldAlert className="w-8 h-8 text-brand-primary mb-2" />
            <h4 className="text-lg font-black text-white tracking-tight leading-tight">Your data is secured using end-to-end encryption.</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              We never store your full card details on our servers. All transactions are handled by PCI-DSS compliant providers.
            </p>
          </motion.div>

          {/* Help & Links */}
          <motion.div variants={sectionVariants} className="glass-panel p-8 space-y-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t('quick_actions')}</h3>
            <div className="space-y-2">
              {[
                { icon: Globe, label: 'Download Invoices' },
                { icon: Lock, label: 'Privacy Policy' },
                { icon: AlertCircle, label: 'Support Center' }
              ].map((item, i) => (
                <button key={i} className="w-full h-12 flex items-center justify-between px-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Brand Tag */}
          <div className="text-center pt-4">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">PASLYTICS © 2026</p>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSettingsPage;
