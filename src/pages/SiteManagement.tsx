import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Users, 
  UserPlus, 
  Shield, 
  Clock, 
  MoreVertical, 
  Search, 
  Mail, 
  ShieldCheck, 
  ShieldAlert,
  Settings2,
  Trash2,
  Sparkles
} from 'lucide-react';

type UserRole = 'Admin' | 'Analyst' | 'Informed Member';

interface User {
  id: string;
  name: string;
  email: string;
  avatarSeed: string;
  avatarColor: string;
  role: UserRole;
}

const initialUsers: User[] = [
  { id: '1', name: 'Jane Doe', email: 'jane.doe@example.com', avatarSeed: 'Jane', avatarColor: 'cbd5e1', role: 'Admin' },
  { id: '2', name: 'Mark Smith', email: 'm.smith@product-tool.io', avatarSeed: 'Mark', avatarColor: 'e2e8f0', role: 'Analyst' },
  { id: '3', name: 'Alice Lundberg', email: 'alice.l@example.com', avatarSeed: 'Alice', avatarColor: 'f1f5f9', role: 'Informed Member' },
];

const SiteManagement = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');

  const handleRemoveUser = (id: string) => {
    const userToRemove = users.find(u => u.id === id);
    if (!userToRemove) return;
    if (window.confirm(`Are you sure you want to remove ${userToRemove.name} from the team?`)) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  const stats = [
    { label: t('total_users'), value: users.length + 21, icon: <Users className="w-5 h-5" />, color: 'bg-indigo-500/20 text-indigo-400' },
    { label: t('active_analysts'), value: 12, icon: <ShieldCheck className="w-5 h-5" />, color: 'bg-emerald-500/20 text-emerald-400' },
    { label: t('pending_invites'), value: 3, icon: <Clock className="w-5 h-5" />, color: 'bg-amber-500/20 text-amber-400' },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`max-w-7xl mx-auto space-y-8 ${isRtl ? 'font-arabic' : ''}`}
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">{t('user_management')}</h1>
          <p className="text-slate-400 font-medium">{t('manage_team')}</p>
        </div>
        <button 
          onClick={() => alert('Add User Dialog Opened')}
          className="btn-premium flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          {t('add_user')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="glass-panel p-8 group relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 blur-3xl rounded-full" />
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <Sparkles className="w-4 h-4 text-white/10" />
            </div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* User Table Card */}
      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-80">
             <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500`} />
             <input 
               type="text" 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-white focus:border-brand-primary/50 outline-none transition-all placeholder:text-slate-600 font-medium text-xs`}
               placeholder={t('search_products')} 
             />
           </div>
           <div className="flex gap-2">
             <button className="p-3 glass-panel hover:bg-white/10 text-slate-400 transition-all">
               <Settings2 className="w-4 h-4" />
             </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className={`p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest ${isRtl ? 'text-right' : 'text-left'}`}>{t('name')}</th>
                <th className={`p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest ${isRtl ? 'text-right' : 'text-left'}`}>{t('email')}</th>
                <th className={`p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest ${isRtl ? 'text-right' : 'text-left'}`}>{t('permissions')}</th>
                <th className={`p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest ${isRtl ? 'text-left' : 'text-right'}`}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map((user) => (
                  <motion.tr 
                    key={user.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex-shrink-0">
                          <img 
                            src={`https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${user.avatarSeed}&backgroundColor=${user.avatarColor}`} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-sm font-black text-white">{user.name}</div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                        <Mail className="w-3.5 h-3.5 opacity-50" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="relative w-40">
                         <Shield className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-primary pointer-events-none`} />
                         <select
                           className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:border-brand-primary/50 transition-all cursor-pointer"
                           value={user.role}
                           onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                         >
                           <option value="Admin">{t('admin_role')}</option>
                           <option value="Analyst">{t('analyst_role')}</option>
                           <option value="Informed Member">{t('informed_member')}</option>
                         </select>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className={`flex items-center gap-2 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                        <button 
                          onClick={() => handleRemoveUser(user.id)}
                          className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                          {t('remove')}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-6 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
             {isRtl ? 'عرض' : 'Showing'} 1 - {users.length} {isRtl ? 'من' : 'of'} {users.length + 21}
           </p>
           <div className="flex gap-2">
             <button className="px-5 py-2 glass-panel hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all">Previous</button>
             <button className="px-5 py-2 glass-panel hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all">Next</button>
           </div>
        </div>
      </div>

      <footer className="pt-12 pb-6 text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} PASLYTICS NEURAL IDENTITY. {t('all_rights_reserved')}
      </footer>
    </motion.div>
  );
};

export default SiteManagement;
