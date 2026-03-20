import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useLogs } from '../context/LogContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  FileDown, 
  Trash2, 
  Calendar,
  Layers,
  FileText
} from 'lucide-react';

const SystemLogs = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const { logs, deleteLog } = useLogs();

  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const handleDownload = (log: any) => {
    // Premium UI Feedback
    const toast = document.createElement('div');
    toast.className = `fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} glass-panel px-6 py-4 border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-black uppercase tracking-widest text-xs z-50 animate-bounce flex items-center gap-3`;
    toast.innerHTML = `<CheckCircle2 class="w-4 h-4" /> ${isRtl ? 'جاري تحضير ملف PDF...' : 'Preparing PDF Report...'}`;
    document.body.appendChild(toast);
    
    // Functional Download Simulation (Creating a real blob)
    const content = `PASLYTICS AI REPORT\n\nProduct: ${log.name}\nDate: ${log.date}\nType: ${log.type}\nScore: ${log.score}%\n\n--- AI DATA ---\n${isRtl ? 'تم استخراج البيانات بنجاح.' : 'Data extracted successfully.'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${log.id}.txt`;
    link.click();
    
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
                  onClick={() => deleteLog(log.id)}
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
                  onClick={() => setSelectedLog(log)}
                  className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-purple-500/20 transition-all font-black"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {isRtl ? 'عرض التقرير' : 'View Report'}
                </button>
                <button 
                  onClick={() => handleDownload(log)}
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

      {/* Report View Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel max-w-2xl w-full p-10 border-purple-500/30 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5"><Layers className="w-32 h-32" /></div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center"><FileText className="text-purple-400" /></div>
                   <div>
                      <h2 className="text-2xl font-black text-white uppercase">{selectedLog.name}</h2>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedLog.date} • {selectedLog.type} DATA</p>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all font-black text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl space-y-4">
                    <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Final PAS Outcome</h4>
                    {selectedLog.type === 'PAS' ? (
                      <div className="space-y-4">
                         <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                            <h5 className="text-[9px] font-black text-red-400 uppercase mb-2">{t('problem')}</h5>
                            <p className="text-white text-sm italic">{selectedLog.problem || (isRtl ? 'المنتج يعاني من نقص في البيانات.' : 'Product data missing.')}</p>
                         </div>
                         <div className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/10">
                            <h5 className="text-[9px] font-black text-orange-400 uppercase mb-2">{t('agitation')}</h5>
                            <p className="text-white text-sm italic">{selectedLog.agitation || selectedLog.impact || (isRtl ? 'المنتج يحتاج لتحليل إضافي.' : 'Product needs more analysis.')}</p>
                         </div>
                         <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                            <h5 className="text-[9px] font-black text-green-400 uppercase mb-2">{t('solution')}</h5>
                            <p className="text-white text-sm italic">{selectedLog.solution || (isRtl ? 'المنتج جاهز للانطلاق.' : 'Product ready for launch.')}</p>
                         </div>
                      </div>
                    ) : (
                      <p className="text-white text-lg leading-relaxed italic font-medium">
                         {isRtl ? 'هذا التقرير لا يحتوي على بيانات PAS مدمجة.' : 'This report does not contain embedded PAS data.'}
                      </p>
                    )}
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <button className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-purple-700 transition-all">
                       {isRtl ? 'تحميل البيانات الكاملة' : 'Download Complete Data'}
                    </button>
                    <button className="flex-1 py-4 bg-white/5 border border-white/10 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">
                       {isRtl ? 'طباعة التقرير' : 'Print Report'}
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="pt-20 pb-10 text-center text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] opacity-40">
        © {new Date().getFullYear()} PASLYTICS AI ENGINE. {t('all_rights_reserved')}
      </footer>
    </motion.div>
  );
};

export default SystemLogs;
