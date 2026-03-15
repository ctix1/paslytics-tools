import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  ClipboardList, 
  Users, 
  LogOut, 
  HelpCircle,
  Bell,
  CreditCard,
  FileText
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../lib/supabase';

const Sidebar = () => {
  const location = useLocation();
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';

  const [userProfile, setUserProfile] = useState<any>(null);
  const isAdmin = userProfile?.role === 'admin';

  useEffect(() => {
    // 1. Sync from localStorage
    const profileRaw = localStorage.getItem('user_profile');
    if (profileRaw && profileRaw !== 'undefined') {
      setUserProfile(JSON.parse(profileRaw));
    }

    // 2. Sync from Supabase
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

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' },
    { icon: ClipboardList, label: t('logs'), path: '/logs' },
    { icon: Users, label: t('admin'), path: '/management', adminOnly: true },
    { icon: CreditCard, label: t('paysettings_nav'), path: '/admin/payment-settings', adminOnly: true },
    { icon: FileText, label: t('content_manager_nav'), path: '/admin/content', adminOnly: true },
    { icon: Settings, label: t('settings'), path: '/settings' },
  ];

  return (
    <aside className={cn(
      "w-64 bg-white border-r border-slate-100 h-screen flex flex-col sticky top-0 overflow-hidden shrink-0",
      isRtl && "border-l border-r-0"
    )} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">{t('app_name')}</span>
        </div>
        <button onClick={toggleLanguage} className="text-[10px] font-bold px-2 py-1 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          {language.toUpperCase()}
        </button>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems
          .filter(item => !item.adminOnly || isAdmin)
          .map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all group",
                location.pathname === item.path 
                  ? "bg-violet-600 text-white shadow-xl shadow-violet-100 translate-x-1" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                location.pathname === item.path ? "text-white" : "text-slate-400 group-hover:text-slate-600"
              )} />
              {item.label}
            </Link>
          ))}
      </nav>

      <div className="p-6 border-t border-slate-50 space-y-4">
        {userProfile && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-violet-100 border border-white flex items-center justify-center text-violet-700 font-bold overflow-hidden shadow-sm">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black text-slate-900 truncate">{userProfile.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                {isAdmin ? 'Admin Account' : 'Regular Member'}
              </p>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          <button
            onClick={() => alert('Opening Support Ticket...')}
            className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all w-full"
          >
            <HelpCircle className="w-5 h-5 text-slate-400" />
            {t('support') || 'Support'}
          </button>
          <Link
            to="/logout"
            className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {t('logout')}
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
