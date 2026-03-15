import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { supabase } from '../lib/supabase';

const Profile = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';
  const { subscription, cancel } = useSubscription();

  // State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [desktopNotif, setDesktopNotif] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelledMsg, setCancelledMsg] = useState<string | null>(null);

  useEffect(() => {
    // 1. Try local storage
    try {
      const profileRaw = localStorage.getItem('user_profile');
      if (profileRaw) {
        const profile = JSON.parse(profileRaw);
        const names = profile.name?.split(' ') || [];
        setFirstName(names[0] || '');
        setLastName(names.slice(1).join(' ') || '');
        setEmail(profile.email || '');
      }
    } catch (e) {
      console.warn('Profile: Error parsing user_profile', e);
    }

    // 2. Fetch from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const full_name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '';
        const names = full_name.split(' ');
        setFirstName(names[0] || '');
        setLastName(names.slice(1).join(' ') || '');
        setEmail(session.user.email || '');
      }
    });
  }, []);


  const handleSave = () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    // Mock save delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus(t('save_success') || 'Settings saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 800);
  };

  return (
    <div className="p-8" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8" style={{ paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
            <div>
              <h1 style={{ fontSize: '20px', marginBottom: '4px' }}>{t('account_settings')}</h1>
              <p>{t('manage_profile')}</p>
            </div>
            <div className="flex items-center gap-4">
              {saveStatus && <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: 500 }}>{saveStatus}</span>}
              <button 
                className="btn btn-primary" 
                style={{ background: '#6c2bd9', opacity: isSaving ? 0.7 : 1, transition: 'all 0.2s' }}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? '...' : t('save_changes')}
              </button>
            </div>
          </div>

          {/* Profile Header Card */}
          <div className="card p-8 mb-6 flex items-center gap-6">
            <div style={{ position: 'relative' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #f3e8ff' }}>
                <img src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Alex&backgroundColor=fbebc8" alt="Alex" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <button 
                onClick={() => alert('Change Avatar Clicked')}
                style={{ position: 'absolute', bottom: 0, [isRtl ? 'left' : 'right']: 0, background: 'white', border: '1px solid var(--border)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
              >
                <svg width="12" height="12" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 style={{ fontSize: '22px' }}>{firstName} {lastName}</h2>
                <span className="badge badge-purple">{t('analyst_role')}</span>
              </div>
              <p className="mb-2">{email || 'user@example.com'}</p>
              <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>{t('member_since')}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="card p-6 mb-6">
            <h3 className="mb-6" style={{ textTransform: 'none', fontSize: '16px', color: 'var(--text-dark)' }}>{t('personal_info')}</h3>
            <div className="flex gap-4 mb-6">
              <div className="w-full">
                <label>{t('first_name')}</label>
                <input 
                  type="text" 
                  className="input" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ textAlign: isRtl ? 'right' : 'left' }} 
                />
              </div>
              <div className="w-full">
                <label>{t('last_name')}</label>
                <input 
                  type="text" 
                  className="input" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ textAlign: isRtl ? 'right' : 'left' }} 
                />
              </div>
            </div>
            <div>
              <label>{t('biography')}</label>
              <textarea 
                className="input" 
                rows={4} 
                placeholder={t('tell_us')} 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ textAlign: isRtl ? 'right' : 'left' }}
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="card p-6 mb-6">
            <h3 className="mb-6" style={{ textTransform: 'none', fontSize: '16px', color: 'var(--text-dark)' }}>{t('notification_pref')}</h3>
            
            <div className="flex items-start justify-between mb-6">
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{t('email_alerts')}</div>
                <p style={{ fontSize: '13px' }}>{t('email_alerts_desc')}</p>
              </div>
              <input 
                type="checkbox" 
                className="checkbox-toggle" 
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{t('desktop_notif')}</div>
                <p style={{ fontSize: '13px' }}>{t('desktop_notif_desc')}</p>
              </div>
              <input 
                type="checkbox" 
                className="checkbox:toggle" 
                checked={desktopNotif}
                onChange={(e) => setDesktopNotif(e.target.checked)}
              />
            </div>
          </div>

          {/* Security */}
          <div className="card p-6 mb-6">
            <h3 className="mb-6" style={{ textTransform: 'none', fontSize: '16px', color: 'var(--text-dark)' }}>{t('security')}</h3>
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{t('password')}</div>
                <p style={{ fontSize: '13px' }}>{t('last_changed')}</p>
              </div>
              <button 
                className="btn btn-outline"
                style={{ fontSize: '13px', fontWeight: 600, padding: '6px 12px' }}
                onClick={() => alert('Change Password Dialog Opened')}
              >
                {t('change_password')}
              </button>
            </div>
          </div>

          {/* Subscription */}
          <div className="card p-6 mb-6">
            <h3 className="mb-6" style={{ textTransform: 'none', fontSize: '16px', color: 'var(--text-dark)' }}>{t('sub_section_title')}</h3>

            {cancelledMsg && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>
                ✓ {cancelledMsg}
              </div>
            )}

            {subscription.plan === 'none' ? (
              <div className="flex items-center justify-between">
                <p style={{ fontSize: '14px', color: '#94a3b8' }}>{t('sub_no_plan')}</p>
                <a href="/pricing" className="btn btn-primary" style={{ background: '#6c2bd9', fontSize: '13px', padding: '8px 16px', fontWeight: 600, textDecoration: 'none', color: 'white', borderRadius: '8px' }}>
                  {t('sub_choose_plan')}
                </a>
              </div>
            ) : (
              <div>
                {/* Plan info cards */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <div style={{ flex: 1, background: '#f3e8ff', borderRadius: '10px', padding: '16px', minWidth: '140px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9333ea', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>{t('sub_current_plan')}</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#6c2bd9' }}>{subscription.plan === 'annual' ? t('plan_annual_title') : t('plan_monthly_title')}</div>
                  </div>
                  <div style={{ flex: 1, background: '#f8fafc', borderRadius: '10px', padding: '16px', minWidth: '140px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>{t('sub_activated')}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{subscription.activatedAt ? new Date(subscription.activatedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</div>
                  </div>
                  <div style={{ flex: 1, background: '#f8fafc', borderRadius: '10px', padding: '16px', minWidth: '140px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>{t('sub_renews')}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{subscription.renewsAt ? new Date(subscription.renewsAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</div>
                  </div>
                </div>

                {/* Cancel flow */}
                {!showCancelDialog ? (
                  <button
                    className="btn"
                    style={{ color: '#dc2626', fontSize: '13px', fontWeight: 600, padding: '8px 16px', border: '1px solid #fca5a5', borderRadius: '8px', background: 'white' }}
                    onClick={() => setShowCancelDialog(true)}
                  >
                    {t('sub_cancel_btn')}
                  </button>
                ) : (
                  <div style={{ border: '1px solid #fca5a5', borderRadius: '12px', padding: '20px', background: '#fff7f7' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#dc2626', marginBottom: '12px' }}>⚠ {t('sub_cancel_confirm')}</h4>
                    <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6, marginBottom: '20px' }}>{t('sub_cancel_disclaimer')}</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '8px 18px', fontSize: '13px' }}
                        onClick={() => setShowCancelDialog(false)}
                      >
                        {t('cancel')}
                      </button>
                      <button
                        className="btn"
                        style={{ background: '#dc2626', color: 'white', padding: '8px 18px', fontSize: '13px', fontWeight: 700, borderRadius: '8px' }}
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
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
    </div>
  );
};

export default Profile;

