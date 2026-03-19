import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
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
  Rocket,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const { hasActivePlan, subscription, getTimeRemaining } = useSubscription();
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
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) { clearInterval(interval); return 95; }
        return prev + 5;
      });
    }, 100);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result as string;
      try {
        const prompt = `
          نظام: أنت محلل تسويق ومحتوى رقمي محترف ومبدع.
          قم بتحليل المنتج في الصورة المرفقة بعمق.
          
          هام جداً: يجب أن تكون جميع القيم (values) في ملف JSON باللغة "العربية البيضاء" (White Arabic) حصراً، وهي اللغة المفهومة، البسيطة، والمعاصرة المستخدمة في التسويق ووسائل التواصل الاجتماعي، وليست العربية الفصحى الجامدة أو المعقدة.
          ممنوع استخدام اللغة الإنجليزية نهائياً في مخرجات التحليل.
          
          استخدم هيكل PAS المعتمد (Problem-Agitation-Solution).
          
          تنسيق المخرجات المطلوب (JSON الحصري):
          {
            "problem": "وصف المشكلة بالعربية البيضاء",
            "agitation": "شرح التبعات والمشاعر بالعربية البيضاء",
            "solution": "الحل الأمثل بالعربية البيضاء",
            "ai_quick_take": "فكرة تسويقية سريعة بالعربية البيضاء",
            "emotional_score": (رقم بين 80 و 99)
          }
          أجب بملف JSON فقط.
        `;

        const { analyzeMarketing } = await import('../lib/gemini');
        const jsonResponse = await analyzeMarketing(prompt, base64Image);
        
        // Robust JSON parsing
        const cleanedJson = jsonResponse.replace(/```json/i, '').replace(/```/i, '').trim();
        const data = JSON.parse(cleanedJson);

        setPasOutput({
          problem: data.problem || '',
          agitation: data.agitation || '',
          solution: data.solution || '',
          ai_quick_take: data.ai_quick_take || '',
          emotional_score: data.emotional_score || 88
        });
      } catch (err: any) {
        console.error("AI Analysis Failed:", err);
        setError(isRtl ? 'فشل تحليل الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.' : 'AI Analysis failed. Please try again.');
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
            className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-4"
          >
            {t('pas_analysis_title')}
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400/60 bg-purple-500/5 px-2 py-0.5 rounded-full border border-purple-500/20">
              {t('v2_active')}
            </span>
          </motion.h1>
          <p className="text-slate-400 text-lg">
            {t('dashboard_hero_subtitle')}
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

      {hasAccess && (
        <div className="mb-12 glass-panel p-6 bg-emerald-500/5 border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Zap className="text-emerald-400 w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                {isAdmin && subscription.plan === 'none' ? (isRtl ? 'وصول المسؤول' : 'ADMIN ACCESS') : t('active_subscription')}
              </div>
              <div className="text-white font-black uppercase text-xs">
                {isAdmin && subscription.plan === 'none' ? (isRtl ? 'اشتراك غير محدود' : 'UNLIMITED ACCESS') : t(`plan_${subscription.plan}_title` as any)}
              </div>
            </div>
          </div>
          {subscription.plan !== 'none' && (
            <div className="flex flex-col items-end">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{isRtl ? 'الوقت المتبقي' : 'Time Remaining'}</div>
               <div className="text-white font-mono text-xl font-black">
                  {Math.floor(getTimeRemaining() / 3600)}h : {Math.floor((getTimeRemaining() % 3600) / 60)}m : {getTimeRemaining() % 60}s
               </div>
            </div>
          )}
        </div>
      )}

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

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-[10px] uppercase tracking-widest hover:text-white transition-colors border-none bg-transparent cursor-pointer font-black"
              >
                {isRtl ? 'إغلاق' : 'Dismiss'}
              </button>
            </motion.div>
          )}

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
                  {t('v2_active')}
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
                {t('generated_on_visual')}
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
                  transition={{ duration: 1.5 }}
                  className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                />
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
                {t('dashboard_emotional_sub')}
              </p>
            </div>

          </div>

        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
