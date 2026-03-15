import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  ClipboardList, 
  Users, 
  LogOut, 
  HelpCircle,
  Bell
} from 'lucide-react';
import { css, cx } from '../../styled-system/css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ClipboardList, label: 'Logs', path: '/logs' },
    { icon: Users, label: 'Management', path: '/management' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={css({
      width: '256px',
      backgroundColor: 'white',
      borderRight: '1px solid',
      borderColor: 'slate.100',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      overflow: 'hidden',
      flexShrink: 0
    })}>
      <div className={css({ 
        padding: '32px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
      })}>
        <div className={css({ 
          width: '40px', 
          height: '40px', 
          backgroundColor: 'brand.primary', 
          borderRadius: '2xl', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          boxShadow: '0 10px 15px -3px rgba(109, 40, 217, 0.2)' 
        })}>
          <LayoutDashboard className={css({ color: 'white', width: '20px', height: '20px' })} />
        </div>
        <span className={css({ 
          fontSize: '24px', 
          fontWeight: 'black', 
          color: 'slate.900', 
          tracking: 'tight' 
        })}>PASlytics</span>
      </div>

      <nav className={css({ 
        flex: 1, 
        paddingX: '16px', 
        paddingY: '32px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px' 
      })}>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={cx(
              css({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingX: '20px',
                paddingY: '16px',
                borderRadius: '2xl',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all',
                color: 'slate.500',
                _hover: { backgroundColor: 'slate.50', color: 'slate.900' }
              }),
              location.pathname === item.path && css({
                backgroundColor: 'brand.primary',
                color: 'white',
                boxShadow: '0 20px 25px -5px rgba(109, 40, 217, 0.1)',
                transform: 'translateX(4px)',
                _hover: { backgroundColor: 'brand.secondary', color: 'white' }
              })
            )}
          >
            <item.icon className={css({
              width: '20px',
              height: '20px',
              transition: 'colors',
              color: location.pathname === item.path ? 'white' : 'slate.400'
            })} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={css({ 
        padding: '24px', 
        borderTop: '1px solid', 
        borderColor: 'slate.50', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px' 
      })}>
        <button
          onClick={() => alert('Opening Support Ticket...')}
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingX: '20px',
            paddingY: '12px',
            borderRadius: 'xl',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'slate.500',
            width: '100%',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: 'transparent',
            transition: 'all',
            _hover: { backgroundColor: 'slate.50', color: 'slate.900' }
          })}
        >
          <HelpCircle className={css({ width: '20px', height: '20px', color: 'slate.400' })} />
          Support
        </button>
        <Link
          to="/login"
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingX: '20px',
            paddingY: '12px',
            borderRadius: 'xl',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'red.500',
            textDecoration: 'none',
            transition: 'all',
            _hover: { backgroundColor: 'red.50' }
          })}
        >
          <LogOut className={css({ width: '20px', height: '20px' })} />
          Log Out
        </Link>
      </div>

      <div className={css({ 
        padding: '20px', 
        backgroundColor: 'rgba(248, 250, 252, 0.5)', 
        marginX: '16px', 
        marginBottom: '32px', 
        borderRadius: '32px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        border: '1px solid', 
        borderColor: 'slate.100' 
      })}>
        <div className={css({ 
          width: '48px', 
          height: '48px', 
          borderRadius: '16px', 
          backgroundColor: 'violet.100', 
          border: '1px solid white', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'violet.700', 
          fontWeight: 'bold', 
          overflow: 'hidden', 
          boxShadow: 'sm' 
        })}>
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="User" className={css({ width: '100%', height: '100%', objectFit: 'cover' })} />
        </div>
        <div className={css({ flex: 1, overflow: 'hidden' })}>
          <p className={css({ fontSize: '14px', fontWeight: 'black', color: 'slate.900', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })}>Alex Thompson</p>
          <p className={css({ fontSize: '10px', fontWeight: 'bold', color: 'slate.400', textTransform: 'uppercase', tracking: 'widest', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })}>Admin Account</p>
        </div>
        <Bell onClick={() => alert('Opening Notifications...')} className={css({ width: '16px', height: '16px', color: 'slate.400', cursor: 'pointer', transition: 'colors', _hover: { color: 'brand.primary' } })} />
      </div>
    </aside>
  );
};

export default Sidebar;
