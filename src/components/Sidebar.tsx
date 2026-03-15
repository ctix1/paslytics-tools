import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  ClipboardList, 
  Users, 
  LogOut, 
  CreditCard,
  FileText
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../lib/supabase';

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';

  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Sync profile from session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile = {
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          role: session.user.email?.toLowerCase() === 'koo111333@gmail.com' ? 'admin' : (session.user.user_metadata?.role || 'user')
        };
        setUserProfile(profile);
        localStorage.setItem('user_profile', JSON.stringify(profile));
      }
    });
  }, []);

  const isAdmin = userProfile?.role === 'admin';

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' },
    { icon: ClipboardList, label: t('logs'), path: '/logs' },
    { icon: Users, label: t('admin'), path: '/management', adminOnly: true },
    { icon: CreditCard, label: t('paysettings_nav'), path: '/admin/payment-settings', adminOnly: true },
    { icon: FileText, label: t('content_manager_nav'), path: '/admin/content', adminOnly: true },
  ];

  return (
    <aside className={cn(
      "w-full bg-white h-screen flex flex-col overflow-hidden shrink-0 border-r border-slate-100 shadow-2xl shadow-slate-200/50",
      isRtl && "border-l border-r-0"
    )}>
      {/* Brand Section */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-200">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter block leading-none">{t('app_name')}</span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1 block">Analytics Engine</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems
          .filter(item => !item.adminOnly || isAdmin)
          .map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-black transition-all group relative overflow-hidden",
                location.pathname === item.path 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors relative z-10",
                location.pathname === item.path ? "text-violet-400" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className="relative z-10">{item.label}</span>
              {location.pathname === item.path && (
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-transparent opacity-50"></div>
              )}
            </Link>
          ))}
      </nav>

      {/* Bottom Section: Settings & Utils */}
      <div className="p-6 mt-auto border-t border-slate-50 space-y-2">
        <Link
          to="/settings"
          onClick={onClose}
          className={cn(
            "flex items-center gap-4 px-5 py-3.5 rounded-xl text-sm font-black transition-all group",
            location.pathname === '/settings' 
              ? "bg-violet-50 text-violet-700" 
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Settings className={cn(
            "w-5 h-5 transition-colors",
            location.pathname === '/settings' ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600"
          )} />
          {t('settings')}
        </Link>

        {/* Language & Profile */}
        <div className="grid grid-cols-2 gap-2 mt-4">
           <button 
              onClick={toggleLanguage} 
              className="flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-violet-200 transition-all group"
           >
              <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-violet-600">
                {language === 'en' ? 'AR' : 'EN'}
              </span>
           </button>
           <Link 
              to="/logout"
              className="flex items-center justify-center py-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-red-50 hover:border-red-100 group transition-all"
           >
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
           </Link>
        </div>

        {/* User Mini Profile */}
        {userProfile && (
          <div className="mt-6 flex items-center gap-4 p-4 bg-slate-900 rounded-[1.5rem] shadow-xl shadow-slate-200">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black shrink-0">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black text-white truncate">{userProfile.name}</p>
              <p className="text-[9px] font-black text-violet-400 uppercase tracking-[0.15em] truncate">
                {isAdmin ? 'Administrator' : 'Premium Member'}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
