import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Interfaces ---
export interface HomepageContent {
  heroTitle1_en: string; heroTitle1_ar: string;
  heroTitle2_en: string; heroTitle2_ar: string;
  heroDesc_en: string; heroDesc_ar: string;
  ctaHeading_en: string; ctaHeading_ar: string;
  ctaDesc_en: string; ctaDesc_ar: string;
  f1Title_en: string; f1Title_ar: string;
  f1Desc_en: string; f1Desc_ar: string;
  f2Title_en: string; f2Title_ar: string;
  f2Desc_en: string; f2Desc_ar: string;
  f3Title_en: string; f3Title_ar: string;
  f3Desc_en: string; f3Desc_ar: string;
}

export interface AboutContent {
  badge_en: string; badge_ar: string;
  heading_en: string; heading_ar: string;
  subheading_en: string; subheading_ar: string;
  visionTitle_en: string; visionTitle_ar: string;
  visionText_en: string; visionText_ar: string;
  missionTitle_en: string; missionTitle_ar: string;
  missionText_en: string; missionText_ar: string;
  teamTitle_en: string; teamTitle_ar: string;
  teamSubtitle_en: string; teamSubtitle_ar: string;
  tm1Name_en: string; tm1Name_ar: string;
  tm1Role_en: string; tm1Role_ar: string;
  tm1Bio_en: string; tm1Bio_ar: string;
  tm2Name_en: string; tm2Name_ar: string;
  tm2Role_en: string; tm2Role_ar: string;
  tm2Bio_en: string; tm2Bio_ar: string;
  tm3Name_en: string; tm3Name_ar: string;
  tm3Role_en: string; tm3Role_ar: string;
  tm3Bio_en: string; tm3Bio_ar: string;
  ctaTitle_en: string; ctaTitle_ar: string;
  ctaDesc_en: string; ctaDesc_ar: string;
}

// --- Default Data (The Source of Truth) ---
export const defaultHomepage: HomepageContent = {
  heroTitle1_en: 'Advanced Neural', heroTitle1_ar: 'التحليل العصبي المتقدم',
  heroTitle2_en: 'Marketing Intelligence', heroTitle2_ar: 'الذكاء التسويقي',
  heroDesc_en: 'Unlock deep consumer insights...', heroDesc_ar: 'استكشف رؤى المستهلكين العميقة...',
  ctaHeading_en: 'Ready to revolutionize?', ctaHeading_ar: 'هل أنت مستعد لإحداث ثورة؟',
  ctaDesc_en: 'Join hundreds of product managers...', ctaDesc_ar: 'انضم إلى مئات مديري المنتجات...',
  f1Title_en: 'AI Vision Analysis', f1Title_ar: 'تحليل الرؤية الذكي',
  f1Desc_en: 'Upload product images...', f1Desc_ar: 'ارفع صور المنتجات...',
  f2Title_en: 'PAS Framework Output', f2Title_ar: 'إخراج إطار عمل PAS',
  f2Desc_en: 'Generate high-converting copy...', f2Desc_ar: 'أنشئ نصوصاً ترويجية عالية التحويل...',
  f3Title_en: 'Comprehensive Logs', f3Title_ar: 'سجلات شاملة للتحليلات',
  f3Desc_en: 'Keep track of every analysis...', f3Desc_ar: 'تتبع كل تحليل مع سجلات مفصلة...',
};

