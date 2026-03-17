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
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface LogEntry {
  id: string;
  name: string;
  sku: string;
  image: string;
  date: string;
  score: number | null;
  type: 'PAS' | 'Marketing' | 'Calculator';
}

const initialLogs: LogEntry[] = [
  { id: '1', name: 'Ergonomic Office Chair', sku: 'SKU-88291', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=60&q=80', date: 'Oct 24, 2023 14:22', score: 84, type: 'PAS' },
  { id: '2', name: 'Summer Campaign Plan', sku: 'MKT-44023', image: 'https://images.unsplash.com/photo-1543922596-b3bbaba80649?auto=format&fit=crop&w=60&q=80', date: 'Oct 23, 2023 09:15', score: null, type: 'Marketing' },
  { id: '3', name: 'Product Calculator v2', sku: 'CALC-99012', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=60&q=80', date: 'Oct 23, 2023 08:00', score: null, type: 'Calculator' },
];

const SystemLogs = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [search, setSearch] = useState('');

  const handleDelete = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  const handleDownload = (name: string) => {
    // Premium UI Feedback
    const toast = document.createElement('div');
    toast.className = `fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} glass-panel px-6 py-4 border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-black uppercase tracking-widest text-xs z-50 animate-bounce flex items-center gap-3`;
    toast.innerHTML = `<CheckCircle2 class="w-4 h-4" /> ${isRtl ? 'جاري تحضير ملف PDF...' : 'Preparing PDF Report...'}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
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
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Layers className="text-purple-400 w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            {t('records_title')}
          </h1>
        </div>
        <p className="text-slate-400 text-lg">
          {isRtl ? 'استعراض وتحميل جميع التقارير التي قمت بإنشائها مسبقاً.' : 'Review and download all the reports you have previously generated.'}
        </p>
      </header>

      <div className="glass-panel p-4 flex flex-col lg:flex-row gap-4 items-center bg-slate-900/50">
        <div className="relative flex-1 w-full lg:w-auto">
          <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500`} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-white/5 border border-white/10 rounded-xl py-4 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-white focus:border-brand-primary/50 outline-none transition-all placeholder:text-slate-600 font-bold text-sm`}
            placeholder={t('search_products')} 
          />
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4" />
            {isRtl ? 'تصفية' : 'Filter'}
          </button>
          <button className="btn-premium flex items-center gap-2 px-8 py-4">
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
              className="glass-panel p-8 group hover:border-purple-500/50 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={`
                  px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]
                  ${log.type === 'PAS' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    log.type === 'Marketing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'}
                `}>
                  {log.type} {isRtl ? 'تقرير' : 'Report'}
                </div>
                <button 
                  onClick={() => handleDelete(log.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors bg-white/5 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-20 h-20 rounded-2xl border border-white/10 overflow-hidden bg-slate-950 flex-shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <img src={log.image} alt={log.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-white font-black text-xl truncate mb-2">{log.name}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    {log.date}
                  </div>
                </div>
              </div>

              {log.score && (
                <div className="mb-8 p-5 bg-white/[0.03] rounded-2xl border border-white/5 relative z-10">
                  <div className="flex items-center justify-between mb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>PAS Resonance</span>
                    <span className="text-white font-mono">{log.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${log.score}%` }}
                      className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <button 
                  onClick={() => {
                    const toast = document.createElement('div');
                    toast.className = `fixed top-8 ${isRtl ? 'right-8' : 'left-8'} glass-panel px-6 py-4 border-purple-500/50 bg-purple-500/10 text-purple-400 font-black uppercase tracking-widest text-xs z-50 animate-slideDown flex items-center gap-3`;
                    toast.innerHTML = `<ExternalLink class="w-4 h-4" /> ${isRtl ? 'فتح التقرير التفصيلي...' : 'Opening Detailed Report...'}`;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 2500);
                  }}
                  className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-purple-500/20 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t('view_report')}
                </button>
                <button 
                  onClick={() => handleDownload(log.name)}
                  className="flex items-center justify-center gap-2 py-4 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-50 transition-all shadow-[0_5px_15px_rgba(255,255,255,0.1)]"
                >
                  <FileDown className="w-3.5 h-4" />
                  {t('download_pdf')}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {logs.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <FileText className="w-20 h-20 text-slate-800 mx-auto mb-6 opacity-20" />
            <p className="text-slate-500 font-black uppercase tracking-[0.2em]">{t('no_records')}</p>
          </div>
        )}
      </div>

      <footer className="pt-20 pb-10 text-center text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] opacity-40">
        © {new Date().getFullYear()} PASLYTICS NEURAL ENGINE. {t('all_rights_reserved')}
      </footer>
    </motion.div>
  );
};

export default SystemLogs;
