import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useContent, HomepageContent, AboutContent, defaultHomepage, defaultAbout } from '../context/ContentContext';
import { css } from '../../styled-system/css';

type Tab = 'homepage' | 'about';

const ContentManager = () => {
  const { t } = useLanguage();
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
    return (
      <div className={css({ marginBottom: '20px' })}>
        <div className={css({ fontSize: '13px', fontWeight: 'bold', color: 'slate.700', marginBottom: '8px' })}>{label}</div>
        <div className={css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' })}>
          <div>
            <div className={css({ fontSize: '11px', color: 'slate.400', marginBottom: '4px', fontWeight: 'bold' })}>🇬🇧 EN</div>
            {multiline
              ? <textarea rows={3} className={css({ width: '100%', padding: '10px', border: '1px solid', borderColor: 'slate.200', borderRadius: 'lg', fontSize: '13px', resize: 'vertical', _focus: { borderColor: 'brand.primary', outline: 'none' } })} value={en_val} onChange={e => update(enKey, e.target.value)} />
              : <input className={css({ width: '100%', padding: '10px', border: '1px solid', borderColor: 'slate.200', borderRadius: 'lg', fontSize: '13px', _focus: { borderColor: 'brand.primary', outline: 'none' } })} value={en_val} onChange={e => update(enKey, e.target.value)} />}
          </div>
          <div>
            <div className={css({ fontSize: '11px', color: 'slate.400', marginBottom: '4px', fontWeight: 'bold' })}>🇸🇦 AR</div>
            {multiline
              ? <textarea rows={3} className={css({ width: '100%', padding: '10px', border: '1px solid', borderColor: 'slate.200', borderRadius: 'lg', fontSize: '13px', direction: 'rtl', textAlign: 'right', resize: 'vertical', _focus: { borderColor: 'brand.primary', outline: 'none' } })} value={ar_val} onChange={e => update(arKey, e.target.value)} />
              : <input className={css({ width: '100%', padding: '10px', border: '1px solid', borderColor: 'slate.200', borderRadius: 'lg', fontSize: '13px', direction: 'rtl', textAlign: 'right', _focus: { borderColor: 'brand.primary', outline: 'none' } })} value={ar_val} onChange={e => update(arKey, e.target.value)} />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={css({ maxWidth: '1000px', margin: '0 auto' })}>
      {/* Header */}
      <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' })}>
        <div>
          <h1 className={css({ fontSize: '24px', fontWeight: 'bold', color: 'slate.900', marginBottom: '4px' })}>{t('content_manager_title')}</h1>
          <p className={css({ color: 'slate.500', fontSize: '14px' })}>{t('content_manager_desc')}</p>
        </div>
        <div className={css({ display: 'flex', gap: '12px' })}>
          <button 
            className={css({ 
              paddingY: '8px', 
              paddingX: '16px', 
              borderRadius: 'lg', 
              border: '1px solid', 
              borderColor: 'red.200', 
              color: 'red.600', 
              fontSize: '13px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              _hover: { backgroundColor: 'red.50' }
            })} 
            onClick={handleReset}
          >
            {t('content_reset_btn')}
          </button>
          <button 
            className={css({ 
              paddingY: '8px', 
              paddingX: '20px', 
              borderRadius: 'lg', 
              backgroundColor: saved ? 'green.600' : 'brand.primary', 
              color: 'white', 
              fontSize: '13px', 
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all',
              _hover: { backgroundColor: saved ? 'green.700' : 'brand.secondary' }
            })} 
            onClick={handleSave}
          >
            {saved ? `✓ ${t('content_saved')}` : `💾 ${t('content_save_btn')}`}
          </button>
        </div>
      </div>

      {/* Notice */}
      <div className={css({ 
        backgroundColor: 'green.50', 
        border: '1px solid', 
        borderColor: 'green.100', 
        borderRadius: 'xl', 
        padding: '12px 16px', 
        marginBottom: '24px', 
        fontSize: '13px', 
        color: 'green.700', 
        display: 'flex', 
        gap: '8px', 
        alignItems: 'center' 
      })}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {t('content_live_note')}
      </div>

      {/* Tabs */}
      <div className={css({ 
        display: 'flex', 
        gap: '4px', 
        backgroundColor: 'slate.100', 
        borderRadius: 'xl', 
        padding: '4px', 
        marginBottom: '32px', 
        width: 'fit-content' 
      })}>
        {(['homepage', 'about'] as Tab[]).map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={css({ 
              paddingY: '8px', 
              paddingX: '24px', 
              borderRadius: 'lg', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '13px', 
              fontWeight: 'bold',
              backgroundColor: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? 'brand.primary' : 'slate.500',
              boxShadow: activeTab === tab ? 'sm' : 'none',
              transition: 'all'
            })}
          >
            {tab === 'homepage' ? t('content_tab_home') : t('content_tab_about')}
          </button>
        ))}
      </div>

      {/* Content Form Area */}
      {activeTab === 'homepage' ? (
        <div className={css({ display: 'grid', gap: '20px' })}>
          <div className={css({ backgroundColor: 'white', border: '1px solid', borderColor: 'slate.100', borderRadius: '2xl', padding: '24px', boxShadow: 'sm' })}>
            <div className={css({ fontSize: '15px', fontWeight: 'black', color: 'slate.900', marginBottom: '24px', borderBottom: '1px solid', borderColor: 'slate.50', paddingBottom: '12px' })}>🦸 {t('content_section_hero')}</div>
            <Field label={t('content_hero_title1')} enKey="heroTitle1_en" arKey="heroTitle1_ar" form={homeForm} update={updateHome} />
            <Field label={t('content_hero_title2')} enKey="heroTitle2_en" arKey="heroTitle2_ar" form={homeForm} update={updateHome} />
            <Field label={t('content_hero_desc')} enKey="heroDesc_en" arKey="heroDesc_ar" form={homeForm} update={updateHome} multiline />
          </div>
          <div className={css({ backgroundColor: 'white', border: '1px solid', borderColor: 'slate.100', borderRadius: '2xl', padding: '24px', boxShadow: 'sm' })}>
            <div className={css({ fontSize: '15px', fontWeight: 'black', color: 'slate.900', marginBottom: '24px', borderBottom: '1px solid', borderColor: 'slate.50', paddingBottom: '12px' })}>⚡ {t('content_section_features')}</div>
            {[1, 2, 3].map(n => (
              <div key={n} className={css({ marginBottom: n < 3 ? '32px' : 0 })}>
                <div className={css({ fontSize: '12px', fontWeight: 'black', color: 'slate.400', marginBottom: '12px', textTransform: 'uppercase' })}>Feature {n}</div>
                <Field label={t('content_feature_title')} enKey={`f${n}Title_en` as keyof HomepageContent} arKey={`f${n}Title_ar` as keyof HomepageContent} form={homeForm} update={updateHome} />
                <Field label={t('content_feature_desc')} enKey={`f${n}Desc_en` as keyof HomepageContent} arKey={`f${n}Desc_ar` as keyof HomepageContent} form={homeForm} update={updateHome} multiline />
              </div>
            ))}
          </div>
          <div className={css({ backgroundColor: 'white', border: '1px solid', borderColor: 'slate.100', borderRadius: '2xl', padding: '24px', boxShadow: 'sm' })}>
            <div className={css({ fontSize: '15px', fontWeight: 'black', color: 'slate.900', marginBottom: '24px', borderBottom: '1px solid', borderColor: 'slate.50', paddingBottom: '12px' })}>🚀 {t('content_section_cta')}</div>
            <Field label={t('content_cta_heading')} enKey="ctaHeading_en" arKey="ctaHeading_ar" form={homeForm} update={updateHome} />
            <Field label={t('content_cta_desc')} enKey="ctaDesc_en" arKey="ctaDesc_ar" form={homeForm} update={updateHome} multiline />
          </div>
        </div>
      ) : (
        <div className={css({ display: 'grid', gap: '20px' })}>
          <div className={css({ backgroundColor: 'white', border: '1px solid', borderColor: 'slate.100', borderRadius: '2xl', padding: '24px', boxShadow: 'sm' })}>
            <div className={css({ fontSize: '15px', fontWeight: 'black', color: 'slate.900', marginBottom: '24px', borderBottom: '1px solid', borderColor: 'slate.50', paddingBottom: '12px' })}>🏷️ {t('content_section_hero')}</div>
            <Field label={t('content_badge')} enKey="badge_en" arKey="badge_ar" form={aboutForm} update={updateAbout} />
            <Field label={t('content_heading')} enKey="heading_en" arKey="heading_ar" form={aboutForm} update={updateAbout} />
            <Field label={t('content_subheading')} enKey="subheading_en" arKey="subheading_ar" form={aboutForm} update={updateAbout} multiline />
          </div>
          <div className={css({ backgroundColor: 'white', border: '1px solid', borderColor: 'slate.100', borderRadius: '2xl', padding: '24px', boxShadow: 'sm' })}>
            <div className={css({ fontSize: '15px', fontWeight: 'black', color: 'slate.900', marginBottom: '24px', borderBottom: '1px solid', borderColor: 'slate.50', paddingBottom: '12px' })}>🎯 {t('content_section_vision')}</div>
            <Field label={t('content_vision_title')} enKey="visionTitle_en" arKey="visionTitle_ar" form={aboutForm} update={updateAbout} />
            <Field label={t('content_vision_text')} enKey="visionText_en" arKey="visionText_ar" form={aboutForm} update={updateAbout} multiline />
            <Field label={t('content_mission_title')} enKey="missionTitle_en" arKey="missionTitle_ar" form={aboutForm} update={updateAbout} />
            <Field label={t('content_mission_text')} enKey="missionText_en" arKey="missionText_ar" form={aboutForm} update={updateAbout} multiline />
          </div>
          <div className={css({ backgroundColor: 'white', border: '1px solid', borderColor: 'slate.100', borderRadius: '2xl', padding: '24px', boxShadow: 'sm' })}>
            <div className={css({ fontSize: '15px', fontWeight: 'black', color: 'slate.900', marginBottom: '24px', borderBottom: '1px solid', borderColor: 'slate.50', paddingBottom: '12px' })}>👥 {t('content_section_team')}</div>
            <Field label={t('content_team_title')} enKey="teamTitle_en" arKey="teamTitle_ar" form={aboutForm} update={updateAbout} />
            <Field label={t('content_team_subtitle')} enKey="teamSubtitle_en" arKey="teamSubtitle_ar" form={aboutForm} update={updateAbout} />
            {[1, 2, 3].map(n => (
              <div key={n} className={css({ borderTop: '1px solid', borderColor: 'slate.50', paddingTop: '20px', marginTop: '20px' })}>
                <div className={css({ fontSize: '12px', fontWeight: 'black', color: 'slate.400', marginBottom: '12px', textTransform: 'uppercase' })}>{t('content_team_member')} {n}</div>
                <Field label={t('content_name')} enKey={`tm${n}Name_en` as keyof AboutContent} arKey={`tm${n}Name_ar` as keyof AboutContent} form={aboutForm} update={updateAbout} />
                <Field label={t('content_role')} enKey={`tm${n}Role_en` as keyof AboutContent} arKey={`tm${n}Role_ar` as keyof AboutContent} form={aboutForm} update={updateAbout} />
                <Field label={t('content_bio')} enKey={`tm${n}Bio_en` as keyof AboutContent} arKey={`tm${n}Bio_ar` as keyof AboutContent} form={aboutForm} update={updateAbout} multiline />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
