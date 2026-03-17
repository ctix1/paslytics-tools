import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { css } from '../../styled-system/css';

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
    <div className={css({ maxWidth: '900px', margin: '0 auto' })}>
      
      {/* Header */}
      <div className={css({ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px', 
        paddingBottom: '24px', 
        borderBottom: '1px solid',
        borderColor: 'slate.100'
      })}>
        <div>
          <h1 className={css({ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', color: 'slate.900' })}>{t('account_settings')}</h1>
          <p className={css({ color: 'slate.500', fontSize: '14px' })}>{t('manage_profile')}</p>
        </div>
        <div className={css({ display: 'flex', alignItems: 'center', gap: '16px' })}>
          {saveStatus && <span className={css({ color: 'green.600', fontSize: '13px', fontWeight: 500 })}>{saveStatus}</span>}
          <button 
            className={css({
              paddingY: '10px',
              paddingX: '20px',
              borderRadius: 'xl',
              backgroundColor: 'brand.primary',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              opacity: isSaving ? 0.7 : 1,
              transition: 'all',
              _hover: { backgroundColor: 'brand.secondary' }
            })}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '...' : t('save_changes')}
          </button>
        </div>
      </div>

      <div className={css({ display: 'grid', gap: '24px' })}>
        {/* Profile Header Card */}
        <div className={css({
          backgroundColor: 'white',
          borderRadius: '2xl',
          padding: '32px',
          border: '1px solid',
          borderColor: 'slate.100',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: 'sm'
        })}>
          <div className={css({ position: 'relative' })}>
            <div className={css({ 
              width: '100px', 
              height: '100px', 
              borderRadius: 'full', 
              overflow: 'hidden', 
              border: '3px solid',
              borderColor: 'violet.50'
            })}>
              <img 
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${profile?.name || 'User'}&backgroundColor=fbebc8`} 
                alt="Profile" 
                className={css({ width: '100%', height: '100%', objectFit: 'cover' })} 
              />
            </div>
            <button 
              onClick={() => alert('Change Avatar Clicked')}
              className={css({
                position: 'absolute',
                bottom: '0',
                left: isRtl ? '0' : 'auto',
                right: isRtl ? 'auto' : '0',
                backgroundColor: 'white',
                border: '1px solid',
                borderColor: 'slate.200',
                borderRadius: 'full',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'sm',
                _hover: { backgroundColor: 'slate.50' }
              })}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
          </div>
          <div>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' })}>
              <h2 className={css({ fontSize: '22px', fontWeight: 'bold', color: 'slate.900' })}>{firstName} {lastName}</h2>
              <span className={css({
                paddingY: '2px',
                paddingX: '8px',
                backgroundColor: 'violet.100',
                color: 'violet.700',
                borderRadius: 'full',
                fontSize: '11px',
                fontWeight: 'bold'
              })}>{t('analyst_role')}</span>
            </div>
            <p className={css({ color: 'slate.500', marginBottom: '8px' })}>{profile?.email || '—'}</p>
            <p className={css({ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 'wider', color: 'slate.400' })}>{t('member_since')}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className={css({
          backgroundColor: 'white',
          borderRadius: '2xl',
          padding: '24px',
          border: '1px solid',
          borderColor: 'slate.100',
          boxShadow: 'sm'
        })}>
          <h3 className={css({ fontSize: '16px', fontWeight: 'bold', color: 'slate.900', marginBottom: '24px' })}>{t('personal_info')}</h3>
          <div className={css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' })}>
            <div className={css({ display: 'grid', gap: '8px' })}>
              <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700' })}>{t('first_name')}</label>
              <input 
                type="text" 
                className={css({
                  padding: '12px',
                  borderRadius: 'xl',
                  border: '1px solid',
                  borderColor: 'slate.200',
                  fontSize: '14px',
                  _focus: { borderColor: 'brand.primary', outline: 'none' }
                })} 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className={css({ display: 'grid', gap: '8px' })}>
              <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700' })}>{t('last_name')}</label>
              <input 
                type="text" 
                className={css({
                  padding: '12px',
                  borderRadius: 'xl',
                  border: '1px solid',
                  borderColor: 'slate.200',
                  fontSize: '14px',
                  _focus: { borderColor: 'brand.primary', outline: 'none' }
                })} 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className={css({ display: 'grid', gap: '8px' })}>
            <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700' })}>{t('biography')}</label>
            <textarea 
              className={css({
                padding: '12px',
                borderRadius: 'xl',
                border: '1px solid',
                borderColor: 'slate.200',
                fontSize: '14px',
                width: '100%',
                minHeight: '100px',
                _focus: { borderColor: 'brand.primary', outline: 'none' }
              })} 
              rows={4} 
              placeholder={t('tell_us')} 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className={css({
          backgroundColor: 'white',
          borderRadius: '2xl',
          padding: '24px',
          border: '1px solid',
          borderColor: 'slate.100',
          boxShadow: 'sm'
        })}>
          <h3 className={css({ fontSize: '16px', fontWeight: 'bold', color: 'slate.900', marginBottom: '24px' })}>{t('notification_pref')}</h3>
          
          <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' })}>
            <div>
              <div className={css({ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px', color: 'slate.900' })}>{t('email_alerts')}</div>
              <p className={css({ color: 'slate.500', fontSize: '13px' })}>{t('email_alerts_desc')}</p>
            </div>
            <input 
              type="checkbox" 
              className={css({ width: '40px', height: '20px', cursor: 'pointer' })} 
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
            />
          </div>
          
          <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
            <div>
              <div className={css({ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px', color: 'slate.900' })}>{t('desktop_notif')}</div>
              <p className={css({ color: 'slate.500', fontSize: '13px' })}>{t('desktop_notif_desc')}</p>
            </div>
            <input 
              type="checkbox" 
              className={css({ width: '40px', height: '20px', cursor: 'pointer' })} 
              checked={desktopNotif}
              onChange={(e) => setDesktopNotif(e.target.checked)}
            />
          </div>
        </div>

        {/* Security */}
        <div className={css({
          backgroundColor: 'white',
          borderRadius: '2xl',
          padding: '24px',
          border: '1px solid',
          borderColor: 'slate.100',
          boxShadow: 'sm'
        })}>
          <h3 className={css({ fontSize: '16px', fontWeight: 'bold', color: 'slate.900', marginBottom: '24px' })}>{t('security')}</h3>
          <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
            <div>
              <div className={css({ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px', color: 'slate.900' })}>{t('password')}</div>
              <p className={css({ color: 'slate.500', fontSize: '13px' })}>{t('last_changed')}</p>
            </div>
            <button 
              className={css({
                paddingY: '8px',
                paddingX: '16px',
                borderRadius: 'lg',
                border: '1px solid',
                borderColor: 'slate.200',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all',
                _hover: { backgroundColor: 'slate.50' }
              })}
              onClick={() => alert('Change Password Dialog Opened')}
            >
              {t('change_password')}
            </button>
          </div>
        </div>

        {/* Subscription */}
        <div className={css({
          backgroundColor: 'white',
          borderRadius: '2xl',
          padding: '24px',
          border: '1px solid',
          borderColor: 'slate.100',
          boxShadow: 'sm'
        })}>
          <h3 className={css({ fontSize: '16px', fontWeight: 'bold', color: 'slate.900', marginBottom: '24px' })}>{t('sub_section_title')}</h3>

          {cancelledMsg && (
            <div className={css({ 
              backgroundColor: 'green.50', 
              border: '1px solid', 
              borderColor: 'green.100', 
              borderRadius: 'lg', 
              padding: '12px 16px', 
              marginBottom: '24px', 
              fontSize: '13px', 
              color: 'green.700', 
              fontWeight: 'bold' 
            })}>
              ✓ {cancelledMsg}
            </div>
          )}

          {subscription.plan === 'none' ? (
            <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
              <p className={css({ fontSize: '14px', color: 'slate.500' })}>{t('sub_no_plan')}</p>
              <Link to="/plan" className={css({
                paddingY: '10px',
                paddingX: '20px',
                borderRadius: 'xl',
                backgroundColor: 'brand.primary',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                textDecoration: 'none',
                transition: 'all',
                _hover: { backgroundColor: 'brand.secondary' }
              })}>
                {t('sub_choose_plan')}
              </Link>
            </div>
          ) : (
            <div>
              <div className={css({ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' })}>
                <div className={css({ backgroundColor: 'violet.50', borderRadius: 'xl', padding: '16px' })}>
                  <div className={css({ fontSize: '10px', fontWeight: 'bold', color: 'brand.primary', textTransform: 'uppercase', marginBottom: '4px' })}>{t('sub_current_plan')}</div>
                  <div className={css({ fontSize: '16px', fontWeight: 'bold', color: 'brand.primary' })}>{subscription.plan === 'annual' ? t('plan_annual_title') : t('plan_monthly_title')}</div>
                </div>
                <div className={css({ backgroundColor: 'slate.50', borderRadius: 'xl', padding: '16px' })}>
                  <div className={css({ fontSize: '10px', fontWeight: 'bold', color: 'slate.400', textTransform: 'uppercase', marginBottom: '4px' })}>{t('sub_activated')}</div>
                  <div className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700' })}>{subscription.activatedAt ? new Date(subscription.activatedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</div>
                </div>
                <div className={css({ backgroundColor: 'slate.50', borderRadius: 'xl', padding: '16px' })}>
                  <div className={css({ fontSize: '10px', fontWeight: 'bold', color: 'slate.400', textTransform: 'uppercase', marginBottom: '4px' })}>{t('sub_renews')}</div>
                  <div className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700' })}>{subscription.renewsAt ? new Date(subscription.renewsAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</div>
                </div>
              </div>

              {!showCancelDialog ? (
                <button
                  className={css({
                    color: 'red.600',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    paddingY: '8px',
                    paddingX: '16px',
                    border: '1px solid',
                    borderColor: 'red.100',
                    borderRadius: 'lg',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    _hover: { backgroundColor: 'red.50' }
                  })}
                  onClick={() => setShowCancelDialog(true)}
                >
                  {t('sub_cancel_btn')}
                </button>
              ) : (
                <div className={css({ border: '1px solid', borderColor: 'red.100', borderRadius: 'xl', padding: '24px', backgroundColor: 'red.50' })}>
                  <h4 className={css({ fontSize: '15px', fontWeight: 'bold', color: 'red.700', marginBottom: '12px' })}>⚠ {t('sub_cancel_confirm')}</h4>
                  <p className={css({ fontSize: '13px', color: 'slate.600', lineHeight: 'relaxed', marginBottom: '24px' })}>{t('sub_cancel_disclaimer')}</p>
                  <div className={css({ display: 'flex', gap: '12px' })}>
                    <button
                      className={css({
                        paddingY: '8px',
                        paddingX: '16px',
                        borderRadius: 'lg',
                        border: '1px solid',
                        borderColor: 'slate.200',
                        backgroundColor: 'white',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      })}
                      onClick={() => setShowCancelDialog(false)}
                    >
                      {t('cancel')}
                    </button>
                    <button
                      className={css({
                        backgroundColor: 'red.600',
                        color: 'white',
                        paddingY: '8px',
                        paddingX: '16px',
                        borderRadius: 'lg',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        _hover: { backgroundColor: 'red.700' }
                      })}
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

