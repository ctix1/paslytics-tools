import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';

const Pricing = () => {
  const { t, language, toggleLanguage } = useLanguage();
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
    { label: t('pricing_feature_image'), included: true },
    { label: t('pricing_feature_pas'), included: true },
    { label: t('pricing_feature_logs'), included: true },
    { label: t('pricing_feature_team'), included: false },
    { label: t('pricing_feature_support'), included: false },
  ];

  const annualFeatures = [
    { label: t('pricing_feature_image'), included: true },
    { label: t('pricing_feature_pas'), included: true },
    { label: t('pricing_feature_logs'), included: true },
    { label: t('pricing_feature_team'), included: true, highlight: true },
    { label: t('pricing_feature_support'), included: true, highlight: true },
  ];

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ margin: '0 auto', maxWidth: '1100px', padding: '0 24px' }}>

        {/* ── Nav ── */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', color: '#6c2bd9' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 14l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <Link to="/" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', textDecoration: 'none' }}>
              {t('app_name')}
            </Link>
          </div>

          <nav style={{ display: 'flex', gap: '32px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>{t('features')}</Link>
            <Link to="/pricing" style={{ textDecoration: 'none', color: '#6c2bd9', fontSize: '14px', fontWeight: 600 }}>{t('pricing')}</Link>
            <Link to="/" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>{t('about')}</Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={toggleLanguage}
              className="btn"
              style={{ background: 'transparent', padding: '8px 12px', fontSize: '14px', fontWeight: 600, color: '#475569' }}
            >
              {isRtl ? 'English' : 'العربية'}
            </button>
            <Link to="/login" className="btn" style={{ background: '#f1f5f9', color: 'var(--text-dark)', fontSize: '14px' }}>{t('login')}</Link>
            <Link to="/login" className="btn btn-primary" style={{ background: '#6c2bd9', fontSize: '14px' }}>{t('get_started')}</Link>
          </div>
        </header>

        {/* ── Hero ── */}
        <section style={{ textAlign: 'center', padding: '60px 0 48px' }}>
          <div style={{
            display: 'inline-block', padding: '4px 16px', background: '#f3e8ff',
            color: '#6c2bd9', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.08em', marginBottom: '24px', textTransform: 'uppercase'
          }}>
            {t('pricing_plans_badge')}
          </div>

          <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', color: '#111827' }}>
            {t('pricing_title_1')}{' '}
            <span style={{ color: '#6c2bd9' }}>{t('pricing_title_2')}</span>{' '}
            {t('pricing_title_3')}
          </h1>

          <p style={{ fontSize: '16px', color: '#475569', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            {t('pricing_subtitle')}
          </p>
        </section>

        {/* ── Plans ── */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '24px', marginBottom: '80px', alignItems: 'start' }}>

          {/* Monthly card */}
          <div className="card" style={{
            padding: '32px', borderRadius: '16px', background: '#ffffff',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px', color: '#111827' }}>
              {t('plan_monthly_title')}
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '28px' }}>
              {t('plan_monthly_desc')}
            </p>

            <div style={{ marginBottom: '28px' }}>
              <span style={{ fontSize: '52px', fontWeight: 900, color: '#111827', letterSpacing: '-2px' }}>$19</span>
              <span style={{ fontSize: '15px', color: '#9ca3af', marginInlineStart: '4px' }}>{t('per_month')}</span>
            </div>

            {subscription.plan === 'monthly' ? (
              <div style={{ width: '100%', padding: '12px', background: '#f3e8ff', color: '#6c2bd9', fontWeight: 700, borderRadius: '8px', marginBottom: '28px', fontSize: '14px', textAlign: 'center', border: '1px solid #e9d5ff' }}>
                ✓ {t('paysettings_active_plan')}
              </div>
            ) : (
              <button
                className="btn"
                style={{ width: '100%', padding: '12px', background: '#f3f4f6', color: '#111827', fontWeight: 600, borderRadius: '8px', marginBottom: '28px', fontSize: '14px', opacity: subscription.plan === 'annual' ? 0.5 : 1 }}
                onClick={() => subscription.plan === 'none' && navigate('/checkout/monthly')}
                disabled={subscription.plan === 'annual'}
              >
                {t('choose_plan')}
              </button>
            )}

            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '16px' }}>
              {t('whats_included')}
            </div>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {monthlyFeatures.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: f.included ? 1 : 0.45 }}>
                  {f.included ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c2bd9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  )}
                  <span style={{ fontSize: '14px', color: f.included ? '#374151' : '#9ca3af' }}>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Annual card — "Best Value" */}
          <div className="card" style={{
            padding: '32px', borderRadius: '16px', background: '#ffffff',
            border: '2px solid #6c2bd9', position: 'relative', boxShadow: '0 8px 30px rgba(108,43,217,0.12)'
          }}>
            {/* Badge */}
            <div style={{
              position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
              background: '#6c2bd9', color: 'white', fontSize: '11px', fontWeight: 700,
              padding: '4px 16px', borderRadius: '20px', letterSpacing: '0.08em', textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>
              {t('best_value')}
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px', color: '#111827' }}>
              {t('plan_annual_title')}
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '28px' }}>
              {t('plan_annual_desc')}
            </p>

            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '52px', fontWeight: 900, color: '#111827', letterSpacing: '-2px' }}>$204</span>
              <span style={{ fontSize: '15px', color: '#9ca3af', marginInlineStart: '4px' }}>{t('per_year')}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#6c2bd9', fontWeight: 500, marginBottom: '24px' }}>
              {t('annual_savings')}
            </p>

            {subscription.plan === 'annual' ? (
              <div style={{ width: '100%', padding: '14px', background: '#6c2bd9', color: 'white', fontWeight: 700, borderRadius: '8px', marginBottom: '28px', fontSize: '14px', textAlign: 'center', opacity: 0.85 }}>
                ✓ {t('paysettings_active_plan')}
              </div>
            ) : (
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', background: '#6c2bd9', fontWeight: 700, borderRadius: '8px', marginBottom: '28px', fontSize: '14px', opacity: subscription.plan === 'monthly' ? 0.6 : 1 }}
                onClick={() => subscription.plan !== 'annual' && navigate('/checkout/annual')}
                disabled={subscription.plan === 'monthly'}
              >
                {t('choose_plan')}
              </button>
            )}

            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '16px' }}>
              {t('everything_monthly_plus')}
            </div>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {annualFeatures.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c2bd9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
                  </svg>
                  <span style={{
                    fontSize: '14px',
                    color: f.highlight ? '#6c2bd9' : '#374151',
                    fontWeight: f.highlight ? 600 : 400
                  }}>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ maxWidth: '680px', margin: '0 auto 80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '40px', color: '#111827' }}>
            {t('faq_title')}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px',
                  overflow: 'hidden', cursor: 'pointer'
                }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '18px 24px', userSelect: 'none'
                }}>
                  <span style={{ fontSize: '15px', fontWeight: 500, color: '#111827' }}>{faq.q}</span>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"
                    style={{ flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                  </svg>
                </div>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 18px', fontSize: '14px', color: '#6b7280', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 0', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', color: '#6c2bd9' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 14l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>{t('app_name')}</span>
          </div>

          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="#" style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none' }}>{t('privacy_policy')}</a>
            <a href="#" style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none' }}>{t('terms_of_service')}</a>
            <a href="#" style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none' }}>{t('contact')}</a>
          </div>

          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            © {new Date().getFullYear()} PASlytics AI. {t('all_rights_reserved')}
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Pricing;
