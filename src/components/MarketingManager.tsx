import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  Sparkles, 
  Video, 
  Mic, 
  Instagram,
  Send,
  Loader2,
  CheckCircle2,
  PenTool,
  Target,
  Rocket,
  Plus,
  ClipboardList,
  LayoutDashboard
} from 'lucide-react';

const MarketingManager = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'plan' | 'hooks' | 'video' | 'social'>('plan');
  const [selectedVoice, setSelectedVoice] = useState('Saudi (Najdi)');
  const [hasGenerated, setHasGenerated] = useState(false);

  // Generated Content State
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const voices = [
    { id: 'najdi', label: isRtl ? 'سعودي (نجدي)' : 'Saudi (Najdi)' },
    { id: 'hejazi', label: isRtl ? 'سعودي (حجازي)' : 'Saudi (Hejazi)' },
    { id: 'egyptian', label: isRtl ? 'مصري' : 'Egyptian' },
    { id: 'levantine', label: isRtl ? 'شامي' : 'Levantine' },
    { id: 'colloquial', label: isRtl ? 'عامي' : 'Colloquial' }
  ];

  const handleGenerate = () => {
    if (!description) return;
    setIsGenerating(true);
    
    // Simulate complex AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      setGeneratedContent({
        plan: {
          audience: isRtl ? ['الشباب المهتمين بالتكنولوجيا', 'رواد الأعمال الطموحين', 'المستقلين والمهنيين'] : ['Tech-savvy youth', 'Aspiring entrepreneurs', 'Freelancers and professionals'],
          strategy: isRtl ? 'التركيز على القنوات الرقمية بنسبة 80%، مع حملات إعلانية مستهدفة عبر تيك توك وإنستقرام.' : 'Focus on digital channels by 80%, with targeted campaigns on TikTok and Instagram.'
        },
        hooks: [
          { type: 'Aggressive', text: isRtl ? 'توقف عن إضاعة وقتك الآن!' : 'Stop wasting your time now!' },
          { type: 'Question', text: isRtl ? 'هل تساءلت يوماً لماذا لا تزيد مبيعاتك؟' : 'Ever wondered why your sales aren\'t increasing?' },
          { type: 'Benefit', text: isRtl ? 'احصل على نتائج مضاعفة بجهد أقل.' : 'Get double the results with less effort.' }
        ],
        video: {
          script: isRtl ? 'تبدأ الصورة بلقطة سريعة للمنتج، ثم صوت هادئ يقول: الحل الذي كنت تنتظره هنا...' : 'Opening shot of the product, smooth voiceover says: The solution you\'ve been waiting for is here...',
          scenes: 5
        },
        social: [
          { platform: 'Instagram', caption: isRtl ? 'نحن نغير الطريقة التي تدير بها أعمالك. استعد للتفوق!' : 'We are changing the way you run your business. Get ready to excel!' },
          { platform: 'LinkedIn', caption: isRtl ? 'الكفاءة هي مفتاح النجاح في العصر الرقمي.' : 'Efficiency is the key to success in the digital age.' }
        ]
      });
    }, 2500);
  };

  return (
    <section className="glass-panel p-10 relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Megaphone className="text-amber-400 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{t('marketing_assistant')}</h2>
          <p className="text-slate-400 text-sm">
            {isRtl ? 'رفيقك الذكي في التخطيط والتنفيذ التسويقي الشامل.' : 'Your intelligent companion for end-to-end marketing planning and execution.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">
              {isRtl ? 'وصف المنتج أو الخدمة' : 'Product or Service Description'}
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isRtl ? 'أدخل وصفاً مفصلاً لمنتجك هنا...' : 'Enter a detailed description of your product here...'}
              className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-600 font-medium resize-none shadow-inner"
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">
              {isRtl ? 'نغمة الصوت واللهجة' : 'Voice Tone & Dialect'}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.label)}
                  className={`
                    px-4 py-3 rounded-xl text-left font-bold text-sm transition-all border
                    ${selectedVoice === voice.label 
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Mic className={`w-4 h-4 ${selectedVoice === voice.label ? 'animate-pulse' : ''}`} />
                    {voice.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !description}
            className="btn-premium w-full py-5 flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            ) : (
              <>
                <Sparkles className="w-5 h-5 relative z-10 group-hover:animate-bounce" />
                <span className="font-black uppercase tracking-widest text-sm relative z-10">
                  {isRtl ? 'توليد الخطة التسويقية' : 'Generate Marketing Plan'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Results & Tools */}
        <div className="lg:col-span-8">
          <div className="glass-panel min-h-[450px] flex flex-col bg-slate-900/30">
            <div className="flex border-b border-white/5 overflow-x-auto scrollbar-hide">
              {[
                { id: 'plan', label: isRtl ? 'الخطة التسويقية' : 'Marketing Plan', icon: ClipboardList },
                { id: 'hooks', label: isRtl ? 'كلمات هوك' : 'HOOK Words', icon: PenTool },
                { id: 'video', label: isRtl ? 'فيديو ترويجي' : 'Promotional Video', icon: Video },
                { id: 'social', label: isRtl ? 'منشورات اجتماعية' : 'Social Posts', icon: LayoutDashboard }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    px-6 py-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-3 border-b-2
                    ${activeTab === tab.id 
                      ? 'text-amber-400 border-amber-500 bg-amber-500/5' 
                      : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5'}
                  `}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 p-8">
              {!hasGenerated && !isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                   <Sparkles className="w-12 h-12 text-slate-600" />
                   <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                     {isRtl ? 'أدخل الوصف واضغط توليد للبدء' : 'Enter description and click generate to begin'}
                   </p>
                </div>
              ) : isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-16 h-16 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
                   <p className="text-amber-400 font-black uppercase text-xs tracking-widest animate-pulse">
                     {isRtl ? 'جاري تحليل السوق وتوليد المحتوى...' : 'Analyzing market and generating content...'}
                   </p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === 'plan' && (
                    <motion.div 
                      key="plan"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="premium-card bg-amber-500/5 border-amber-500/20 p-6">
                          <div className="flex items-center gap-3 text-amber-400 mb-4">
                            <Target className="w-5 h-5" />
                            <h4 className="text-xs font-black uppercase tracking-widest">{isRtl ? 'الجمهور المستهدف' : 'Target Audience'}</h4>
                          </div>
                          <ul className="space-y-3 m-0 p-0 list-none text-slate-300 text-sm font-medium">
                            {generatedContent?.plan?.audience.map((item: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-1 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="premium-card bg-purple-500/5 border-purple-500/20 p-6">
                          <div className="flex items-center gap-3 text-purple-400 mb-4">
                            <Rocket className="w-5 h-5" />
                            <h4 className="text-xs font-black uppercase tracking-widest">{isRtl ? 'استراتيجية النمو' : 'Growth Strategy'}</h4>
                          </div>
                          <p className="text-slate-300 text-sm font-medium leading-relaxed">
                            {generatedContent?.plan?.strategy}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'hooks' && (
                    <motion.div 
                      key="hooks"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {generatedContent?.hooks.map((hook: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group hover:border-amber-500/30 transition-all">
                          <div>
                            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block mb-1">{hook.type}</span>
                            <p className="text-white font-bold text-sm m-0">"{hook.text}"</p>
                          </div>
                          <button className="text-slate-500 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(hook.text)}>
                            <ClipboardList className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'video' && (
                    <motion.div 
                      key="video"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02] p-8"
                    >
                      <div className="w-full max-w-lg mb-6 p-6 bg-slate-950/50 border border-white/10 rounded-2xl">
                         <div className="flex items-center gap-3 mb-4 text-amber-400">
                           <Video className="w-5 h-5" />
                           <span className="text-[10px] font-black uppercase tracking-widest">AI Video Script</span>
                         </div>
                         <p className="text-slate-300 text-sm leading-relaxed italic">
                           {generatedContent?.video?.script}
                         </p>
                      </div>
                      <button className="btn-premium px-8 py-3 flex items-center gap-2 text-xs">
                         <Plus className="w-4 h-4" />
                         {isRtl ? 'تحميل المشاهد المقترحة' : 'Export Suggested Scenes'}
                      </button>
                    </motion.div>
                  )}

                  {activeTab === 'social' && (
                    <motion.div 
                      key="social"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {generatedContent?.social.map((post: any, i: number) => (
                        <div key={i} className="glass-panel p-4 bg-slate-900/50 space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                               <Instagram className="w-3.5 h-3.5" />
                             </div>
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{post.platform} Post</span>
                          </div>
                          <div className="w-full aspect-video bg-white/5 rounded-xl border border-white/10 overflow-hidden relative group">
                            <img src={`https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60`} alt="Preview" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 to-transparent">
                               <p className="text-xs font-medium text-white line-clamp-3">
                                 {post.caption}
                               </p>
                            </div>
                          </div>
                          <button className="w-full py-2.5 rounded-lg border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 transition-all font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                            <Send className="w-3 h-3" />
                            {isRtl ? 'نشر الآن بضغطة واحدة' : 'Publish with 1-Click'}
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingManager;
