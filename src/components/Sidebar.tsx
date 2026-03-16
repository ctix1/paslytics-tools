import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Home,
  LayoutDashboard, 
  Settings, 
  ClipboardList, 
  Users, 
  LogOut, 
  HelpCircle,
  Bell,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { t } = useLanguage();
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: t('home'), path: '/' },
    { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' },
    { icon: ClipboardList, label: t('logs'), path: '/logs' },
    { icon: Users, label: t('user_management'), path: '/management' },
    { icon: Settings, label: t('profile_settings'), path: '/settings' },
  ];

  const userInitial = profile?.name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || '?';

  return (
    <aside className="w-72 h-screen sticky top-0 flex flex-col p-6 z-40">
      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative group">
        {/* Animated Glow Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-colors duration-700" />
        
        <Link to="/" className="p-8 flex items-center gap-4 no-underline relative z-10">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(109,40,217,0.4)]"
          >
            <Sparkles className="text-white w-5 h-5" />
          </motion.div>
          <span className="text-xl font-black text-white tracking-tighter">
            PAS<span className="text-purple-400">lytics</span>
          </span>
        </Link>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 relative z-10">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className="relative group no-underline"
              >
                <div className={`
                  flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold transition-all duration-300 relative z-10
                  ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}
                `}>
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-purple-400'}`} />
                  {item.label}
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-brand-primary/20 border border-brand-primary/50 rounded-xl z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto flex flex-col gap-2 border-t border-white/5 relative z-10">
          <button
            onClick={() => alert('Opening Support Ticket...')}
            className="flex items-center gap-3 px-5 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all w-full cursor-pointer border-none bg-transparent"
          >
            <HelpCircle className="w-4 h-4" />
            {t('contact')}
          </button>
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-5 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/20 transition-all w-full cursor-pointer border-none bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mb-8 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 group/user hover:bg-white/10 transition-all cursor-pointer relative z-10">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span className="text-base">{userInitial}</span>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate m-0">
              {profile?.name || 'User'}
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate m-0">
              {profile?.role === 'admin' ? t('admin_account') : t('standard_account')}
            </p>
          </div>
          <Bell className="w-4 h-4 text-slate-500 group-hover/user:text-purple-400 transition-colors" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
