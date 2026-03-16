import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { encryptData, decryptData, maskValue } from '../utils/cryptoUtils';
import { css } from '../../styled-system/css';

const STORAGE_KEY = 'paslytics_payment_settings';

interface PaymentSettings {
  bankName: string;
  iban: string;
  swift: string;
  stripeKey: string;
}

const emptySettings: PaymentSettings = { bankName: '', iban: '', swift: '', stripeKey: '' };

const PaymentSettingsPage = () => {
  const { t, language } = useLanguage();

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
      <div className={css({ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' })}>
        <p className={css({ color: 'slate.400' })}>Loading…</p>
      </div>
    );
  }

  return (
    <div className={css({ maxWidth: '780px', margin: '0 auto' })}>

      {/* Header */}
      <div className={css({ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px', 
        paddingBottom: '24px', 
        borderBottom: '1px solid',
        borderColor: 'slate.100'
      })}>
        <div>
          <h1 className={css({ fontSize: '22px', fontWeight: 'bold', color: 'slate.900', marginBottom: '4px' })}>{t('paysettings_title')}</h1>
          <p className={css({ fontSize: '13px', color: 'slate.500' })}>{t('paysettings_desc')}</p>
        </div>
        <div className={css({ display: 'flex', gap: '12px' })}>
          {saveStatus === 'success' && <span className={css({ color: 'green.600', fontSize: '13px', fontWeight: 500, alignSelf: 'center' })}>✓ {t('paysettings_saved')}</span>}
          {saveStatus === 'error' && <span className={css({ color: 'red.600', fontSize: '13px', fontWeight: 500, alignSelf: 'center' })}>{t('paysettings_error')}</span>}
        </div>
      </div>

      {/* Encryption Notice */}
      <div className={css({ 
        backgroundColor: 'green.50', 
        border: '1px solid', 
        borderColor: 'green.100', 
        borderRadius: 'xl', 
        padding: '16px 20px', 
        marginBottom: '28px', 
        display: 'flex', 
        gap: '12px', 
        alignItems: 'flex-start' 
      })}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className={css({ flexShrink: 0, marginTop: '2px' })}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        <div>
          <div className={css({ fontSize: '13px', fontWeight: 'bold', color: 'green.800', marginBottom: '4px' })}>{t('paysettings_encrypted_title')}</div>
          <p className={css({ fontSize: '12px', color: 'green.600', lineHeight: 'relaxed' })}>{t('paysettings_encrypted_desc')}</p>
        </div>
      </div>

      {/* Recipient Settings Card */}
      <div className={css({
        backgroundColor: 'white',
        borderRadius: '2xl',
        padding: '28px',
        border: '1px solid',
        borderColor: 'slate.100',
        boxShadow: 'sm',
        marginBottom: '28px'
      })}>
        <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' })}>
          <div className={css({ display: 'flex', alignItems: 'center', gap: '12px' })}>
            <div className={css({ 
              width: '36px', 
              height: '36px', 
              background: 'linear-gradient(135deg, #6c2bd9, #a855f7)', 
              borderRadius: 'lg', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white' 
            })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <h2 className={css({ fontSize: '16px', fontWeight: 'bold', color: 'slate.900' })}>{t('paysettings_recipient_title')}</h2>
          </div>
          {hasStored && !isEditing && (
            <button 
              className={css({
                paddingY: '6px',
                paddingX: '14px',
                borderRadius: 'lg',
                border: '1px solid',
                borderColor: 'slate.200',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                _hover: { backgroundColor: 'slate.50' }
              })}
              onClick={() => setIsEditing(true)}
            >
              {t('paysettings_edit')}
            </button>
          )}
        </div>

        {!hasStored || isEditing ? (
          /* ── Edit Form ── */
          <div className={css({ display: 'grid', gap: '18px' })}>
            <div className={css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' })}>
              <div className={css({ display: 'grid', gap: '6px' })}>
                <label className={css({ fontSize: '13px', fontWeight: 'bold', color: 'slate.700' })}>{t('paysettings_bank_name')}</label>
                <input 
                  type="text" 
                  className={css({
                    padding: '10px',
                    borderRadius: 'lg',
                    border: '1px solid',
                    borderColor: 'slate.200',
                    fontSize: '14px',
                    _focus: { borderColor: 'brand.primary', outline: 'none' }
                  })} 
                  value={form.bankName} 
                  onChange={setField('bankName')} 
                  placeholder={t('paysettings_bank_name_ph')} 
                />
              </div>
              <div className={css({ display: 'grid', gap: '6px' })}>
                <label className={css({ fontSize: '13px', fontWeight: 'bold', color: 'slate.700' })}>{t('paysettings_swift')}</label>
                <input 
                  type="text" 
                  className={css({
                    padding: '10px',
                    borderRadius: 'lg',
                    border: '1px solid',
                    borderColor: 'slate.200',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    _focus: { borderColor: 'brand.primary', outline: 'none' }
                  })} 
                  value={form.swift} 
                  onChange={setField('swift')} 
                  placeholder="XXXXSAXX" 
                />
              </div>
            </div>
            <div className={css({ display: 'grid', gap: '6px' })}>
              <label className={css({ fontSize: '13px', fontWeight: 'bold', color: 'slate.700' })}>{t('paysettings_iban')}</label>
              <input 
                type="text" 
                className={css({
                  padding: '10px',
                  borderRadius: 'lg',
                  border: '1px solid',
                  borderColor: 'slate.200',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  direction: 'ltr',
                  _focus: { borderColor: 'brand.primary', outline: 'none' }
                })} 
                value={form.iban} 
                onChange={setField('iban')} 
                placeholder="SA00 0000 0000 0000 0000 0000" 
              />
            </div>
            <div className={css({ display: 'grid', gap: '6px' })}>
              <label className={css({ fontSize: '13px', fontWeight: 'bold', color: 'slate.700' })}>{t('paysettings_stripe_key')}</label>
              <input 
                type="password" 
                className={css({
                  padding: '10px',
                  borderRadius: 'lg',
                  border: '1px solid',
                  borderColor: 'slate.200',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  direction: 'ltr',
                  _focus: { borderColor: 'brand.primary', outline: 'none' }
                })} 
                value={form.stripeKey} 
                onChange={setField('stripeKey')} 
                placeholder="pk_live_••••••••" 
              />
              <p className={css({ fontSize: '11px', color: 'slate.400', marginTop: '4px' })}>{t('paysettings_stripe_note')}</p>
            </div>

            <div className={css({ display: 'flex', gap: '12px', paddingTop: '8px' })}>
              {isEditing && (
                <button 
                  className={css({
                    paddingY: '10px',
                    paddingX: '20px',
                    borderRadius: 'xl',
                    border: '1px solid',
                    borderColor: 'slate.200',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: 'pointer',
                    _hover: { backgroundColor: 'slate.50' }
                  })}
                  onClick={() => setIsEditing(false)}
                >
                  {t('cancel')}
                </button>
              )}
              <button
                className={css({
                  paddingY: '10px',
                  paddingX: '28px',
                  borderRadius: 'xl',
                  backgroundColor: 'brand.primary',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  opacity: isSaving ? 0.7 : 1,
                  _hover: { backgroundColor: 'brand.secondary' }
                })}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? '...' : t('paysettings_save_btn')}
              </button>
              {hasStored && (
                <button 
                  className={css({ 
                    color: 'red.600', 
                    padding: '10px', 
                    fontSize: '13px', 
                    fontWeight: 'bold',
                    marginInlineStart: 'auto',
                    cursor: 'pointer',
                    _hover: { textDecoration: 'underline' }
                  })} 
                  onClick={handleClear}
                >
                  {t('paysettings_clear')}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── Masked Display ── */
          <div className={css({ display: 'grid', gap: '12px' })}>
            {[
              { label: t('paysettings_bank_name'), value: masked.bankName },
              { label: t('paysettings_iban'), value: masked.iban },
              { label: t('paysettings_swift'), value: masked.swift },
              { label: t('paysettings_stripe_key'), value: masked.stripeKey },
            ].map((row, i) => (
              <div key={i} className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: 'slate.50', borderRadius: 'lg' })}>
                <span className={css({ fontSize: '13px', color: 'slate.500', fontWeight: 'bold' })}>{row.label}</span>
                <span className={css({ fontSize: '13px', color: 'slate.900', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 'wider' })}>{row.value || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Subscriptions Panel */}
      <div className={css({
        backgroundColor: 'white',
        borderRadius: '2xl',
        padding: '28px',
        border: '1px solid',
        borderColor: 'slate.100',
        boxShadow: 'sm',
        marginBottom: '48px'
      })}>
        <div className={css({ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' })}>
          <div className={css({ 
            width: '36px', 
            height: '36px', 
            background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', 
            borderRadius: 'lg', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white' 
          })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
          </div>
          <h2 className={css({ fontSize: '16px', fontWeight: 'bold', color: 'slate.900' })}>{t('paysettings_subs_title')}</h2>
        </div>

        {(() => {
          try {
            const raw = localStorage.getItem('paslytics_subscription');
            if (!raw) throw new Error();
            const sub = JSON.parse(raw);
            if (sub.plan === 'none' || !sub.activatedAt) throw new Error();
            return (
              <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' })}>
                <div className={css({ backgroundColor: 'violet.50', borderRadius: 'xl', padding: '20px' })}>
                  <div className={css({ fontSize: '11px', fontWeight: 'bold', color: 'brand.primary', letterSpacing: 'wider', textTransform: 'uppercase', marginBottom: '8px' })}>{t('paysettings_active_plan')}</div>
                  <div className={css({ fontSize: '18px', fontWeight: 'bold', color: 'brand.primary' })}>{sub.plan === 'annual' ? t('plan_annual_title') : t('plan_monthly_title')}</div>
                </div>
                <div className={css({ backgroundColor: 'slate.50', borderRadius: 'xl', padding: '20px' })}>
                  <div className={css({ fontSize: '11px', fontWeight: 'bold', color: 'slate.400', letterSpacing: 'wider', textTransform: 'uppercase', marginBottom: '8px' })}>{t('paysettings_activated')}</div>
                  <div className={css({ fontSize: '15px', fontWeight: 'bold', color: 'slate.900' })}>{new Date(sub.activatedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div className={css({ backgroundColor: 'slate.50', borderRadius: 'xl', padding: '20px' })}>
                  <div className={css({ fontSize: '11px', fontWeight: 'bold', color: 'slate.400', letterSpacing: 'wider', textTransform: 'uppercase', marginBottom: '8px' })}>{t('paysettings_renews')}</div>
                  <div className={css({ fontSize: '15px', fontWeight: 'bold', color: 'slate.900' })}>{new Date(sub.renewsAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>
            );
          } catch {
            return (
              <p className={css({ fontSize: '14px', color: 'slate.400', textAlign: 'center', padding: '24px' })}>{t('paysettings_no_subs')}</p>
            );
          }
        })()}
      </div>

    </div>
  );
};

export default PaymentSettingsPage;
