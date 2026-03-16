import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';

const LandingPage = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { homepage } = useContent();
  const isRtl = language === 'ar';
  const get = (en: string, ar: string) => isRtl ? ar : en;

  return (
    <div style={{ backgroundColor: '#fcfcfd', minHeight: '100vh', direction: isRtl ? 'rtl' : 'ltr' }}>
      <div className="container" style={{ margin: '0 auto', maxWidth: '1200px' }}>
        
        {/* Top Nav */}
        <header className="landing-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', marginBottom: '40px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', color: '#6c2bd9' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 14l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>{t('app_name')}</span>
          </Link>
          
          <div className="landing-nav-links" style={{ display: 'flex', gap: '32px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>{t('home')}</Link>
            <Link to="/plan" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>{t('plan')}</Link>
            <Link to="/about" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>{t('about')}</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={toggleLanguage} className="btn" style={{ background: 'transparent', padding: '8px 12px', fontSize: '14px', fontWeight: 600 }}>
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
            <Link to="/login" className="btn" style={{ background: '#f1f5f9', color: 'var(--text-dark)' }}>{t('login')}</Link>
            <Link to="/login" className="btn btn-primary" style={{ background: '#6c2bd9' }}>{t('get_started')}</Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center', padding: '60px 0' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#f3e8ff', color: '#6c2bd9', borderRadius: '20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '24px', textTransform: 'uppercase' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> 
              {t('next_gen')}
            </div>
            
            <h1 style={{ fontSize: '52px', lineHeight: 1.1, marginBottom: '20px' }}>
              {get(homepage.heroTitle1_en, homepage.heroTitle1_ar)}<br />
              <span style={{ color: '#6c2bd9' }}>{get(homepage.heroTitle2_en, homepage.heroTitle2_ar)}</span>
            </h1>
            
            <p style={{ fontSize: '16px', color: '#475569', marginBottom: '40px', maxWidth: '480px', lineHeight: 1.6 }}>
              {get(homepage.heroDesc_en, homepage.heroDesc_ar)}
            </p>
            
            <div className="flex items-center gap-4 mb-10">
              <Link to="/login" className="btn btn-primary" style={{ background: '#6c2bd9', padding: '12px 24px', fontSize: '14px', borderRadius: '8px', display: 'inline-block', lineHeight: 'normal' }}>{t('start_analyzing')}</Link>
              <button className="btn btn-outline" onClick={() => alert('Opening Video player...')} style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '8px' }}>{t('watch_demo')}</button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="avatar-group" style={{ display: 'flex' }}>
                <div className="avatar-circle" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', border: '2px solid white', marginInlineEnd: '-8px' }}></div>
                <div className="avatar-circle" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#cbd5e1', border: '2px solid white', marginInlineEnd: '-8px' }}></div>
                <div className="avatar-circle" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#94a3b8', border: '2px solid white', marginInlineEnd: '-8px' }}></div>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginInlineStart: '12px' }}>{t('trusted_by')}</span>
            </div>
          </div>
          
          <div>
            <div className="hero-image-placeholder" style={{ background: '#f8fafc', borderRadius: '24px', height: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="#cbd5e1">
                <rect x="4" y="14" width="4" height="6" rx="1"/>
                <rect x="10" y="8" width="4" height="12" rx="1"/>
                <rect x="16" y="11" width="4" height="9" rx="1"/>
              </svg>
            </div>
          </div>
        </section>



        {/* CTA Section */}
        <section className="cta-section" style={{ padding: '80px 0', textAlign: 'center', background: '#f8fafc', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '20px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.2, color: 'var(--text-dark)' }}>
            {get(homepage.ctaHeading_en, homepage.ctaHeading_ar)}
          </h2>
          <p style={{ fontSize: '15px', color: '#475569', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            {get(homepage.ctaDesc_en, homepage.ctaDesc_ar)}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/login" className="btn btn-primary" style={{ background: '#6c2bd9', padding: '12px 32px', fontSize: '14px', borderRadius: '8px' }}>{t('start_free_trial')}</Link>
            <button className="btn btn-outline" onClick={() => alert('Opening Contact Form...')} style={{ background: '#ffffff', padding: '12px 32px', fontSize: '14px', borderRadius: '8px', border: 'none' }}>{t('contact_sales')}</button>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer flex items-center justify-between" style={{ padding: '40px 0', marginTop: '40px', borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <div style={{ width: '20px', height: '20px', color: '#6c2bd9' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 14l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>{t('app_name')}</span>
          </div>
          
          <div className="flex gap-8">
            <a href="#" style={{ color: '#94a3b8', fontSize: '12px', textDecoration: 'none' }}>{t('privacy_policy')}</a>
            <a href="#" style={{ color: '#94a3b8', fontSize: '12px', textDecoration: 'none' }}>{t('terms_of_service')}</a>
            <a href="#" style={{ color: '#94a3b8', fontSize: '12px', textDecoration: 'none' }}>{t('contact')}</a>
          </div>
          
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            © {new Date().getFullYear()} PASlytics AI. {t('all_rights_reserved')}
          </div>
        </footer>
        
      </div>
    </div>
  );
};

export default LandingPage;
