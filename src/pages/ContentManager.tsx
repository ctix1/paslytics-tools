import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useContent, defaultHomepage, defaultAbout, HomepageContent, AboutContent } from '../context/ContentContext';

type Tab = 'homepage' | 'about';

const ContentManager = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';
  const { homepage, about, setHomepage, setAbout, resetHomepage, resetAbout } = useContent();

  const [activeTab, setActiveTab] = useState<Tab>('homepage');
  const [homeForm, setHomeForm] = useState<HomepageContent>({ ...homepage });
  const [aboutForm, setAboutForm] = useState<AboutContent>({ ...about });
  const [saved, setSaved] = useState(false);

  const updateHome = (key: keyof HomepageContent, val: string) => setHomeForm(f => ({ ...f, [key]: val }));
  const updateAbout = (key: keyof AboutContent, val: string) => setAboutForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (activeTab === 'homepage') setHomepage(homeForm);
    else setAbout(aboutForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (activeTab === 'homepage') { resetHomepage(); setHomeForm({ ...defaultHomepage }); }
    else { resetAbout(); setAboutForm({ ...defaultAbout }); }
    setSaved(false);
  };

  const Field = ({ label, enKey, arKey, form, update, multiline = false }: {
    label: string; enKey: keyof HomepageContent | keyof AboutContent;
    arKey: keyof HomepageContent | keyof AboutContent;
    form: HomepageContent | AboutContent; update: (k: any, v: string) => void; multiline?: boolean;
  }) => {
    const en_val = (form as any)[enKey] ?? '';
    const ar_val = (form as any)[arKey] ?? '';
    const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const, color: '#1e293b', background: '#fff', resize: 'vertical' as const };
    return (
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>{label}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>🇬🇧 EN</div>
            {multiline
              ? <textarea rows={3} style={inputStyle} value={en_val} onChange={e => update(enKey, e.target.value)} />
              : <input style={inputStyle} value={en_val} onChange={e => update(enKey, e.target.value)} />}
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>🇸🇦 AR</div>
            {multiline
              ? <textarea rows={3} style={{ ...inputStyle, direction: 'rtl', textAlign: 'right' }} value={ar_val} onChange={e => update(arKey, e.target.value)} />
              : <input style={{ ...inputStyle, direction: 'rtl', textAlign: 'right' }} value={ar_val} onChange={e => update(arKey, e.target.value)} />}
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="p-8" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '900px' }}>

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>{t('content_manager_title')}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{t('content_manager_desc')}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" onClick={handleReset} style={{ fontSize: '13px', padding: '8px 16px', color: '#dc2626' }}>
                {t('content_reset_btn')}
              </button>
              <button className="btn btn-primary" onClick={handleSave} style={{ background: saved ? '#16a34a' : '#6c2bd9', fontSize: '13px', padding: '8px 20px' }}>
                {saved ? `✓ ${t('content_saved')}` : `💾 ${t('content_save_btn')}`}
              </button>
            </div>
          </div>

          {/* Notice */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: '#16a34a', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {t('content_live_note')}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '28px', width: 'fit-content' }}>
            {(['homepage', 'about'] as Tab[]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: activeTab === tab ? '#ffffff' : 'transparent', color: activeTab === tab ? '#6c2bd9' : '#64748b', boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
                {tab === 'homepage' ? t('content_tab_home') : t('content_tab_about')}
              </button>
            ))}
          </div>

          {/* Homepage Tab */}
          {activeTab === 'homepage' && (
            <div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>🦸 {t('content_section_hero')}</div>
                <Field label={t('content_hero_title1')} enKey="heroTitle1_en" arKey="heroTitle1_ar" form={homeForm} update={updateHome} />
                <Field label={t('content_hero_title2')} enKey="heroTitle2_en" arKey="heroTitle2_ar" form={homeForm} update={updateHome} />
                <Field label={t('content_hero_desc')} enKey="heroDesc_en" arKey="heroDesc_ar" form={homeForm} update={updateHome} multiline />
              </div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>⚡ {t('content_section_features')}</div>
                {[1, 2, 3].map(n => (
                  <div key={n}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>Feature {n}</div>
                    <Field label={t('content_feature_title')} enKey={`f${n}Title_en` as keyof HomepageContent} arKey={`f${n}Title_ar` as keyof HomepageContent} form={homeForm} update={updateHome} />
                    <Field label={t('content_feature_desc')} enKey={`f${n}Desc_en` as keyof HomepageContent} arKey={`f${n}Desc_ar` as keyof HomepageContent} form={homeForm} update={updateHome} multiline />
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>🚀 {t('content_section_cta')}</div>
                <Field label={t('content_cta_heading')} enKey="ctaHeading_en" arKey="ctaHeading_ar" form={homeForm} update={updateHome} />
                <Field label={t('content_cta_desc')} enKey="ctaDesc_en" arKey="ctaDesc_ar" form={homeForm} update={updateHome} multiline />
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>🏷️ {t('content_section_hero')}</div>
                <Field label={t('content_badge')} enKey="badge_en" arKey="badge_ar" form={aboutForm} update={updateAbout} />
                <Field label={t('content_heading')} enKey="heading_en" arKey="heading_ar" form={aboutForm} update={updateAbout} />
                <Field label={t('content_subheading')} enKey="subheading_en" arKey="subheading_ar" form={aboutForm} update={updateAbout} multiline />
              </div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>🎯 {t('content_section_vision')}</div>
                <Field label={t('content_vision_title')} enKey="visionTitle_en" arKey="visionTitle_ar" form={aboutForm} update={updateAbout} />
                <Field label={t('content_vision_text')} enKey="visionText_en" arKey="visionText_ar" form={aboutForm} update={updateAbout} multiline />
                <Field label={t('content_mission_title')} enKey="missionTitle_en" arKey="missionTitle_ar" form={aboutForm} update={updateAbout} />
                <Field label={t('content_mission_text')} enKey="missionText_en" arKey="missionText_ar" form={aboutForm} update={updateAbout} multiline />
              </div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>👥 {t('content_section_team')}</div>
                <Field label={t('content_team_title')} enKey="teamTitle_en" arKey="teamTitle_ar" form={aboutForm} update={updateAbout} />
                <Field label={t('content_team_subtitle')} enKey="teamSubtitle_en" arKey="teamSubtitle_ar" form={aboutForm} update={updateAbout} />
                {[1, 2, 3].map(n => (
                  <div key={n} style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>{t('content_team_member')} {n}</div>
                    <Field label={t('content_name')} enKey={`tm${n}Name_en` as keyof AboutContent} arKey={`tm${n}Name_ar` as keyof AboutContent} form={aboutForm} update={updateAbout} />
                    <Field label={t('content_role')} enKey={`tm${n}Role_en` as keyof AboutContent} arKey={`tm${n}Role_ar` as keyof AboutContent} form={aboutForm} update={updateAbout} />
                    <Field label={t('content_bio')} enKey={`tm${n}Bio_en` as keyof AboutContent} arKey={`tm${n}Bio_ar` as keyof AboutContent} form={aboutForm} update={updateAbout} multiline />
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>🚀 {t('content_section_cta')}</div>
                <Field label={t('content_cta_heading')} enKey="ctaTitle_en" arKey="ctaTitle_ar" form={aboutForm} update={updateAbout} />
                <Field label={t('content_cta_desc')} enKey="ctaDesc_en" arKey="ctaDesc_ar" form={aboutForm} update={updateAbout} multiline />
              </div>
            </div>
          )}

        </div>
    </div>
  );
};
};

export default ContentManager;
