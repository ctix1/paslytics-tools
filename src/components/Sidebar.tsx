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
import { cn } from '../utils/cn';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ClipboardList, label: 'Logs', path: '/logs' },
    { icon: Users, label: 'Management', path: '/management' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen flex flex-col sticky top-0 overflow-hidden shrink-0">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
          <LayoutDashboard className="text-white w-5 h-5" />
        </div>
        <span className="text-2xl font-black text-slate-900 tracking-tight">PASlytics</span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => (
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

      <div className="p-6 border-t border-slate-50 space-y-1">
        <button
          onClick={() => alert('Opening Support Ticket...')}
          className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all w-full"
        >
          <HelpCircle className="w-5 h-5 text-slate-400" />
          Support
        </button>
        <Link
          to="/login"
          className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Link>
      </div>

      <div className="p-5 bg-slate-50/50 mx-4 mb-8 rounded-[2rem] flex items-center gap-3 border border-slate-100">
        <div className="w-12 h-12 rounded-[1rem] bg-violet-100 border border-white flex items-center justify-center text-violet-700 font-bold overflow-hidden shadow-sm">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="User" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-black text-slate-900 truncate">Alex Thompson</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">Admin Account</p>
        </div>
        <Bell onClick={() => alert('Opening Notifications...')} className="w-4 h-4 text-slate-400 hover:text-violet-600 cursor-pointer transition-colors" />
      </div>
    </aside>
  );
};

export default Sidebar;
