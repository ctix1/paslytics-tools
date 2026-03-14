import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';

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
    t('pricing_feature_image'),
    t('pricing_feature_pas'),
    t('pricing_feature_logs'),
    ...(isAnnual ? [t('pricing_feature_team'), t('pricing_feature_support')] : []),
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
    // Simulate payment processing (fields are cleared immediately)
    setCardNumber('');
    setCvv('');
    setTimeout(() => {
      subscribe(isAnnual ? 'annual' : 'monthly');
      setStep('success');
    }, 2000);
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
          {t('pricing')}
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
      <div className="app-layout" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <Sidebar />
        <main className="main-content" style={{ marginInlineStart: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '48px 40px', borderRadius: '16px' }}>
            <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #6c2bd9, #a855f7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', color: '#111827' }}>{t('checkout_success_title')}</h1>
            <p style={{ color: '#6b7280', marginBottom: '8px', lineHeight: 1.6 }}>{t('checkout_success_desc')}</p>
            <div style={{ background: '#f3e8ff', border: '1px solid #e9d5ff', borderRadius: '10px', padding: '16px', marginBottom: '32px', marginTop: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#6c2bd9', marginBottom: '4px' }}>
                {isAnnual ? t('plan_annual_title') : t('plan_monthly_title')}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#111827' }}>{price}<span style={{ fontSize: '14px', fontWeight: 400, color: '#9ca3af' }}>{period}</span></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn btn-primary" style={{ background: '#6c2bd9', padding: '12px' }} onClick={() => navigate('/dashboard')}>
                {t('checkout_go_dashboard')}
              </button>
              <Link to="/settings" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>{t('checkout_view_subscription')}</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ══════════════ MAIN RENDER ══════════════ */
  return (
    <div className="app-layout" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <Sidebar />
      <main className="main-content" style={{ marginInlineStart: '260px', marginInlineEnd: 0 }}>
        <div style={{ maxWidth: '860px' }}>

          {/* Header */}
          <div style={{ paddingBottom: '24px', marginBottom: '32px', borderBottom: '1px solid var(--border)' }}>
            <Link to="/pricing" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" /></svg>
              {t('checkout_back')}
            </Link>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827' }}>{t('checkout_title')}</h1>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>

            {/* ── Left: Payment Form ── */}
            <div>
              {step === 'summary' && (
                <div className="card" style={{ padding: '32px', borderRadius: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#111827' }}>{t('checkout_order_summary')}</h2>

                  <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, color: '#111827' }}>{isAnnual ? t('plan_annual_title') : t('plan_monthly_title')}</span>
                      <span style={{ fontWeight: 700, color: '#6c2bd9', fontSize: '20px' }}>{price}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{period}</span>
                    {isAnnual && <div style={{ fontSize: '12px', color: '#6c2bd9', marginTop: '4px', fontWeight: 500 }}>{t('annual_savings')}</div>}
                    <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '16px', paddingTop: '16px' }}>
                      {features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6c2bd9" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" /></svg>
                          <span style={{ fontSize: '13px', color: '#374151' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ background: '#6c2bd9', width: '100%', padding: '13px', fontWeight: 700 }}
                    onClick={() => setStep('payment')}
                  >
                    {t('checkout_proceed')}
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <div className="card" style={{ padding: '32px', borderRadius: '16px' }}>
                  {/* Secure badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '6px 12px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a' }}>{t('checkout_secure')}</span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
                    {(['card', 'bank'] as const).map(tb => (
                      <button
                        key={tb}
                        onClick={() => setTab(tb)}
                        className="btn"
                        style={{
                          padding: '8px 20px', fontSize: '13px', fontWeight: 600, borderRadius: '8px',
                          background: tab === tb ? '#6c2bd9' : '#f1f5f9',
                          color: tab === tb ? 'white' : '#475569',
                          border: 'none', transition: 'all 0.2s'
                        }}
                      >
                        {tb === 'card' ? t('checkout_tab_card') : t('checkout_tab_bank')}
                      </button>
                    ))}
                  </div>

                  {tab === 'card' && (
                    <div style={{ display: 'grid', gap: '18px' }}>
                      {/* Cardholder Name */}
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>{t('checkout_cardholder')}</label>
                        <input
                          type="text"
                          className="input"
                          style={{ width: '100%', direction: 'ltr' }}
                          placeholder="John Doe"
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          autoComplete="cc-name"
                        />
                        {errors.cardName && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.cardName}</p>}
                      </div>

                      {/* Card Number */}
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>{t('checkout_card_number')}</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            className="input"
                            style={{ width: '100%', direction: 'ltr', letterSpacing: '0.1em', paddingInlineEnd: '48px' }}
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                            autoComplete="cc-number"
                            inputMode="numeric"
                          />
                          <div style={{ position: 'absolute', insetInlineEnd: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '4px' }}>
                            <span style={{ fontSize: '18px' }}>💳</span>
                          </div>
                        </div>
                        {errors.cardNumber && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.cardNumber}</p>}
                      </div>

                      {/* Expiry + CVV */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>{t('checkout_expiry')}</label>
                          <input
                            type="text"
                            className="input"
                            style={{ width: '100%', direction: 'ltr' }}
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={e => setExpiry(formatExpiry(e.target.value))}
                            autoComplete="cc-exp"
                            inputMode="numeric"
                          />
                          {errors.expiry && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.expiry}</p>}
                        </div>
                        <div>
                          <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>{t('checkout_cvv')}</label>
                          <input
                            type="password"
                            className="input"
                            style={{ width: '100%', direction: 'ltr' }}
                            placeholder="•••"
                            maxLength={4}
                            value={cvv}
                            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            autoComplete="cc-csc"
                            inputMode="numeric"
                          />
                          {errors.cvv && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.cvv}</p>}
                        </div>
                      </div>

                      <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6 }}>
                        🔒 {t('checkout_privacy_note')}
                      </p>
                    </div>
                  )}

                  {tab === 'bank' && (
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '24px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>{t('checkout_bank_title')}</h3>
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {[
                          { label: t('checkout_bank_name'), value: 'PASlytics Ltd.' },
                          { label: t('checkout_bank_iban'), value: 'SA00 0000 0000 0000 0000 0000' },
                          { label: t('checkout_bank_swift'), value: 'PASLSAXX' },
                          { label: t('checkout_bank_ref'), value: isAnnual ? 'PLAN-ANNUAL' : 'PLAN-MONTHLY' },
                          { label: t('checkout_bank_amount'), value: `${price} ${period}` },
                        ].map((row, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ color: '#6b7280', fontWeight: 600 }}>{row.label}</span>
                            <span style={{ color: '#111827', fontFamily: 'monospace', fontWeight: 600 }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px', lineHeight: 1.6 }}>{t('checkout_bank_note')}</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                    <button className="btn btn-outline" style={{ flex: 1, padding: '12px' }} onClick={() => setStep('summary')}>
                      {t('checkout_back')}
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 2, background: '#6c2bd9', padding: '12px', fontWeight: 700 }}
                      onClick={handlePay}
                    >
                      {tab === 'card' ? t('checkout_pay_now') : t('checkout_confirm_transfer')}
                    </button>
                  </div>
                </div>
              )}

              {step === 'processing' && (
                <div className="card" style={{ padding: '80px 32px', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', border: '4px solid #e9d5ff', borderTop: '4px solid #6c2bd9', borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 1s linear infinite' }}></div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>{t('checkout_processing')}</h2>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>{t('checkout_processing_desc')}</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}
            </div>

            {/* ── Right: Plan Summary ── */}
            <div className="card" style={{ padding: '28px', borderRadius: '16px', position: 'sticky', top: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6c2bd9, #a855f7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>{isAnnual ? t('plan_annual_title') : t('plan_monthly_title')}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{isAnnual ? t('plan_annual_desc') : t('plan_monthly_desc')}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ color: '#6b7280' }}>{t('checkout_subtotal')}</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#6b7280' }}>{t('checkout_tax')}</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>$0.00</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#111827' }}>{t('checkout_total')}</span>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#6c2bd9' }}>{price}</span>
              </div>

              {isAnnual && (
                <div style={{ marginTop: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                  💚 {t('annual_savings')}
                </div>
              )}

              <div style={{ marginTop: '20px', fontSize: '11px', color: '#94a3b8', lineHeight: 1.7 }}>
                {t('checkout_cancel_note')}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
