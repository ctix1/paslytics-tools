import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText,
  CheckCircle2,
  BrainCircuit,
  Zap,
  ArrowRight,
  Calculator,
  Megaphone,
  Plus,
  BarChart3,
  Lightbulb,
  Target,
  Rocket
} from 'lucide-react';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const { hasActivePlan } = useSubscription();
  const { profile } = useAuth();

  const isAdmin = profile?.role === 'admin';
  const hasAccess = isAdmin || hasActivePlan;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [pasOutput, setPasOutput] = useState({
    problem: '',
    agitation: '',
    solution: '',
    ai_quick_take: '',
    emotional_score: 88
  });

  const [mmDescription, setMmDescription] = useState('');
  const [pcBase, setPcBase] = useState('');
  const [pcProfit, setPcProfit] = useState('');
  const [pcMarketing, setPcMarketing] = useState('');

  const calcFinalPrice = () => {
    const base = parseFloat(pcBase) || 0;
    const profit = base * ((parseFloat(pcProfit) || 0) / 100);
    const marketing = parseFloat(pcMarketing) || 0;
    return (base + profit + marketing).toFixed(2);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) { clearInterval(interval); return 95; }
        return prev + 5;
      });
    }, 100);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      try {
        const { data, error } = await supabase.functions.invoke('analyze-product', {
          body: { imageBase64: base64Image }
        });
        if (error) throw error;
        setPasOutput({
          problem: data.problem || '',
          agitation: data.agitation || '',
          solution: data.solution || '',
          ai_quick_take: data.ai_quick_take || '',
          emotional_score: data.emotional_score || 88
        });
      } catch (err: any) {
        console.error("AI Analysis Failed:", err);
        setPasOutput({
          problem: t('problem_text'),
          agitation: t('agitation_text'),
          solution: t('solution_text'),
          ai_quick_take: t('quick_take_text'),
          emotional_score: 88
        });
      } finally {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setAnalysisComplete(true);
        }, 500);
      }
    };
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`p-8 max-w-7xl mx-auto min-h-screen ${isRtl ? 'font-arabic' : ''}`}
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-white tracking-tight"
          >
            {t('pas_analysis_title')}
          </motion.h1>
          <p className="text-slate-400 text-lg">
            {isRtl ? 'حول ميزات منتجك إلى فوائد عاطفية مقنعة.' : 'Transform product features into emotional impact.'}
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
            <FileText className="w-5 h-5 text-purple-400" />
            {t('export_report')}
          </button>
          <button className="btn-premium flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {t('run_new_analysis')}
          </button>
        </div>
      </header>

      {!hasAccess ? (
        <motion.div 
          className="glass-panel p-16 text-center shadow-2xl relative overflow-hidden group"
          whileHover={{ scale: 1.01 }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-500" />
          <Zap className="w-16 h-16 text-amber-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-black text-white mb-4">{t('premium_access_required')}</h2>
          <p className="text-slate-400 text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            {t('premium_access_desc')}
          </p>
          <Link to="/plan" className="btn-premium inline-flex items-center gap-3 no-underline">
            {t('explore_plans_here')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-12">
          {/* Bento Upload Section */}
          <section className={`
            glass-panel p-10 border-2 border-dashed transition-all duration-500
            ${isUploading ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 hover:border-purple-500/50'}
          `}>
            <input 
              type="file" 
              id="dashboard-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleUpload}
            />
            
            <AnimatePresence mode="wait">
              {!isUploading && !analysisComplete && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => document.getElementById('dashboard-upload')?.click()} 
                  className="cursor-pointer group/upload"
                >
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover/upload:scale-110 group-hover/upload:bg-purple-500/30 transition-all">
                    <Upload className="text-purple-400 w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">{t('upload_title')}</h2>
                  <p className="text-slate-400 mb-8">{t('upload_desc')}</p>
                  <span className="px-8 py-3 bg-white text-slate-950 font-black rounded-xl hover:bg-purple-50 transition-colors">
                    {t('select_files')}
                  </span>
                </motion.div>
              )}

              {isUploading && (
                <motion.div 
                  key="uploading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="max-w-md mx-auto"
                >
                  <div className="flex justify-between mb-4">
                    <span className="font-black text-purple-400">{isRtl ? 'جاري التحليل...' : 'Analyzing Neural Patterns...'}</span>
                    <span className="font-mono text-white">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </motion.div>
              )}

              {analysisComplete && (
                <motion.div 
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-green-400 w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-green-400 mb-2">{t('analysis_complete')}</h2>
                  <button 
                    onClick={() => setAnalysisComplete(false)}
                    className="mt-4 text-slate-400 hover:text-white font-bold transition-colors"
                  >
                    {t('analyze_another')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Main Bento Grid */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 transition-opacity duration-700 ${analysisComplete ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            
            {/* Framework Bento Box (Full width) */}
            <div className="lg:col-span-12 glass-panel p-10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50" />
              <div className="flex items-center gap-4 mb-10">
                <BrainCircuit className="text-purple-400 w-8 h-8" />
                <h2 className="text-2xl font-black text-white">{t('pas_output')}</h2>
                <div className="ml-auto flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-purple-500/30">
                  <Rocket className="w-3.5 h-3.5" />
                  AI Precision
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card bg-red-500/5 border-red-500/20 p-8 group/card">
                  <div className="text-red-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {t('problem')}
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {pasOutput.problem || t('problem_text')}
                  </p>
                </div>

                <div className="premium-card bg-orange-500/5 border-orange-500/20 p-8 group/card">
                  <div className="text-orange-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Zap className="w-4 h-4" />
                    {t('agitation')}
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {pasOutput.agitation || t('agitation_text')}
                  </p>
                </div>

                <div className="premium-card bg-green-500/5 border-green-500/20 p-8 group/card">
                  <div className="text-green-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('solution')}
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {pasOutput.solution || t('solution_text')}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Take (Span 4) */}
            <div className="lg:col-span-4 glass-panel p-8 flex flex-col justify-between overflow-hidden bg-slate-950/40 relative group">
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-500/20 blur-3xl rounded-full" />
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-6">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  {t('ai_quick_take')}
                </div>
                <p className="text-white text-lg font-medium leading-relaxed italic relative z-10">
                  "{pasOutput.ai_quick_take || t('quick_take_text')}"
                </p>
              </div>
            </div>

            {/* Resonance Score (Span 4) */}
            <div className="lg:col-span-4 glass-panel p-8 bg-gradient-to-br from-white/5 to-white/[0.02]">
              <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-8">{t('emotional_resonance')}</div>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-6xl font-black text-white leading-none">{pasOutput.emotional_score}</span>
                <span className="text-2xl font-black text-purple-400 mb-1">%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${pasOutput.emotional_score}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                />
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                {isRtl ? 'تحليل استجابات القشرة الجبهية المستهدفة.' : 'Targeting prefrontal cortex emotional triggers.'}
              </p>
            </div>

            {/* Price Insights (Span 4) */}
            <div className="lg:col-span-4 glass-panel p-8 bg-brand-primary group overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -rotate-45 translate-x-12 -translate-y-12" />
               <BarChart3 className="text-white w-10 h-10 mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-black text-white mb-2">Price Optimization</h3>
               <p className="text-purple-200 text-sm mb-6">Unlock competitive edge through AI-driven cost structures.</p>
               <button className="px-4 py-2 bg-white text-purple-900 text-xs font-black rounded-lg group-hover:translate-x-1 transition-transform">
                 SYSTEM SYNC
               </button>
            </div>

            {/* Marketing Manager Widget (Span 7) */}
            <div className="lg:col-span-7 glass-panel p-8">
               <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                   <Megaphone className="text-amber-400 w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-black text-white">{t('mm_title')}</h3>
               </div>
               
               <div className="space-y-6">
                 <textarea 
                   value={mmDescription}
                   onChange={(e) => setMmDescription(e.target.value)}
                   placeholder={t('mm_product_placeholder')}
                   className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm focus:border-purple-500/50 outline-none transition-all placeholder:text-slate-600 font-medium"
                 />
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('gender_target')}</div>
                      <div className="text-white font-bold">50/50 Optimized</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('age_target')}</div>
                      <div className="text-white font-bold">18-35 Viral Tier</div>
                    </div>
                 </div>
                 <button className="btn-premium w-full !rounded-2xl py-4 flex items-center justify-center gap-2 group">
                   {t('mm_generate')}
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>
            </div>

            {/* Calculator Widget (Span 5) */}
            <div className="lg:col-span-5 glass-panel p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-10">
                 <Calculator className="w-24 h-24 text-white" />
               </div>
               <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Calculator className="text-blue-400 w-5 h-5" />
                 </div>
                 {t('pc_title')}
               </h3>
               
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('pc_base_cost')}</label>
                   <input 
                     type="number" value={pcBase} onChange={(e) => setPcBase(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all font-mono"
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('pc_profit_margin')}</label>
                      <input 
                        type="number" value={pcProfit} onChange={(e) => setPcProfit(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('marketing')}</label>
                      <input 
                        type="number" value={pcMarketing} onChange={(e) => setPcMarketing(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all font-mono"
                      />
                    </div>
                 </div>
                 <div className="mt-8 pt-6 border-t border-white/5">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('pc_final_price')}</div>
                   <div className="text-4xl font-black text-white tracking-tighter">${calcFinalPrice()}</div>
                 </div>
               </div>
            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
