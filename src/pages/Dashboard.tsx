import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLogs } from '../context/LogContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, 
  FileText,
  CheckCircle2,
  BrainCircuit,
  Zap,
  ArrowRight,
  Plus,
  Lightbulb,
  Target,
  Rocket
} from 'lucide-react';
import MarketingManager from '../components/MarketingManager';
import ProductCalculator from '../components/ProductCalculator';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const { hasActivePlan } = useSubscription();
  const { profile } = useAuth();
  const { addLog } = useLogs();

  const isAdmin = profile?.role === 'admin';
  const hasAccess = isAdmin || hasActivePlan;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [pasOutput, setPasOutput] = useState({
    problem: '',
    agitation: '',
    solution: '',
    ai_quick_take: '',
    emotional_score: 88,
    product_name: 'New Analysis'
  });

  const handleSaveToLogs = async () => {
    if (!analysisComplete) return;
    const btn = document.getElementById('save-log-btn') as HTMLButtonElement;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="flex items-center gap-2 text-emerald-400"><CheckCircle2 class="w-4 h-4" /> ${isRtl ? 'تم الحفظ' : 'Saved'}</span>`;
    
    // Add real data to logs via context
    addLog({
      name: pasOutput.product_name || (isRtl ? 'تحليل منتج' : 'Product Analysis'),
      sku: `PAS-${Math.floor(Math.random() * 10000)}`,
      image: currentImage || 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=60&q=80',
      score: pasOutput.emotional_score,
      type: 'PAS'
    });

    await new Promise(r => setTimeout(r, 1000));
    
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }, 2000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) { clearInterval(interval); return 95; }
        return prev + 5;
      });
    }, 100);

    const fReader = new FileReader();
    fReader.readAsDataURL(file);
    fReader.onload = async () => {
      const base64Image = fReader.result;
      try {
        // Authoritative Arabic prompt resolution
        const { data, error } = await supabase.functions.invoke('analyze-product', {
          body: { 
            imageBase64: base64Image,
            targetLanguage: isRtl ? 'ar' : 'en',
            language: isRtl ? 'ar' : 'en',
            instruction: isRtl 
              ? "You are a professional neuromarketing analyst. ANALYZE the product and PROVIDE ALL text (problem, agitation, solution, ai_quick_take) in ARABIC language only. Ensure native fluency." 
              : "Analyze in English."
          }
        });
        if (error) throw error;
        
        // Automatic Persistence: Save to logs instantly
        addLog({
          name: data.product_name || file.name.split('.')[0] || (isRtl ? 'تحليل منتج' : 'Product Analysis'),
          sku: `PAS-${Math.floor(Math.random() * 10000)}`,
          image: reader.result as string,
          score: data.emotional_score || 88,
          type: 'PAS'
        });

        setPasOutput({
          problem: data.problem || '',
          agitation: data.agitation || '',
          solution: data.solution || '',
          ai_quick_take: data.ai_quick_take || '',
          emotional_score: data.emotional_score || 88,
          product_name: data.product_name || file.name.split('.')[0]
        });

      } catch (err: any) {
        console.error("AI Analysis Failed:", err);
        // Fallback for demo/error
        setPasOutput({
          problem: t('problem_text'),
          agitation: t('agitation_text'),
          solution: t('solution_text'),
          ai_quick_take: t('quick_take_text'),
          emotional_score: 88,
          product_name: file.name.split('.')[0]
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
            className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-4"
          >
            {t('pas_analysis_title')}
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400/60 bg-purple-500/5 px-2 py-0.5 rounded-full border border-purple-500/20">
              v2.0 Active
            </span>
          </motion.h1>
          <p className="text-slate-400 text-lg">
            {t('dashboard_hero_subtitle')}
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => {
              const btn = document.activeElement as HTMLButtonElement;
              const originalText = btn.innerHTML;
              btn.innerHTML = `<span class="flex items-center gap-2 text-emerald-400 font-black uppercase tracking-widest text-[10px]"><CheckCircle2 class="w-4 h-4" /> ${isRtl ? 'جاري التحميل...' : 'Downloading...'}</span>`;
              
              const link = document.createElement('a');
              link.href = '#';
              link.download = 'neurological_report.pdf';
              link.click();

              setTimeout(() => { btn.innerHTML = originalText; }, 3000);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all group"
          >
            <FileText className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            {t('export_neuro_report')}
          </button>
          
          <button 
            id="save-log-btn"
            disabled={!analysisComplete}
            onClick={handleSaveToLogs}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all ${analysisComplete ? 'border-purple-500/50 bg-purple-500/5 text-white hover:bg-purple-500/10' : 'border-white/5 bg-white/5 text-slate-600 cursor-not-allowed'}`}
          >
            <CheckCircle2 className={`w-5 h-5 ${analysisComplete ? 'text-emerald-400' : 'text-slate-600'}`} />
            {t('save_to_logs')}
          </button>

          <button 
            onClick={() => {
              setIsUploading(false);
              setAnalysisComplete(false);
              setCurrentImage(null);
              setPasOutput({ problem: '', agitation: '', solution: '', ai_quick_take: '', emotional_score: 88, product_name: '' });
            }}
            className="btn-premium flex items-center gap-2"
          >
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
                    <span className="font-black text-purple-400">{t('dashboard_analyzing')}</span>
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

          {/* Main Analysis Output Grid */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 transition-opacity duration-700 ${analysisComplete ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            
            {/* Framework Bento Box (Full width) */}
            <div className="lg:col-span-12 glass-panel p-10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50" />
              <div className="flex items-center gap-4 mb-10">
                <BrainCircuit className="text-purple-400 w-8 h-8" />
                <h2 className="text-2xl font-black text-white">{t('pas_output')}</h2>
                <div className="ml-auto flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-purple-500/30">
                  <Rocket className="w-3.5 h-3.5" />
                  {t('dashboard_ai_precision')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card bg-red-500/5 border-red-500/20 p-8 group/card hover:bg-red-500/10 transition-colors">
                  <div className="text-red-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {t('problem')}
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium text-sm md:text-base break-words">
                    {pasOutput.problem || t('problem_text')}
                  </p>
                </div>

                <div className="premium-card bg-orange-500/5 border-orange-500/20 p-8 group/card hover:bg-orange-500/10 transition-colors">
                  <div className="text-orange-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Zap className="w-4 h-4" />
                    {t('agitation')}
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium text-sm md:text-base break-words">
                    {pasOutput.agitation || t('agitation_text')}
                  </p>
                </div>

                <div className="premium-card bg-green-500/5 border-green-500/20 p-8 group/card hover:bg-green-500/10 transition-colors">
                  <div className="text-green-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('solution')}
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium text-sm md:text-base break-words">
                    {pasOutput.solution || t('solution_text')}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Take (Span 6) */}
            <div className="lg:col-span-6 glass-panel p-10 flex flex-col justify-between overflow-hidden bg-slate-950/40 relative group">
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full" />
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-8">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  {t('ai_quick_take')}
                </div>
                <p className="text-white text-lg md:text-xl lg:text-2xl font-medium leading-relaxed italic relative z-10 break-words">
                  "{pasOutput.ai_quick_take || t('quick_take_text')}"
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 text-slate-500 text-sm">
                Generated based on visual content & market trends.
              </div>
            </div>

            {/* Resonance Score (Span 6) */}
            <div className="lg:col-span-6 glass-panel p-10 bg-gradient-to-br from-white/5 to-white/[0.02]">
              <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-10">{t('emotional_resonance')}</div>
              <div className="flex items-end gap-4 mb-8">
                <span className="text-8xl font-black text-white leading-none tracking-tighter">{pasOutput.emotional_score}</span>
                <span className="text-4xl font-black text-purple-400 mb-2">%</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-6">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${pasOutput.emotional_score}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                />
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
                {t('dashboard_emotional_sub')}
              </p>
            </div>

          </div>

          {/* Marketing Manager Integration */}
          <MarketingManager />

          {/* Product Calculator Integration */}
          <ProductCalculator />
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
