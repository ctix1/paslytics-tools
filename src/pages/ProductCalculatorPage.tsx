import { useLanguage } from '../i18n/LanguageContext';
import ProductCalculator from '../components/ProductCalculator';

const ProductCalculatorPage = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  return (
    <div className={`p-8 max-w-7xl mx-auto min-h-screen ${isRtl ? 'font-arabic' : ''}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <ProductCalculator />
    </div>
  );
};

export default ProductCalculatorPage;
