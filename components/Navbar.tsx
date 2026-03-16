import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { css } from '../../styled-system/css';

const Navbar = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';

  return (
    <nav className={css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingX: { base: '16px', md: '32px' },
      paddingY: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropBlur: 'md',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid',
      borderColor: 'slate.100',
      direction: isRtl ? 'rtl' : 'ltr'
    })}>
      {/* Logo Section */}
      <div className={css({ flex: '0 0 auto', display: 'flex', alignItems: 'center' })}>
        <Link to="/" className={css({ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' })}>
          <div className={css({ 
            width: '36px', 
            height: '36px', 
            backgroundColor: 'brand.primary', 
            borderRadius: 'xl', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 10px 15px -3px rgba(109, 40, 217, 0.2)' 
          })}>
            <LayoutDashboard className={css({ color: 'white', width: '20px', height: '20px' })} />
          </div>
          <span className={css({ 
            fontSize: '18px',
            fontWeight: 'black',
            color: 'slate.900',
            letterSpacing: 'tight' 
          })}>{t('app_name')}</span>
        </Link>
      </div>
      
      {/* Centered Links Section */}
      <div className={css({ 
        flex: 1,
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center', 
        gap: { base: '16px', md: '32px' }, 
        fontSize: '14px', 
        fontWeight: 'bold', 
        color: 'slate.500', 
        textTransform: 'uppercase', 
        letterSpacing: 'wider' 
      })}>
        <Link to="/" className={css({ transition: 'colors', _hover: { color: 'brand.primary' }, textDecoration: 'none' })}>{t('home')}</Link>
        <Link to="/plan" className={css({ transition: 'colors', _hover: { color: 'brand.primary' }, textDecoration: 'none' })}>{t('plan')}</Link>
        <Link to="/about" className={css({ transition: 'colors', _hover: { color: 'brand.primary' }, textDecoration: 'none' })}>{t('about')}</Link>
      </div>

      {/* Actions Section */}
      <div className={css({ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: { base: '8px', md: '16px' } })}>
        <button onClick={toggleLanguage} className={css({
          paddingY: '8px',
          paddingX: '12px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'slate.600',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 'lg',
          _hover: { backgroundColor: 'slate.50' }
        })}>
          {language === 'ar' ? 'English' : 'العربية'}
        </button>
        <Link to="/login" className={css({ 
          display: { base: 'none', sm: 'block' },
          paddingX: '16px', 
          paddingY: '8px', 
          fontSize: '14px', 
          fontWeight: 'bold', 
          color: 'slate.600', 
          textDecoration: 'none',
          transition: 'colors', 
          _hover: { color: 'brand.primary' } 
        })}>{t('login')}</Link>
        <Link to="/login" className={css({ 
          paddingX: { base: '16px', md: '24px' }, 
          paddingY: '10px', 
          fontSize: '14px', 
          fontWeight: 'bold', 
          color: 'white', 
          backgroundColor: 'brand.primary', 
          borderRadius: 'xl', 
          textDecoration: 'none',
          transition: 'all', 
          boxShadow: '0 10px 15px -3px rgba(109, 40, 217, 0.1)',
          _hover: { backgroundColor: 'brand.secondary', transform: 'translateY(-1px)' } 
        })}>
          {t('get_started')}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
