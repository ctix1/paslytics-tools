import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../i18n/LanguageContext';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Target, 
  Rocket, 
  Layers, 
  ShieldCheck, 
  History, 
  Users, 
  ArrowRight,
  ChevronRight,
  Brain
} from 'lucide-react';

const AboutPage = () => {
  const { t, language } = useLanguage();
  const { about } = useContent();
  const isRtl = language === 'ar';
  const get = (en: string, ar: string) => isRtl ? ar : en;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: isRtl ? 'الاستخدام الذكي للذكاء الاصطناعي' : 'AI Smart Usage',
      desc: isRtl ? 'تستخدم تقنيات متقدمة لتحليل الصور والنصوص' : 'Uses advanced technology for image and text analysis',
      color: 'bg-indigo-500/20 text-indigo-400'
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: isRtl ? 'الموثوق PAS إطار عمل' : 'Trusted PAS Framework',
      desc: isRtl ? 'تستخدم إطار عمل المشكلة - الإثارة - الحل لإنشاء محتوى فعّال' : 'Uses the Problem-Agitation-Solution framework for effective content',
      color: 'bg-purple-500/20 text-purple-400'
    },
    {
      icon: <History className="w-6 h-6" />,
      title: isRtl ? 'تسجيل شامل للتحليلات' : 'Comprehensive Logs',
      desc: isRtl ? 'تقوم بتسجيل جميع التحليلات لمساعدتك في متابعة التقدم' : 'Records all analyses to help you follow progress',
      color: 'bg-fuchsia-500/20 text-fuchsia-400'
    },
  ];

  const team = [
    { nameEn: about.tm1Name_en, nameAr: about.tm1Name_ar, roleEn: about.tm1Role_en, roleAr: about.tm1Role_ar, bioEn: about.tm1Bio_en, bioAr: about.tm1Bio_ar },
    { nameEn: about.tm2Name_en, nameAr: about.tm2Name_ar, roleEn: about.tm2Role_en, roleAr: about.tm2Role_ar, bioEn: about.tm2Bio_en, bioAr: about.tm2Bio_ar },
    { nameEn: about.tm3Name_en, nameAr: about.tm3Name_ar, roleEn: about.tm3Role_en, roleAr: about.tm3Role_ar, bioEn: about.tm3Bio_en, bioAr: about.tm3Bio_ar },
  ];

  return (
    <div className={`min-h-screen bg-slate-950 text-white selection:bg-brand-primary/30 ${isRtl ? 'font-arabic' : ''}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 overflow-hidden">
        
        {/* Dynamic Backgrounds */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Hero Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-32"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 glass-panel border-white/5 bg-white/5 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              {get(about.badge_en, about.badge_ar)}
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]"
          >
            {get(about.heading_en, about.heading_ar)}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            {get(about.subheading_en, about.subheading_ar)}
          </motion.p>
        </motion.section>

        {/* Vision & Mission Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-12 xl:col-span-7 glass-panel p-10 md:p-16 flex flex-col justify-center relative group overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <Target className="w-12 h-12 text-brand-primary mb-8" />
             <h2 className="text-3xl font-black tracking-tighter mb-6">{get(about.visionTitle_en, about.visionTitle_ar)}</h2>
             <p className="text-lg text-slate-400 font-medium leading-relaxed">
               {get(about.visionText_en, about.visionText_ar)}
             </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-12 xl:col-span-5 glass-panel p-10 md:p-16 flex flex-col justify-center border-brand-primary/20 bg-brand-primary/5"
          >
             <Rocket className="w-12 h-12 text-brand-primary mb-8" />
             <h2 className="text-3xl font-black tracking-tighter mb-6">{get(about.missionTitle_en, about.missionTitle_ar)}</h2>
             <p className="text-lg text-slate-300 font-medium leading-relaxed">
               {get(about.missionText_en, about.missionText_ar)}
             </p>
          </motion.div>
        </div>

        {/* Core Pillars */}
        <section className="mb-32">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-black racking-tighter mb-4">Core Technology</h2>
             <p className="text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">Crafting the next generation of narrative intelligence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 hover:bg-white/10 transition-all group"
              >
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-black mb-4">{f.title}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-32 relative">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black tracking-tighter mb-4"
            >
              {get(about.teamTitle_en, about.teamTitle_ar)}
            </motion.h2>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto">
              {get(about.teamSubtitle_en, about.teamSubtitle_ar)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-brand-primary opacity-0 blur-2xl group-hover:opacity-10 transition-opacity" />
                <div className="glass-panel p-10 text-center relative z-10 hover:border-brand-primary/50 transition-colors">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full mx-auto mb-8 flex items-center justify-center p-1 border border-white/10 group-hover:border-brand-primary/50 transition-colors">
                    <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-brand-primary">
                      <Users className="w-10 h-10 opacity-50" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black mb-2">{get(member.nameEn, member.nameAr)}</h3>
                  <div className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-6">
                    {get(member.roleEn, member.roleAr)}
                  </div>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-4 italic">
                    "{get(member.bioEn, member.bioAr)}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center glass-panel p-16 md:p-24 bg-brand-primary relative overflow-hidden group border-none"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-purple-900 to-brand-primary opacity-90" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8">
              {get(about.ctaTitle_en, about.ctaTitle_ar)}
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              {get(about.ctaDesc_en, about.ctaDesc_ar)}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/register" 
                className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-2 group/btn no-underline"
              >
                {isRtl ? 'اتصل بنا' : 'Contact Us'}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => alert('Launching holographic presentation...')}
                className="px-10 py-5 glass-panel bg-white/10 border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                {isRtl ? 'شاهد عرضنا تقديمي' : 'Neural Demo'}
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-black uppercase tracking-[0.2em]">{t('app_name')}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white no-underline transition-colors">{t('privacy_policy')}</a>
          <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white no-underline transition-colors">{t('terms_of_service')}</a>
          <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white no-underline transition-colors">{t('contact')}</a>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
          © {new Date().getFullYear()} PASLYTICS NEURAL. {t('all_rights_reserved')}
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
