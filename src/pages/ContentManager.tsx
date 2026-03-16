import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useContent, HomepageContent, AboutContent, defaultHomepage, defaultAbout } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  RotateCcw, 
  Home, 
  Info, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Layout, 
  Target, 
  Users, 
  UserPlus,
  Type,
  FileText,
  Rocket,
  Zap,
  Shield
} from 'lucide-react';

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
    if (window.confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
      if (activeTab === 'homepage') { resetHomepage(); setHomeForm({ ...defaultHomepage }); }
      else { resetAbout(); setAboutForm({ ...defaultAbout }); }
      setSaved(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const Field = ({ label, enKey, arKey, form, update, multiline = false, icon: Icon }: {
    label: string; enKey: keyof HomepageContent | keyof AboutContent;
    arKey: keyof HomepageContent | keyof AboutContent;
    form: HomepageContent | AboutContent; update: (k: any, v: string) => void; multiline?: boolean; icon: any;
  }) => {
    const en_val = (form as any)[enKey] ?? '';
    const ar_val = (form as any)[arKey] ?? '';
    return (
      <div className="space-y-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl group/field hover:bg-white/[0.04] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="text-xs font-black text-white uppercase tracking-widest">{label}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <Globe className="w-3 h-3" />
              English
            </div>
            {multiline ? (
              <textarea 
                rows={3} value={en_val} onChange={e => update(enKey, e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-brand-primary/50 outline-none transition-all placeholder:text-slate-600 font-medium resize-none shadow-inner"
              />
            ) : (
              <input 
                type="text" value={en_val} onChange={e => update(enKey, e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-primary/50 outline-none transition-all placeholder:text-slate-600 font-medium shadow-inner"
              />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <Globe className="w-3 h-3" />
              Arabic
            </div>
            {multiline ? (
              <textarea 
                rows={3} value={ar_val} onChange={e => update(arKey, e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-brand-primary/50 outline-none transition-all placeholder:text-slate-600 font-medium font-arabic text-right dir-rtl resize-none shadow-inner"
              />
            ) : (
              <input 
                type="text" value={ar_val} onChange={e => update(arKey, e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-primary/50 outline-none transition-all placeholder:text-slate-600 font-medium font-arabic text-right dir-rtl shadow-inner"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto space-y-8 pb-20"
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">{t('content_manager_title')}</h1>
          <p className="text-slate-400 font-medium">{t('content_manager_desc')}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 font-bold hover:bg-red-500/10 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            {t('content_reset_btn')}
          </button>
          <button 
            onClick={handleSave}
            className={`btn-premium flex items-center gap-2 min-w-[160px] justify-center ${saved ? 'bg-green-600 shadow-green-500/20 hover:bg-green-500' : ''}`}
          >
            {saved ? <CheckCircle2 className="w-5 h-5 animate-bounce" /> : <Save className="w-5 h-5" />}
            {saved ? t('content_saved') : t('content_save_btn')}
          </button>
        </div>
      </header>

      {/* Notice & Tabs */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
          {[
            { id: 'homepage', label: t('content_tab_home'), icon: Home },
            { id: 'about', label: t('content_tab_about'), icon: Info }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                ${activeTab === tab.id ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 px-5 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <Rocket className="w-4 h-4 animate-pulse" />
          {t('content_live_note')}
        </div>
      </div>

      {/* Content Form Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'homepage' ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 gap-8"
          >
            {/* Hero Section */}
            <section className="glass-panel p-8 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary/50" />
              <div className="flex items-center gap-4">
                <Sparkles className="text-brand-primary w-6 h-6" />
                <h3 className="text-xl font-black text-white tracking-tight uppercase">{t('content_section_hero')}</h3>
              </div>
              <div className="space-y-6">
                <Field label={t('content_hero_title1')} enKey="heroTitle1_en" arKey="heroTitle1_ar" form={homeForm} update={updateHome} icon={Type} />
                <Field label={t('content_hero_title2')} enKey="heroTitle2_en" arKey="heroTitle2_ar" form={homeForm} update={updateHome} icon={Type} />
                <Field label={t('content_hero_desc')} enKey="heroDesc_en" arKey="heroDesc_ar" form={homeForm} update={updateHome} multiline icon={FileText} />
              </div>
            </section>

            {/* Features Section */}
            <section className="glass-panel p-8 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
               <div className="flex items-center gap-4">
                <Layout className="text-amber-500 w-6 h-6" />
                <h3 className="text-xl font-black text-white tracking-tight uppercase">{t('content_section_features')}</h3>
              </div>
              <div className="grid grid-cols-1 gap-12">
                {[1, 2, 3].map(n => (
                  <div key={n} className="space-y-6">
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                       <div className="w-6 h-6 rounded-full border border-slate-800 flex items-center justify-center text-slate-400">0{n}</div>
                       Neural Feature Sync
                     </div>
                     <Field label={t('content_feature_title')} enKey={`f${n}Title_en` as keyof HomepageContent} arKey={`f${n}Title_ar` as keyof HomepageContent} form={homeForm} update={updateHome} icon={Sparkles} />
                     <Field label={t('content_feature_desc')} enKey={`f${n}Desc_en` as keyof HomepageContent} arKey={`f${n}Desc_ar` as keyof HomepageContent} form={homeForm} update={updateHome} multiline icon={FileText} />
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="glass-panel p-8 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
              <div className="flex items-center gap-4">
                <Rocket className="text-emerald-500 w-6 h-6" />
                <h3 className="text-xl font-black text-white tracking-tight uppercase">{t('content_section_cta')}</h3>
              </div>
              <div className="space-y-6">
                <Field label={t('content_cta_heading')} enKey="ctaHeading_en" arKey="ctaHeading_ar" form={homeForm} update={updateHome} icon={Type} />
                <Field label={t('content_cta_desc')} enKey="ctaDesc_en" arKey="ctaDesc_ar" form={homeForm} update={updateHome} multiline icon={FileText} />
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div 
            key="about"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 gap-8"
          >
            <section className="glass-panel p-8 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary/50" />
              <div className="flex items-center gap-4">
                <Info className="text-brand-primary w-6 h-6" />
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Corporate Identity</h3>
              </div>
              <div className="space-y-6">
                <Field label={t('content_badge')} enKey="badge_en" arKey="badge_ar" form={aboutForm} update={updateAbout} icon={Sparkles} />
                <Field label={t('content_heading')} enKey="heading_en" arKey="heading_ar" form={aboutForm} update={updateAbout} icon={Type} />
                <Field label={t('content_subheading')} enKey="subheading_en" arKey="subheading_ar" form={aboutForm} update={updateAbout} multiline icon={FileText} />
              </div>
            </section>

            <section className="glass-panel p-8 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
               <div className="flex items-center gap-4">
                <Target className="text-indigo-500 w-6 h-6" />
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Vision & Mission</h3>
              </div>
              <div className="grid grid-cols-1 gap-12">
                <div className="space-y-6">
                  <Field label={t('content_vision_title')} enKey="visionTitle_en" arKey="visionTitle_ar" form={aboutForm} update={updateAbout} icon={Target} />
                  <Field label={t('content_vision_text')} enKey="visionText_en" arKey="visionText_ar" form={aboutForm} update={updateAbout} multiline icon={FileText} />
                </div>
                <div className="space-y-6">
                  <Field label={t('content_mission_title')} enKey="missionTitle_en" arKey="missionTitle_ar" form={aboutForm} update={updateAbout} icon={Zap} />
                  <Field label={t('content_mission_text')} enKey="missionText_en" arKey="missionText_ar" form={aboutForm} update={updateAbout} multiline icon={FileText} />
                </div>
              </div>
            </section>

            <section className="glass-panel p-8 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-500/50" />
               <div className="flex items-center gap-4">
                <Users className="text-fuchsia-500 w-6 h-6" />
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Neural Collective (Team)</h3>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label={t('content_team_title')} enKey="teamTitle_en" arKey="teamTitle_ar" form={aboutForm} update={updateAbout} icon={Type} />
                  <Field label={t('content_team_subtitle')} enKey="teamSubtitle_en" arKey="teamSubtitle_ar" form={aboutForm} update={updateAbout} icon={FileText} />
                </div>
                <div className="space-y-12 pt-8 border-t border-white/5">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="space-y-6 relative">
                       <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                         <div className="w-6 h-6 rounded-full border border-slate-800 flex items-center justify-center text-slate-400">0{n}</div>
                         Neural Architect
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Field label={t('content_name')} enKey={`tm${n}Name_en` as keyof AboutContent} arKey={`tm${n}Name_ar` as keyof AboutContent} form={aboutForm} update={updateAbout} icon={UserPlus} />
                          <Field label={t('content_role')} enKey={`tm${n}Role_en` as keyof AboutContent} arKey={`tm${n}Role_ar` as keyof AboutContent} form={aboutForm} update={updateAbout} icon={Shield} />
                       </div>
                       <Field label={t('content_bio')} enKey={`tm${n}Bio_en` as keyof AboutContent} arKey={`tm${n}Bio_ar` as keyof AboutContent} form={aboutForm} update={updateAbout} multiline icon={FileText} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="pt-12 text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} PASLYTICS CONTENT OPS. {t('all_rights_reserved')}
      </footer>
    </motion.div>
  );
};

export default ContentManager;
