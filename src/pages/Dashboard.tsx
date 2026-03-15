import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { supabase } from '../lib/supabase';
import { cn } from '../utils/cn';

const Dashboard = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';

  const navigate = useNavigate();
  const { hasActivePlan } = useSubscription();

  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    try {
      const profileRaw = localStorage.getItem('user_profile');
      if (profileRaw && profileRaw !== 'undefined' && profileRaw !== '[object Object]') {
        setUserProfile(JSON.parse(profileRaw));
      }
    } catch (e) {
      console.warn('Error parsing user_profile from localStorage', e);
      localStorage.removeItem('user_profile');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile = {
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          role: session.user.email?.toLowerCase() === 'koo111333@gmail.com' ? 'admin' : 'user'
        };
        setUserProfile(profile);
        localStorage.setItem('user_profile', JSON.stringify(profile));
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
  const [mmGender, setMmGender] = useState(50); // 50/50 split
  const [mmProduct, setMmProduct] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

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
    if (price > 500) return { category: t('pc_luxury'), advice: t('pc_advice_luxury') };
    if (price > 150) return { category: t('pc_premium'), advice: t('pc_advice_premium') };
    return { category: t('pc_value'), advice: t('pc_advice_value') };
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
    <div className="space-y-8 pb-12" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none mb-2">
            {t('dashboard')}
          </h1>
          <p className="text-slate-500 font-medium">{t('pas_desc')}</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-3 bg-slate-50 text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all">
             {t('export_report')}
           </button>
           <button onClick={handleRunAnalysis} className="px-6 py-3 bg-violet-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-violet-200 hover:bg-violet-700 transition-all active:scale-95">
             {t('run_new_analysis')}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PAS Section */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{t('pas_output')}</h2>
                <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                </div>
              </div>

              <div className="space-y-8">
                 {/* Problem */}
                 <div className="relative pl-6 border-l-2 border-slate-100 hover:border-violet-200 transition-colors">
                    <span className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-white border-2 border-slate-200 group-hover:border-violet-500 transition-colors"></span>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('problem')}</h3>
                    <p className="text-slate-700 font-medium leading-relaxed">{pasOutput.problem || t('problem_text')}</p>
                 </div>

                 {/* Agitation */}
                 <div className="relative pl-6 border-l-2 border-slate-100 hover:border-violet-200 transition-colors">
                    <span className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-white border-2 border-slate-200 group-hover:border-violet-500 transition-colors"></span>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('agitation')}</h3>
                    <p className="text-slate-700 font-medium leading-relaxed">{pasOutput.agitation || t('agitation_text')}</p>
                 </div>

                 {/* Solution */}
                 <div className="relative pl-6 border-l-2 border-slate-100 hover:border-violet-200 transition-colors">
                    <span className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-white border-2 border-slate-200 group-hover:border-violet-500 transition-colors"></span>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('solution')}</h3>
                    <p className="text-slate-700 font-medium leading-relaxed">{pasOutput.solution || t('solution_text')}</p>
                 </div>
              </div>

              {/* Graphical Extras for PAS */}
              <div className="mt-12 pt-8 border-t border-slate-50 flex flex-wrap gap-8 items-end">
                  <div className="flex-1 min-w-[120px]">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">{t('emotional_resonance')}</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-1000" 
                          style={{ width: `${pasOutput.resonanceScore}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-black text-slate-900">{pasOutput.resonanceScore}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {pasOutput.engagementPulse.map((v, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 bg-violet-100 rounded-full transition-all duration-700 hover:bg-violet-600"
                        style={{ height: `${v}%` }}
                      ></div>
                    ))}
                    <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('engagement_pulse')}</span>
                  </div>
              </div>
           </div>

           {/* AI Quick Take - Premium Look */}
           <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 backdrop-blur-xl">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round"/></svg>
                </div>
              </div>
              <h3 className="text-white text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-1 h-4 bg-violet-500 rounded-full"></span>
                {t('ai_quick_take')}
              </h3>
              <p className="text-slate-400 font-medium leading-relaxed italic mb-8">
                "{t('quick_take_text')}"
              </p>
              <button className="w-full py-4 bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition-all active:scale-95">
                Refine with AI
              </button>
           </div>
        </div>

        {/* Marketing Manager & Tools */}
        <div className="space-y-8">
           
           {/* Marketing Manager Component */}
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">{t('mm_title')}</h2>
              <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">
                {t('mm_desc')}
              </p>

              <div className="space-y-6">
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">{t('mm_product_desc')}</label>
                   <textarea 
                    value={mmProduct}
                    onChange={(e) => setMmProduct(e.target.value)}
                    placeholder={t('mm_product_placeholder')}
                    className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium focus:bg-white focus:border-violet-200 focus:ring-4 focus:ring-violet-50 transition-all outline-none resize-none"
                   ></textarea>
                </div>

                {/* Age Range Slider */}
                <div className="pt-2">
                   <div className="flex justify-between items-center mb-6">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('mm_age_range')}</label>
                     <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">{mmAge[0]} - {mmAge[1]} {t('mm_years')}</span>
                   </div>
                   <input 
                    type="range" 
                    min="13" max="65" 
                    value={mmAge[1]} 
                    onChange={(e) => setMmAge([mmAge[0], parseInt(e.target.value)])}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-violet-600" 
                  />
                </div>

                {/* Gender Split Interactive */}
                <div>
                   <div className="flex justify-between items-center mb-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('mm_gender_split')}</label>
                     <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                        <span className={cn("transition-colors", mmGender < 50 ? "text-slate-400" : "text-violet-600")}>Men</span>
                        <span className={cn("transition-colors", mmGender > 50 ? "text-slate-400" : "text-pink-500")}>Women</span>
                     </div>
                   </div>
                   <div className="relative">
                      <div className="h-4 w-full bg-slate-100 rounded-xl overflow-hidden flex">
                        <div className="h-full bg-violet-500 transition-all" style={{ width: `${mmGender}%` }}></div>
                        <div className="h-full bg-pink-500 transition-all" style={{ width: `${100-mmGender}%` }}></div>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={mmGender} 
                        onChange={(e) => setMmGender(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button className="flex-1 py-4 bg-violet-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all">
                      {t('mm_generate')}
                   </button>
                   <button className="px-6 py-4 bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
                      {t('mm_summarize')}
                   </button>
                </div>
              </div>
           </div>

           {/* Pricing Calculator Upgrade */}
           <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{t('pc_title')}</h2>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">{t('pc_desc')}</p>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-black uppercase text-slate-400 mb-1">{t('pc_final_price')}</div>
                   <div className="text-3xl font-black text-slate-900 tracking-tighter">${finalPrice}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">{t('pc_base_cost')}</label>
                    <input 
                      type="number" value={pcBase} 
                      onChange={(e) => setPcBase(parseFloat(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-black text-slate-900 text-sm focus:ring-2 focus:ring-violet-100 outline-none transition-all" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">{t('pc_profit_margin')}</label>
                    <input 
                      type="number" value={pcMargin} 
                      onChange={(e) => setPcMargin(parseFloat(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-black text-slate-900 text-sm focus:ring-2 focus:ring-violet-100 outline-none transition-all" 
                    />
                 </div>
              </div>

              {/* Profitability Advice - AI Powered */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/50 flex gap-5 items-start">
                 <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-violet-400 shrink-0 shadow-lg">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t('pc_advice')}</h4>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-sm font-black text-slate-900">{advice.category}</span>
                       <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-md uppercase">Optimized</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{advice.advice}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
