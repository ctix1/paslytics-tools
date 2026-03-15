import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { supabase } from '../lib/supabase';
import { cn } from '../utils/cn';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  const { hasActivePlan } = useSubscription();

  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile = {
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          role: session.user.email?.toLowerCase() === 'koo111333@gmail.com' ? 'admin' : 'user'
        };
        setUserProfile(profile);
      }
    });
  }, []);

  const isAdmin = userProfile?.role === 'admin';
  const hasAccess = isAdmin || hasActivePlan;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [pasOutput, setPasOutput] = useState({
    problem: '',
    agitation: '',
    solution: '',
    resonanceScore: 85,
    engagementPulse: [65, 80, 45, 90, 70]
  });

  // Marketing Manager State
  const [mmAge, setMmAge] = useState([18, 45]);
  const [mmGender, setMmGender] = useState(50);
  const [mmProduct, setMmProduct] = useState('');

  // Pricing Calculator State
  const [pcBase, setPcBase] = useState(100);
  const [pcDuty, setPcDuty] = useState(5);
  const [pcMargin, setPcMargin] = useState(25);
  const [pcMarketing, setPcMarketing] = useState(10);
  
  const calcFinalPrice = () => {
    const dutyVal = pcBase * (pcDuty / 100);
    const cost = pcBase + dutyVal + pcMarketing;
    const price = cost / (1 - (pcMargin / 100));
    return price.toFixed(2);
  };

  const getProfitabilityAdvice = (price: number) => {
    if (price > 500) return { category: t('pc_luxury'), advice: t('pc_advice_luxury'), type: 'luxury' };
    if (price > 150) return { category: t('pc_premium'), advice: t('pc_advice_premium'), type: 'premium' };
    return { category: t('pc_value'), advice: t('pc_advice_value'), type: 'value' };
  };

  const finalPrice = parseFloat(calcFinalPrice());
  const advice = getProfitabilityAdvice(finalPrice);

  const handleRunAnalysis = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalysisComplete(true);
          setIsUploading(false);
          setPasOutput({
            problem: "Customers are struggling with complex data visualization tools that require degrees in statistics to understand.",
            agitation: "Hours are wasted every week staring at confusing spreadsheets, leading to delayed decisions and lost revenue opportunities.",
            solution: "Our AI-driven dashboard translates raw metrics into clear emotional narratives, empowering teams to act instantly.",
            resonanceScore: 92,
            engagementPulse: [75, 85, 60, 95, 82]
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-10 pb-20 max-w-[1400px] mx-auto px-4 sm:px-6" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      
      {/* Premium Header */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] border border-white/50 shadow-2xl shadow-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-violet-600 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-lg">AI Core v4.2</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none mb-3">
              {t('dashboard')}
            </h1>
            <p className="text-slate-500 font-semibold text-lg opacity-70">{t('pas_desc')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
             <button className="px-8 py-4 bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-slate-200 hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm">
               {t('export_report')}
             </button>
             <button onClick={handleRunAnalysis} className="px-8 py-4 bg-violet-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl shadow-violet-200 hover:bg-violet-700 hover:-translate-y-1 transition-all active:scale-95">
               {t('run_new_analysis')}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left Column: Analysis Results (7/12) */}
        <div className="xl:col-span-7 space-y-8">
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100 relative overflow-hidden group">
              {/* Header */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" strokeLinecap="round"/></svg>
                   </div>
                   <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{t('pas_output')}</h2>
                </div>
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-4 border-white bg-slate-100"></div>)}
                </div>
              </div>

              {/* PAS Flow */}
              <div className="space-y-12 relative">
                 <div className="absolute top-0 bottom-0 left-[23px] w-0.5 bg-slate-50"></div>
                 
                 {/* Problem */}
                 <div className="relative pl-12 group/item">
                    <div className="absolute left-[15px] top-1 w-4 h-4 rounded-full bg-white border-4 border-slate-200 group-hover/item:border-red-500 transition-all z-10"></div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-red-500/60 mb-3">{t('problem')}</h3>
                    <div className="p-6 bg-slate-50/50 rounded-3xl border border-transparent group-hover/item:border-slate-100 group-hover/item:bg-white transition-all">
                       <p className="text-slate-800 font-bold leading-relaxed text-lg">{pasOutput.problem || t('problem_text')}</p>
                    </div>
                 </div>

                 {/* Agitation */}
                 <div className="relative pl-12 group/item">
                    <div className="absolute left-[15px] top-1 w-4 h-4 rounded-full bg-white border-4 border-slate-200 group-hover/item:border-orange-500 transition-all z-10"></div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-500/60 mb-3">{t('agitation')}</h3>
                    <div className="p-6 bg-slate-50/50 rounded-3xl border border-transparent group-hover/item:border-slate-100 group-hover/item:bg-white transition-all">
                       <p className="text-slate-800 font-bold leading-relaxed text-lg">{pasOutput.agitation || t('agitation_text')}</p>
                    </div>
                 </div>

                 {/* Solution */}
                 <div className="relative pl-12 group/item">
                    <div className="absolute left-[15px] top-1 w-4 h-4 rounded-full bg-white border-4 border-slate-200 group-hover/item:border-emerald-500 transition-all z-10"></div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-500/60 mb-3">{t('solution')}</h3>
                    <div className="p-6 bg-slate-50/50 rounded-3xl border border-transparent group-hover/item:border-slate-100 group-hover/item:bg-white transition-all">
                       <p className="text-slate-800 font-bold leading-relaxed text-lg">{pasOutput.solution || t('solution_text')}</p>
                    </div>
                 </div>
              </div>

              {/* Visual Metrics Floor */}
              <div className="mt-16 pt-10 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('emotional_resonance')}</h4>
                      <span className="text-xl font-black text-violet-600">{pasOutput.resonanceScore}%</span>
                    </div>
                    <div className="relative h-4 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100/50">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-1000 relative shadow-[0_0_15px_rgba(124,58,237,0.3)]" 
                        style={{ width: `${pasOutput.resonanceScore}%` }}
                      >
                         <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-center md:justify-end gap-2">
                    <div className="flex items-end gap-1.5 h-16 mr-4">
                      {pasOutput.engagementPulse.map((v, i) => (
                        <div 
                          key={i} 
                          className="w-2.5 bg-slate-100 rounded-full transition-all duration-500 hover:bg-violet-600 relative group/bar"
                          style={{ height: `${v}%` }}
                        >
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                              {v}%
                           </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t('engagement_pulse')}</h4>
                       <div className="text-[9px] font-bold text-slate-300 uppercase letter-spacing-widest">Past 24h prediction</div>
                    </div>
                  </div>
              </div>
           </div>

           {/* AI Quick Take - Premium Look */}
           <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-violet-400 backdrop-blur-3xl border border-white/5">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round"/></svg>
                </div>
              </div>
              <h3 className="text-white text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-4">
                <span className="w-1.5 h-6 bg-violet-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)]"></span>
                {t('ai_quick_take')}
              </h3>
              <p className="text-slate-300 font-bold text-xl leading-relaxed italic mb-10 max-w-[80%]">
                "{t('quick_take_text')}"
              </p>
              <button className="w-full py-5 bg-white text-slate-900 font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-violet-600 hover:text-white transition-all shadow-xl active:scale-[0.98]">
                REFINE COPY ARCHITECTURE
              </button>
           </div>
        </div>

        {/* Right Column: Tools (5/12) */}
        <div className="xl:col-span-12 2xl:col-span-5 space-y-10">
           
           {/* Marketing Manager Card */}
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">{t('mm_title')}</h2>
              <p className="text-slate-500 font-bold text-sm mb-10 opacity-60 leading-relaxed">
                {t('mm_desc')}
              </p>

              <div className="space-y-8">
                <div>
                   <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">{t('mm_product_desc')}</label>
                   <textarea 
                    value={mmProduct}
                    onChange={(e) => setMmProduct(e.target.value)}
                    placeholder={t('mm_product_placeholder')}
                    className="w-full h-40 px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-3xl text-slate-900 font-bold focus:bg-white focus:border-violet-100 focus:ring-8 focus:ring-violet-50/50 transition-all outline-none resize-none leading-relaxed"
                   ></textarea>
                </div>

                {/* Demographics Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-50">
                  {/* Age */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('mm_age_range')}</label>
                      <span className="text-xs font-black text-violet-600">{mmAge[0]} - {mmAge[1]} {t('mm_years')}</span>
                    </div>
                    <input 
                      type="range" min="13" max="65" value={mmAge[1]} 
                      onChange={(e) => setMmAge([mmAge[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-violet-600" 
                    />
                  </div>
                  
                  {/* Gender Split */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('mm_gender_split')}</label>
                      <div className="flex items-center gap-3 text-[9px] font-black uppercase">
                        <span className={mmGender >= 50 ? "text-violet-600" : "text-slate-300"}>{t('mm_men')}</span>
                        <span className={mmGender < 50 ? "text-pink-500" : "text-slate-300"}>{t('mm_women')}</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex relative cursor-pointer group/slider">
                       <div className="h-full bg-violet-600 transition-all" style={{ width: `${mmGender}%` }}></div>
                       <div className="h-full bg-pink-500 transition-all" style={{ width: `${100-mmGender}%` }}></div>
                       <input 
                          type="range" min="0" max="100" value={mmGender} 
                          onChange={(e) => setMmGender(parseInt(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                       />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                   <button className="flex-[2] py-5 bg-violet-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-violet-200 hover:bg-violet-800 transition-all hover:scale-[1.02] active:scale-95">
                      {t('mm_generate')}
                   </button>
                   <button className="flex-1 py-5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95">
                      {t('mm_summarize')}
                   </button>
                </div>
              </div>
           </div>

           {/* Pricing Strategy Card */}
           <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200/60 shadow-inner overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-emerald-600"></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{t('pc_title')}</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-50">{t('pc_desc')}</p>
                </div>
                <div className="bg-white px-8 py-5 rounded-3xl border border-slate-200/50 shadow-sm text-center min-w-[160px]">
                   <div className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">{t('pc_final_price')}</div>
                   <div className="text-4xl font-black text-slate-900 tracking-tighter">${finalPrice}</div>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="grid grid-cols-2 gap-8 mb-12">
                 {[
                   { label: t('pc_base_cost'), val: pcBase, set: setPcBase, max: 2000 },
                   { label: t('pc_profit_margin'), val: pcMargin, set: setPcMargin, max: 100 }
                 ].map((ctrl, i) => (
                   <div key={i} className="space-y-4">
                      <div className="flex justify-between items-center">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{ctrl.label}</label>
                         <input 
                            type="number" value={ctrl.val} onChange={(e) => ctrl.set(parseFloat(e.target.value))}
                            className="w-16 bg-transparent text-right font-black text-slate-900 outline-none" 
                         />
                      </div>
                      <input 
                        type="range" min="0" max={ctrl.max} value={ctrl.val} 
                        onChange={(e) => ctrl.set(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900" 
                      />
                   </div>
                 ))}
              </div>

              {/* Insight Advice Area */}
              <div className="relative group/advice">
                 <div className="absolute -inset-1 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl blur opacity-5 group-hover/advice:opacity-10 transition"></div>
                 <div className="relative bg-white p-8 rounded-[2rem] border border-slate-100 flex gap-6 items-start shadow-sm">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-2xl transition-transform group-hover/advice:scale-110",
                      advice.type === 'luxury' ? "bg-slate-900" : advice.type === 'premium' ? "bg-violet-600" : "bg-emerald-600"
                    )}>
                       <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('pc_advice')}</h4>
                          <span className="px-2.5 py-0.5 bg-slate-900 text-white text-[8px] font-black rounded-full uppercase tracking-widest">Optimized</span>
                       </div>
                       <div className="text-xl font-black text-slate-900 mb-2">{advice.category}</div>
                       <p className="text-sm text-slate-500 font-bold leading-relaxed opacity-70 italic">{advice.advice}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
