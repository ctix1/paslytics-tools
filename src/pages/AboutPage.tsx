import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';

const AboutPage = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { about } = useContent();
  const isRtl = language === 'ar';

  const get = (en: string, ar: string) => isRtl ? ar : en;

  const features = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2" />
          <path d="M12 8v4l3 3" />
        </svg>
      ),
      title: isRtl ? 'الاستخدام الذكي للذكاء الاصطناعي' : 'AI Smart Usage',
      desc: isRtl ? 'تستخدم تقنيات متقدمة لتحليل الصور والنصوص' : 'Uses advanced technology for image and text analysis',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
        </svg>
      ),
      title: isRtl ? 'الموثوق PAS إطار عمل' : 'Trusted PAS Framework',
      desc: isRtl ? 'تستخدم إطار عمل المشكلة - الإثارة - الحل لإنشاء محتوى فعّال' : 'Uses the Problem-Agitation-Solution framework for effective content',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      title: isRtl ? 'تسجيل شامل للتحليلات' : 'Comprehensive Logs',
      desc: isRtl ? 'تقوم بتسجيل جميع التحليلات لمساعدتك في متابعة التقدم' : 'Records all analyses to help you follow progress',
    },
  ];

  const team = [
    { nameEn: about.tm1Name_en, nameAr: about.tm1Name_ar, roleEn: about.tm1Role_en, roleAr: about.tm1Role_ar, bioEn: about.tm1Bio_en, bioAr: about.tm1Bio_ar },
    { nameEn: about.tm2Name_en, nameAr: about.tm2Name_ar, roleEn: about.tm2Role_en, roleAr: about.tm2Role_ar, bioEn: about.tm2Bio_en, bioAr: about.tm2Bio_ar },
    { nameEn: about.tm3Name_en, nameAr: about.tm3Name_ar, roleEn: about.tm3Role_en, roleAr: about.tm3Role_ar, bioEn: about.tm3Bio_en, bioAr: about.tm3Bio_ar },
  ];

  return (
    <div style={{ backgroundColor: '#fcfcfd', minHeight: '100vh', direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ margin: '0 auto', maxWidth: '1200px', padding: '0 24px' }}>

        {/* Nav */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', marginBottom: '40px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '24px', height: '24px', color: '#6c2bd9' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 14l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{t('app_name')}</span>
          </Link>

          <div style={{ display: 'flex', gap: '32px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>{t('home')}</Link>
            <Link to="/plan" style={{ textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: 500 }}>{t('plan')}</Link>
            <Link to="/about" style={{ textDecoration: 'none', color: '#6c2bd9', fontSize: '14px', fontWeight: 600, borderBottom: '2px solid #6c2bd9', paddingBottom: '2px' }}>{t('about')}</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={toggleLanguage} className="btn" style={{ background: 'transparent', padding: '8px 12px', fontSize: '14px', fontWeight: 600 }}>
              {isRtl ? 'English' : 'العربية'}
            </button>
            <Link to="/login" className="btn" style={{ background: '#f1f5f9', color: '#1e293b' }}>{t('login')}</Link>
            <Link to="/login" className="btn btn-primary" style={{ background: '#6c2bd9' }}>{t('get_started')}</Link>
          </div>
        </header>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '40px 0 60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 18px', background: '#f3e8ff', color: '#6c2bd9', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
            {get(about.badge_en, about.badge_ar)}
          </div>
          <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#1e293b', marginBottom: '20px', lineHeight: 1.2 }}>
            {get(about.heading_en, about.heading_ar)}
          </h1>
          <p style={{ fontSize: '16px', color: '#475569', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            {get(about.subheading_en, about.subheading_ar)}
          </p>
        </section>

        {/* Vision & Features */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', padding: '40px 0 80px', alignItems: 'start' }}>
          {/* Left: Vision + Mission */}
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
              {get(about.visionTitle_en, about.visionTitle_ar)}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.8, marginBottom: '32px' }}>
              {get(about.visionText_en, about.visionText_ar)}
            </p>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
              {get(about.missionTitle_en, about.missionTitle_ar)}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.8 }}>
              {get(about.missionText_en, about.missionText_ar)}
            </p>
          </div>

          {/* Right: Feature Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '40px', height: '40px', background: '#f3e8ff', color: '#6c2bd9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#6c2bd9', marginBottom: '4px' }}>{f.title}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section style={{ padding: '60px 0', background: '#f8fafc', borderRadius: '24px', marginBottom: '60px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
            {get(about.teamTitle_en, about.teamTitle_ar)}
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '48px' }}>
            {get(about.teamSubtitle_en, about.teamSubtitle_ar)}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', padding: '0 40px' }}>
            {team.map((member, i) => (
              <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '72px', height: '72px', background: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#6c2bd9' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  {get(member.nameEn, member.nameAr)}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6c2bd9', marginBottom: '10px' }}>
                  {get(member.roleEn, member.roleAr)}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
                  {get(member.bioEn, member.bioAr)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: '80px 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>
            {get(about.ctaTitle_en, about.ctaTitle_ar)}
          </h2>
          <p style={{ fontSize: '15px', color: '#475569', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            {get(about.ctaDesc_en, about.ctaDesc_ar)}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary" style={{ background: '#6c2bd9', padding: '12px 32px', fontSize: '14px', borderRadius: '8px' }}>
              {isRtl ? 'اتصل بنا' : 'Contact Us'}
            </Link>
            <button className="btn btn-outline" onClick={() => alert('Opening demo...')} style={{ padding: '12px 32px', fontSize: '14px', borderRadius: '8px', background: '#ffffff' }}>
              {isRtl ? 'شاهد عرضنا تقديمي' : 'Watch our demo'}
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '40px 0', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', color: '#6c2bd9' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 14l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{t('app_name')}</span>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="#" style={{ color: '#94a3b8', fontSize: '12px', textDecoration: 'none' }}>{t('privacy_policy')}</a>
            <a href="#" style={{ color: '#94a3b8', fontSize: '12px', textDecoration: 'none' }}>{t('terms_of_service')}</a>
            <a href="#" style={{ color: '#94a3b8', fontSize: '12px', textDecoration: 'none' }}>{t('contact')}</a>
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>© {new Date().getFullYear()} PASlytics AI. {t('all_rights_reserved')}</div>
        </footer>

      </div>
    </div>
  );
};

export default AboutPage;
