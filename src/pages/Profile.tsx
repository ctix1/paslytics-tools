import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, AlertCircle, Camera } from 'lucide-react';

const Profile = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const { subscription, cancel } = useSubscription();

  const { profile } = useAuth();
  
  // State
  const [firstName, setFirstName] = useState(profile?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(profile?.name?.split(' ').slice(1).join(' ') || '');
  const [bio, setBio] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [desktopNotif, setDesktopNotif] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelledMsg, setCancelledMsg] = useState<string | null>(null);

  // Sync state with profile once loaded
  useEffect(() => {
    if (profile) {
      setFirstName(profile.name.split(' ')[0] || '');
      setLastName(profile.name.split(' ').slice(1).join(' ') || '');
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: `${firstName} ${lastName}`.trim() }
      });
      if (error) throw error;
      
      setSaveStatus(t('save_success') || 'Settings saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 p-8 glass-panel">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{t('profile_settings')}</h1>
          <p className="text-slate-400 text-sm font-medium">{t('manage_profile')}</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {saveStatus && (
            <motion.span 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-emerald-400 text-xs font-bold"
            >
              ✓ {saveStatus}
            </motion.span>
          )}
          <button 
            className="btn-premium flex-1 md:flex-none disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '...' : t('save_changes')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Header Card */}
        <div className="glass-panel p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-3xl rounded-full" />
          
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-brand-primary/30 shadow-2xl group-hover:border-brand-primary/60 transition-colors">
              <img 
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${profile?.name || 'User'}&backgroundColor=fbebc8`} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
            <button 
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/40 hover:scale-110 active:scale-95 transition-all border-none cursor-pointer"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h2 className="text-2xl font-black text-white tracking-tight leading-none">{firstName} {lastName}</h2>
              <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary border border-brand-primary/30 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none">
                {t('analyst_role')}
              </span>
            </div>
            <p className="text-slate-400 font-medium mb-4">{profile?.email || '—'}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full border border-white/5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {t('member_since')}
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="glass-panel p-8 space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-brand-primary" />
              {t('personal_info')}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('first_name')}</label>
                  <input 
                    type="text" 
                    className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-5 text-sm text-white focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all outline-none"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('last_name')}</label>
                  <input 
                    type="text" 
                    className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl px-5 text-sm text-white focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all outline-none"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('biography')}</label>
                <textarea 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-sm text-white min-h-[120px] focus:bg-white/[0.08] focus:border-brand-primary/50 transition-all outline-none"
                  placeholder={t('tell_us')} 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Preferences & Security */}
          <div className="space-y-8">
            <div className="glass-panel p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                {t('notification_pref')}
              </h3>
              
              <div className="space-y-6">
                {[
                  { 
                    label: t('email_alerts'), 
                    desc: t('email_alerts_desc'), 
                    checked: emailAlerts, 
                    setter: setEmailAlerts 
                  },
                  { 
                    label: t('desktop_notif'), 
                    desc: t('desktop_notif_desc'), 
                    checked: desktopNotif, 
                    setter: setDesktopNotif 
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
                    <div>
                      <div className="text-xs font-bold text-white mb-1">{item.label}</div>
                      <p className="text-[10px] text-slate-500 m-0">{item.desc}</p>
                    </div>
                    <div 
                      onClick={() => item.setter(!item.checked)}
                      className={`w-10 h-6 rounded-full cursor-pointer transition-all relative p-1 ${item.checked ? 'bg-emerald-500' : 'bg-slate-800'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? (isRtl ? '-translate-x-4' : 'translate-x-4') : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                {t('security')}
              </h3>
              <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-white mb-1">{t('password')}</div>
                  <p className="text-[10px] text-slate-500 m-0">{t('last_changed')}</p>
                </div>
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 transition-all border-none cursor-pointer">
                  {t('change_password')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="glass-panel p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-3xl rounded-full" />
          
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-8 relative z-10">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            {t('sub_section_title')}
          </h3>

          {cancelledMsg && (
            <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" />
              {cancelledMsg}
            </div>
          )}

          {subscription.plan === 'none' ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-white/[0.02] border border-white/5 rounded-[2rem] text-center md:text-left">
              <div>
                <h4 className="text-xl font-black text-white mb-2">{t('sub_no_plan')}</h4>
                <p className="text-slate-400 text-sm font-medium">{isRtl ? 'افتح جميع الميزات المتقدمة اليوم.' : 'Unlock all advanced tools today.'}</p>
              </div>
              <Link to="/plan" className="btn-premium no-underline flex items-center gap-2">
                {t('sub_choose_plan')}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: t('sub_current_plan'), val: subscription.plan === 'annual' ? t('plan_annual_title') : t('plan_monthly_title'), active: true },
                  { label: t('sub_activated'), val: subscription.activatedAt ? new Date(subscription.activatedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                  { label: t('sub_renews'), val: subscription.renewsAt ? new Date(subscription.renewsAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' }
                ].map((stat, i) => (
                  <div key={i} className={`p-6 rounded-2xl border ${stat.active ? 'bg-brand-primary/10 border-brand-primary/30' : 'bg-white/[0.02] border-white/5'}`}>
                    <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${stat.active ? 'text-brand-primary' : 'text-slate-500'}`}>{stat.label}</div>
                    <div className={`text-lg font-black ${stat.active ? 'text-white' : 'text-slate-300'}`}>{stat.val}</div>
                  </div>
                ))}
              </div>

              {!showCancelDialog ? (
                <button
                  className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all border-none cursor-pointer"
                  onClick={() => setShowCancelDialog(true)}
                >
                  {t('sub_cancel_btn')}
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2rem] space-y-6"
                >
                  <div className="flex items-center gap-4 text-red-500">
                    <AlertCircle className="w-8 h-8" />
                    <h4 className="text-xl font-black">{t('sub_cancel_confirm')}</h4>
                  </div>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{t('sub_cancel_disclaimer')}</p>
                  <div className="flex gap-4">
                    <button
                      className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all border-none cursor-pointer"
                      onClick={() => setShowCancelDialog(false)}
                    >
                      {t('cancel')}
                    </button>
                    <button
                      className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all border-none cursor-pointer"
                      onClick={() => {
                        cancel();
                        setShowCancelDialog(false);
                        setCancelledMsg(t('sub_cancelled_msg'));
                        setTimeout(() => setCancelledMsg(null), 5000);
                      }}
                    >
                      {t('sub_cancel_proceed')}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

