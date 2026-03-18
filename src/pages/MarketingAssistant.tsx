import { useLanguage } from '../i18n/LanguageContext';
import ContentCreator from '../components/ContentCreator';

const MarketingAssistant = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  return (
    <div className={`p-8 max-w-7xl mx-auto min-h-screen ${isRtl ? 'font-arabic' : ''}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <ContentCreator />
    </div>
  );
};

export default MarketingAssistant;
