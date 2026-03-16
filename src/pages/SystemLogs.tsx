import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  FileDown, 
  Trash2, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

type LogStatus = 'completed' | 'processing' | 'failed';

interface LogEntry {
  id: string;
  name: string;
  sku: string;
  image: string;
  date: string;
  score: number | null;
  status: LogStatus;
}

const initialLogs: LogEntry[] = [
  { id: '1', name: 'Ergonomic Office Chair', sku: 'SKU-88291', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=60&q=80', date: 'Oct 24, 2023 14:22', score: 84, status: 'completed' },
  { id: '2', name: 'Minimalist Desk Lamp', sku: 'SKU-44023', image: 'https://images.unsplash.com/photo-1543922596-b3bbaba80649?auto=format&fit=crop&w=60&q=80', date: 'Oct 23, 2023 09:15', score: 62, status: 'completed' },
  { id: '3', name: 'Mechanical Keyboard v2', sku: 'SKU-99012', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=60&q=80', date: 'Oct 23, 2023 08:00', score: null, status: 'processing' },
  { id: '4', name: 'Noise-Cancelling Headphones', sku: 'SKU-11203', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=60&q=80', date: 'Oct 22, 2023 17:44', score: 91, status: 'completed' },
  { id: '5', name: 'Portable Standing Desk', sku: 'SKU-55678', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=60&q=80', date: 'Oct 21, 2023 11:10', score: null, status: 'processing' },
];

const SystemLogs = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [search, setSearch] = useState('');

  const handleDelete = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`max-w-7xl mx-auto space-y-8 ${isRtl ? 'font-arabic' : ''}`}
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">{t('analysis_logs')}</h1>
          <p className="text-slate-400 font-medium">{t('logs_desc')}</p>
        </div>
        <button 
          onClick={() => alert('Starting new analysis...')}
          className="btn-premium flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {t('new_analysis')}
        </button>
      </div>

      {/* Control Bar */}
      <div className="glass-panel p-4 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full lg:w-auto">
          <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500`} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-white focus:border-brand-primary/50 outline-none transition-all placeholder:text-slate-600 font-medium text-sm`}
            placeholder={t('search_products')} 
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-40">
            <Filter className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none`} />
            <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm font-bold appearance-none outline-none focus:border-brand-primary/50 transition-all cursor-pointer">
              <option value="all">{t('status_all')}</option>
              <option value="completed">{t('completed')}</option>
              <option value="processing">{t('processing')}</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button className="p-3 glass-panel hover:bg-white/10 text-slate-400 hover:text-white transition-all">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-3 glass-panel hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all">
              <FileDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className={`p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest ${isRtl ? 'text-right' : 'text-left'}`}>{t('product')}</th>
                <th className={`p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest ${isRtl ? 'text-right' : 'text-left'}`}>{t('date_analyzed')}</th>
                <th className={`p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest ${isRtl ? 'text-right' : 'text-left'}`}>{t('pas_score')}</th>
                <th className={`p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest ${isRtl ? 'text-right' : 'text-left'}`}>{t('status')}</th>
                <th className={`p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest ${isRtl ? 'text-left' : 'text-right'}`}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {logs.length === 0 ? (
                  <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={5} className="p-20 text-center text-slate-500 font-medium">No system logs found.</td>
                  </motion.tr>
                ) : (
                  logs.filter(log => log.name.toLowerCase().includes(search.toLowerCase())).map((log) => (
                    <motion.tr 
                      key={log.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      variants={itemVariants}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden bg-slate-900 flex-shrink-0">
                            <img src={log.image} alt={log.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-sm font-black text-white truncate">{log.name}</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                          <Calendar className="w-3.5 h-3.5 opacity-50" />
                          {log.date}
                        </div>
                      </td>
                      <td className="p-6">
                        {log.score !== null ? (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono font-black text-xs text-white">
                              {log.score}
                            </div>
                            <div className="flex-1 max-w-[100px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${log.score}%` }}
                                className={`h-full ${log.score > 70 ? 'bg-green-500' : 'bg-amber-500'}`}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-600 font-mono">-</div>
                        )}
                      </td>
                      <td className="p-6">
                        <div className={`
                          inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                          ${log.status === 'completed' 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                            : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'}
                        `}>
                          <div className={`w-1 h-1 rounded-full ${log.status === 'completed' ? 'bg-green-400' : 'bg-brand-primary animate-pulse'}`} />
                          {log.status === 'completed' ? t('completed') : t('processing')}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className={`flex items-center gap-2 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                          {log.status === 'completed' ? (
                            <Link to={`/report/${log.id}`} className="p-2 glass-panel hover:bg-brand-primary/20 text-slate-400 hover:text-brand-primary transition-all rounded-lg no-underline">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          ) : (
                            <button className="p-2 glass-panel hover:bg-white/10 text-slate-600 transition-all rounded-lg border-none bg-transparent cursor-not-allowed">
                              <Layers className="w-4 h-4 opacity-30" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(log.id)}
                            className="p-2 glass-panel hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all rounded-lg border-none bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
            {isRtl ? 'عرض' : 'Showing'} 1 - {logs.length} {isRtl ? 'من' : 'of'} {logs.length}
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 glass-panel hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white">
              <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex gap-1">
              {[1, 2].map(page => (
                <button 
                  key={page}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black transition-all ${page === 1 ? 'bg-brand-primary text-white shadow-[0_0_15px_rgba(109,40,217,0.4)]' : 'glass-panel text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="p-2 glass-panel hover:bg-white/10 text-white">
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <footer className="pt-12 pb-6 text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} PASLYTICS NEURAL ENGINE. {t('all_rights_reserved')}
      </footer>
    </motion.div>
  );
};

export default SystemLogs;