export const defaultAbout: AboutContent = {
  badge_en: 'Protocol v2.0', badge_ar: 'بروتوكول 2.0',
  heading_en: 'About the Neural Integration', heading_ar: 'حول التكامل العصبي',
  subheading_en: 'We are reaching a new era...', subheading_ar: 'نحن نصل إلى عصر جديد...',
  visionTitle_en: 'Our Vision', visionTitle_ar: 'رؤيتنا',
  visionText_en: 'To be the first partner...', visionText_ar: 'أن نكون الشريك الأول للشركات...',
  missionTitle_en: 'Our Mission', missionTitle_ar: 'رسالتنا',
  missionText_en: 'Providing advanced analysis tools...', missionText_ar: 'تقديم أدوات تحليل متقدمة...',
  teamTitle_en: 'Our Team', teamTitle_ar: 'فريقنا',
  teamSubtitle_en: 'Experts in AI and Marketing', teamSubtitle_ar: 'خبراء في الذكاء الاصطناعي والتسويق',
  tm1Name_en: 'Dr. Ali Ahmed', tm1Name_ar: 'د. علي أحمد',
  tm1Role_en: 'Founder & CEO', tm1Role_ar: 'المؤسس ورئيس التنفيذي',
  tm1Bio_en: '10+ years of expertise in AI', tm1Bio_ar: 'أكثر من 10 سنوات خبرة في الذكاء الاصطناعي',
  tm2Name_en: 'Sara Khalid', tm2Name_ar: 'سارة خالد',
  tm2Role_en: 'Marketing Director', tm2Role_ar: 'مديرة التسويق',
  tm2Bio_en: 'Expert in e-commerce marketing', tm2Bio_ar: 'خبيرة في تسويق التجارة الإلكترونية',
  tm3Name_en: 'Ali Ahmad', tm3Name_ar: 'علي أحمد',
  tm3Role_en: 'Technical Dev Director', tm3Role_ar: 'مدير التطوير التقني',
  tm3Bio_en: 'Specialized in AI analytics', tm3Bio_ar: 'متخصص في تحليلات الذكاء الاصطناعي',
  ctaTitle_en: 'Have Questions?', ctaTitle_ar: 'هل لديك أسئلة؟',
  ctaDesc_en: 'Contact us today...', ctaDesc_ar: 'اتصل بنا اليوم...',
};

const STORAGE_KEY_HOME = 'paslytics_homepage_content';
const STORAGE_KEY_ABOUT = 'paslytics_about_content';

interface ContentContextType {
  homepage: HomepageContent;
  about: AboutContent;
  setHomepage: (c: HomepageContent) => void;
  setAbout: (c: AboutContent) => void;
  resetHomepage: () => void;
  resetAbout: () => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  // استخدام الحالة الأولية مباشرة من الكود لضمان السرعة ومنع الـ 404
  const [homepage, setHomepageState] = useState<HomepageContent>(defaultHomepage);
  const [about, setAboutState] = useState<AboutContent>(defaultAbout);

  // تحديث الحالة من localStorage فقط بعد تحميل الصفحة (للمزامنة وليس للتحكم)
  useEffect(() => {
    const storedHome = localStorage.getItem(STORAGE_KEY_HOME);
    const storedAbout = localStorage.getItem(STORAGE_KEY_ABOUT);

    if (storedHome) {
      try {
        const parsed = JSON.parse(storedHome);
        setHomepageState(prev => ({ ...prev, ...parsed }));
      } catch (e) { console.error("Error parsing homepage content", e); }
    }

    if (storedAbout) {
      try {
        const parsed = JSON.parse(storedAbout);
        setAboutState(prev => ({ ...prev, ...parsed }));
      } catch (e) { console.error("Error parsing about content", e); }
    }
  }, []);

  const setHomepage = (c: HomepageContent) => {
    setHomepageState(c);
    localStorage.setItem(STORAGE_KEY_HOME, JSON.stringify(c));
  };

  const setAbout = (c: AboutContent) => {
    setAboutState(c);
    localStorage.setItem(STORAGE_KEY_ABOUT, JSON.stringify(c));
  };

  const resetHomepage = () => {
    setHomepageState(defaultHomepage);
    localStorage.removeItem(STORAGE_KEY_HOME);
  };

  const resetAbout = () => {
    setAboutState(defaultAbout);
    localStorage.removeItem(STORAGE_KEY_ABOUT);
  };

  return (
    <ContentContext.Provider value={{ homepage, about, setHomepage, setAbout, resetHomepage, resetAbout }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
};
