import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { encryptData, decryptData, maskValue } from '../utils/cryptoUtils';

const STORAGE_KEY = 'paslytics_payment_settings';

interface PaymentSettings {
  bankName: string;
  iban: string;
  swift: string;
  stripeKey: string;
}

const emptySettings: PaymentSettings = { bankName: '', iban: '', swift: '', stripeKey: '' };

const PaymentSettingsPage = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';
  const location = useLocation();

  const [form, setForm] = useState<PaymentSettings>(emptySettings);
  const [masked, setMasked] = useState<PaymentSettings>(emptySettings);
  const [hasStored, setHasStored] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);

  // Load and decrypt on mount
  useEffect(() => {
    const load = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const decrypted = await decryptData(stored);
          if (decrypted) {
            const parsed: PaymentSettings = JSON.parse(decrypted);
            setMasked({
              bankName: parsed.bankName,
              iban: maskValue(parsed.iban),
              swift: maskValue(parsed.swift),
              stripeKey: maskValue(parsed.stripeKey),
            });
            setForm(parsed);
            setHasStored(true);
          }
        }
      } catch { /* ignore */ }
      setIsLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const encrypted = await encryptData(JSON.stringify(form));
      localStorage.setItem(STORAGE_KEY, encrypted);
      setMasked({
        bankName: form.bankName,
        iban: maskValue(form.iban),
        swift: maskValue(form.swift),
        stripeKey: maskValue(form.stripeKey),
      });
      setHasStored(true);
      setIsEditing(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
    }
    setIsSaving(false);
  };

  const handleClear = () => {
    if (window.confirm(t('paysettings_confirm_clear'))) {
      localStorage.removeItem(STORAGE_KEY);
      setForm(emptySettings);
      setMasked(emptySettings);
      setHasStored(false);
      setIsEditing(false);
    }
  };

  const setField = (key: keyof PaymentSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };


  if (isLoading) {
    return (
      <div className="p-8" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#94a3b8' }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '780px' }}>

          {/* Header */}
          <div className="flex justify-between items-center mb-6" style={{ paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>{t('paysettings_title')}</h1>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>{t('paysettings_desc')}</p>
            </div>
            <div className="flex gap-3">
              {saveStatus === 'success' && <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: 500, alignSelf: 'center' }}>✓ {t('paysettings_saved')}</span>}
              {saveStatus === 'error' && <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: 500, alignSelf: 'center' }}>{t('paysettings_error')}</span>}
            </div>
          </div>

          {/* Encryption Notice */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px 20px', marginBottom: '28px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803d', marginBottom: '4px' }}>{t('paysettings_encrypted_title')}</div>
              <p style={{ fontSize: '12px', color: '#16a34a', lineHeight: 1.6 }}>{t('paysettings_encrypted_desc')}</p>
            </div>
          </div>

          {/* Recipient Settings Card */}
          <div className="card" style={{ padding: '28px', borderRadius: '16px', marginBottom: '28px' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6c2bd9, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{t('paysettings_recipient_title')}</h2>
              </div>
              {hasStored && !isEditing && (
                <button className="btn btn-outline" style={{ fontSize: '13px', padding: '6px 14px' }} onClick={() => setIsEditing(true)}>
                  {t('paysettings_edit')}
                </button>
              )}
            </div>

            {!hasStored || isEditing ? (
              /* ── Edit Form ── */
              <div style={{ display: 'grid', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>{t('paysettings_bank_name')}</label>
                    <input type="text" className="input" style={{ width: '100%' }} value={form.bankName} onChange={setField('bankName')} placeholder={t('paysettings_bank_name_ph')} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>{t('paysettings_swift')}</label>
                    <input type="text" className="input" style={{ width: '100%', fontFamily: 'monospace' }} value={form.swift} onChange={setField('swift')} placeholder="XXXXSAXX" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>{t('paysettings_iban')}</label>
                  <input type="text" className="input" style={{ width: '100%', fontFamily: 'monospace', direction: 'ltr' }} value={form.iban} onChange={setField('iban')} placeholder="SA00 0000 0000 0000 0000 0000" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>{t('paysettings_stripe_key')}</label>
                  <input type="password" className="input" style={{ width: '100%', fontFamily: 'monospace', direction: 'ltr' }} value={form.stripeKey} onChange={setField('stripeKey')} placeholder="pk_live_••••••••" />
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{t('paysettings_stripe_note')}</p>
                </div>

                <div className="flex gap-3" style={{ paddingTop: '8px' }}>
                  {isEditing && (
                    <button className="btn btn-outline" style={{ padding: '10px 20px' }} onClick={() => setIsEditing(false)}>
                      {t('cancel')}
                    </button>
                  )}
                  <button
                    className="btn btn-primary"
                    style={{ background: '#6c2bd9', padding: '10px 28px', opacity: isSaving ? 0.7 : 1 }}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? '...' : t('paysettings_save_btn')}
                  </button>
                  {hasStored && (
                    <button className="btn" style={{ color: '#dc2626', padding: '10px 16px', fontSize: '13px', marginInlineStart: 'auto' }} onClick={handleClear}>
                      {t('paysettings_clear')}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* ── Masked Display ── */
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  { label: t('paysettings_bank_name'), value: masked.bankName },
                  { label: t('paysettings_iban'), value: masked.iban },
                  { label: t('paysettings_swift'), value: masked.swift },
                  { label: t('paysettings_stripe_key'), value: masked.stripeKey },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 600 }}>{row.label}</span>
                    <span style={{ fontSize: '13px', color: '#111827', fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.05em' }}>{row.value || '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Subscriptions Panel */}
          <div className="card" style={{ padding: '28px', borderRadius: '16px', marginBottom: '48px' }}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{t('paysettings_subs_title')}</h2>
            </div>

            {/* Read subscription from localStorage */}
            {(() => {
              try {
                const raw = localStorage.getItem('paslytics_subscription');
                if (!raw) throw new Error();
                const sub = JSON.parse(raw);
                if (sub.plan === 'none' || !sub.activatedAt) throw new Error();
                return (
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, background: '#f3e8ff', borderRadius: '12px', padding: '20px', minWidth: '180px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#9333ea', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>{t('paysettings_active_plan')}</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#6c2bd9' }}>{sub.plan === 'annual' ? t('plan_annual_title') : t('plan_monthly_title')}</div>
                    </div>
                    <div style={{ flex: 1, background: '#f8fafc', borderRadius: '12px', padding: '20px', minWidth: '180px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>{t('paysettings_activated')}</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>{new Date(sub.activatedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div style={{ flex: 1, background: '#f8fafc', borderRadius: '12px', padding: '20px', minWidth: '180px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>{t('paysettings_renews')}</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>{new Date(sub.renewsAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                  </div>
                );
              } catch {
                return (
                  <p style={{ fontSize: '14px', color: '#94a3b8', textAlign: 'center', padding: '24px' }}>{t('paysettings_no_subs')}</p>
                );
              }
            })()}
          </div>

        </div>
    </div>
  );
};

export default PaymentSettingsPage;
