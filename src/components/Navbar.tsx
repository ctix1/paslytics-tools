import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { css } from '../../styled-system/css';

const Navbar = () => {
  return (
    <nav className={css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingX: '32px',
      paddingY: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropBlur: 'md',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid',
      borderColor: 'slate.100'
    })}>
      <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
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
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: 'slate.900', 
          tracking: 'tight' 
        })}>PASlytics</span>
      </div>
      
      <div className={css({ 
        display: { base: 'none', md: 'flex' }, 
        alignItems: 'center', 
        gap: '32px', 
        fontSize: '14px', 
        fontWeight: 'bold', 
        color: 'slate.500', 
        textTransform: 'uppercase', 
        tracking: 'wider' 
      })}>
        <Link to="/" className={css({ transition: 'colors', _hover: { color: 'brand.primary' } })}>Pricing</Link>
        <Link to="/" className={css({ transition: 'colors', _hover: { color: 'brand.primary' } })}>About</Link>
      </div>

      <div className={css({ display: 'flex', alignItems: 'center', gap: '16px' })}>
        <Link to="/login" className={css({ 
          paddingX: '20px', 
          paddingY: '8px', 
          fontSize: '14px', 
          fontWeight: 'bold', 
          color: 'slate.600', 
          textDecoration: 'none',
          transition: 'colors', 
          _hover: { color: 'brand.primary' } 
        })}>Log in</Link>
        <Link to="/login" className={css({ 
          paddingX: '24px', 
          paddingY: '10px', 
          fontSize: '14px', 
          fontWeight: 'bold', 
          color: 'white', 
          backgroundColor: 'brand.primary', 
          borderRadius: 'xl', 
          textDecoration: 'none',
          transition: 'all', 
          boxShadow: '0 10px 15px -3px rgba(109, 40, 217, 0.1)',
          _hover: { backgroundColor: 'brand.secondary' } 
        })}>
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
