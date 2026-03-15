import { createContext, useContext, useState, useEffect } from 'react';

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

export const defaultHomepage: HomepageContent = {
  heroTitle1_en: 'AI-Powered Product ',  heroTitle1_ar: 'تحليل المنتجات ',
  heroTitle2_en: 'Analysis',             heroTitle2_ar: 'بالذكاء الاصطناعي',
  heroDesc_en: 'Unlock deep consumer insights using the PAS (Problem-Agitation-Solution) framework driven by advanced artificial intelligence. Transform features into emotional benefits.',
  heroDesc_ar: 'استكشف رؤى المستهلكين العميقة باستخدام إطار عمل PAS (المشكلة-التهيج-الحل) المدعوم بالذكاء الاصطناعي المتقدم. حوّل ميزات المنتجات إلى فوائد عاطفية.',
  ctaHeading_en: 'Ready to revolutionize your product marketing?',
  ctaHeading_ar: 'هل أنت مستعد لإحداث ثورة في تسويق منتجاتك؟',
  ctaDesc_en: 'Join hundreds of product managers using PASlytics to optimize their workflow and increase conversion rates.',
  ctaDesc_ar: 'انضم إلى مئات مديري المنتجات الذين يستخدمون PASlytics لتحسين سير عملهم وزيادة معدلات التحويل.',
  f1Title_en: 'AI Image Analysis',        f1Title_ar: 'تحليل الصور بالذكاء الاصطناعي',
  f1Desc_en: 'Upload product images and let our AI automatically identify key visual selling points and physical attributes that trigger purchase intent.',
  f1Desc_ar: 'ارفع صور المنتجات ودع الذكاء الاصطناعي يحدد نقاط البيع البصرية الرئيسية والخصائص الجسدية التي تحفز نية الشراء.',
  f2Title_en: 'PAS Framework Output',     f2Title_ar: 'موثوق PAS إطار عمل',
  f2Desc_en: 'Generate high-converting copy structures based on the proven Problem-Agitation-Solution framework used by top direct-response marketers.',
  f2Desc_ar: 'أنشئ هياكل نصية عالية التحويل بناءً على إطار عمل المشكلة-التهيج-الحل المثبت فعاليته.',
  f3Title_en: 'Comprehensive Logs',       f3Title_ar: 'تسجيل شامل للتحليلات',
  f3Desc_en: 'Keep track of every analysis with detailed historical logs and performance metrics. Compare different versions of product copy over time.',
  f3Desc_ar: 'تتبع كل تحليل مع سجلات تاريخية تفصيلية ومقاييس أداء. قارن بين إصدارات مختلفة من نصوص المنتجات عبر الزمن.',
};

export const defaultAbout: AboutContent = {
  badge_en: 'About Us',           badge_ar: 'عن الموقع',
  heading_en: 'About PASlytics',  heading_ar: 'نبذة عن PASlytics',
  subheading_en: 'We are a leading company in the field of AI product analysis, aiming to help companies improve their marketing strategies and increase conversion rates.',
  subheading_ar: 'نحن شركة رائدة في مجال تحليل المنتجات باستخدام الذكاء الاصطناعي، نهدف إلى مساعدة الشركات في تحسين استراتيجيات تسويقها وزيادة معدلات التحويل.',
  visionTitle_en: 'Our Vision',   visionTitle_ar: 'رؤيتنا',
  visionText_en: 'To be the first partner for companies in transforming product data into a practical vision that helps them outperform competitors and achieve their commercial goals.',
  visionText_ar: 'أن نكون الشريك الأول للشركات في تحويل بيانات المنتجات إلى رؤى عملية تساعدها في التفوق على المنافسين وتحقيق أهدافها التجارية.',
  missionTitle_en: 'Our Mission', missionTitle_ar: 'رسالتنا',
  missionText_en: 'Providing advanced analysis tools that rely on AI to unlock the potential of products, and improve the customer experience by transforming features into attractive emotional benefits.',
  missionText_ar: 'تقديم أدوات تحليل متقدمة تعتمد على الذكاء الاصطناعي لإطلاق إمكانات المنتجات، وتحسين تجربة العملاء من خلال تحويل الميزات إلى فوائد عاطفية وجذابة.',
  teamTitle_en: 'Our Team',       teamTitle_ar: 'فريقنا',
  teamSubtitle_en: 'We are a team of experts in AI, marketing and analytics.',
  teamSubtitle_ar: 'نحن فريق من الخبراء في الذكاء الاصطناعي والتسويق والتحليل',
  tm1Name_en: 'Dr. Ali Ahmed',    tm1Name_ar: 'د. محمد علي',
  tm1Role_en: 'Founder & CEO',    tm1Role_ar: 'مؤسس ورئيس التنفيذ',
  tm1Bio_en: '10+ years of expertise in AI',
  tm1Bio_ar: 'سنوات 10 خبير في الذكاء الاصطناعي',
  tm2Name_en: 'Sara Khalid',      tm2Name_ar: 'سارة خالد',
  tm2Role_en: 'Marketing Director', tm2Role_ar: 'مدير التسويق',
  tm2Bio_en: 'Expert in e-commerce product marketing',
  tm2Bio_ar: 'خبيرة في تسويق المنتجات عبر الإنترنت',
  tm3Name_en: 'Ali Ahmad',        tm3Name_ar: 'علي أحمد',
  tm3Role_en: 'Technical Dev Director', tm3Role_ar: 'مدير التطوير التقني',
  tm3Bio_en: 'Specialized in AI analytics applications',
  tm3Bio_ar: 'متخصص في تطبيقات الذكاء الاصطناعي',
  ctaTitle_en: 'Have Questions?', ctaTitle_ar: 'هل لديك أسئلة؟',
  ctaDesc_en: 'Contact us today to find out how we can help you improve your product marketing strategies and increase conversion rates.',
  ctaDesc_ar: 'اتصل بنا اليوم لاستكشاف كيف يمكننا مساعدتك في تحسين استراتيجيات تسويق منتجاتك وزيادة معدلات التحويل.',
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
  const [homepage, setHomepageState] = useState<HomepageContent>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HOME);
      return stored ? { ...defaultHomepage, ...JSON.parse(stored) } : defaultHomepage;
    } catch { return defaultHomepage; }
  });

  const [about, setAboutState] = useState<AboutContent>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ABOUT);
      return stored ? { ...defaultAbout, ...JSON.parse(stored) } : defaultAbout;
    } catch { return defaultAbout; }
  });

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
