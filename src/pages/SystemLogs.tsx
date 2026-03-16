import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  FileDown, 
  Trash2, 
  Calendar,
  Layers,
  FileText,
  Eye
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
  type: 'PAS' | 'Marketing' | 'Calculator';
}

const initialLogs: LogEntry[] = [
  { id: '1', name: 'Ergonomic Office Chair', sku: 'SKU-88291', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=60&q=80', date: 'Oct 24, 2023 14:22', score: 84, status: 'completed', type: 'PAS' },
  { id: '2', name: 'Summer Campaign Plan', sku: 'MKT-44023', image: 'https://images.unsplash.com/photo-1543922596-b3bbaba80649?auto=format&fit=crop&w=60&q=80', date: 'Oct 23, 2023 09:15', score: null, status: 'completed', type: 'Marketing' },
  { id: '3', name: 'Product Calculator v2', sku: 'CALC-99012', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=60&q=80', date: 'Oct 23, 2023 08:00', score: null, status: 'processing', type: 'Calculator' },
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

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`max-w-7xl mx-auto space-y-8 ${isRtl ? 'font-arabic' : ''}`}
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
            <Layers className="text-purple-400 w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            {t('records_title')}
          </h1>
        </div>
        <p className="text-slate-400 text-lg">
          {isRtl ? 'استعراض وتحميل جميع التقارير التي قمت بإنشائها مسبقاً.' : 'Review and download all the reports you have previously generated.'}
        </p>
      </header>

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
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4" />
            {isRtl ? 'تصفية' : 'Filter'}
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" />
            {isRtl ? 'تصدير الكل' : 'Export All'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {logs.filter(log => log.name.toLowerCase().includes(search.toLowerCase())).map((log) => (
            <motion.div
              key={log.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel p-6 group hover:border-brand-primary/50 transition-all relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`
                  px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                  ${log.type === 'PAS' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    log.type === 'Marketing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'}
                `}>
                  {log.type} Report
                </div>
                <button 
                  onClick={() => handleDelete(log.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl border border-white/10 overflow-hidden bg-slate-900 flex-shrink-0">
                  <img src={log.image} alt={log.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-white font-black text-lg truncate mb-1">{log.name}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <Calendar className="w-3 h-3" />
                    {log.date}
                  </div>
                </div>
              </div>

              {log.score && (
                <div className="mb-6 p-4 bg-white/5 rounded-2xl flex items-center justify-between border border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PAS Resonance</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono font-black">{log.score}%</span>
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${log.score}%` }} />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-brand-primary transition-all">
                  <Eye className="w-3 h-4" />
                  {t('view_report')}
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-white text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-50 transition-all">
                  <FileDown className="w-3 h-4" />
                  {t('download_pdf')}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {logs.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <FileText className="w-16 h-16 text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">{t('no_records')}</p>
          </div>
        )}
      </div>

      <footer className="pt-12 pb-6 text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} PASLYTICS NEURAL ENGINE. {t('all_rights_reserved')}
      </footer>
    </motion.div>
  );
};

export default SystemLogs;
