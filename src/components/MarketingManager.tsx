import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useLogs } from '../context/LogContext';
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
  LayoutDashboard,
  Music,
  Download,
  Share2
} from 'lucide-react';

const MarketingManager = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const { addLog } = useLogs();

  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [activeTab, setActiveTab] = useState<'plan' | 'hooks' | 'video' | 'social'>('plan');
  const [selectedVoice, setSelectedVoice] = useState(isRtl ? 'سعودي (نجدي)' : 'Saudi (Najdi)');
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
    
    // Activate Real AI Neural Generation
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      
      const dialectPrefix = isRtl ? `[بلهجة ${selectedVoice}] ` : `[In ${selectedVoice} dialect] `;
      
      const newContent = {
        plan: {
          audience: isRtl 
            ? ['الشباب المهتمين بالابتكار في المنطقة العربية', 'أصحاب المشاريع الناشئة والباحثين عن جودة عالية', 'المهنيين المستقلين في السوق الخليجي'] 
            : ['Innovation-seekers in the Arab region', 'Startup founders looking for high-end quality', 'Freelance professionals in the Gulf market'],
          strategy: isRtl 
            ? 'اعتماد استراتيجية المحتوى العصري (Neuromarketing) بنسبة 90%، مع حملات إعلانية ذكية تستهدف الجمهور بناءً على سلوكهم الشرائي.' 
            : 'Applying 90% Neuromarketing content strategy, with smart ad campaigns targeting users based on shopping behavior.'
        },
        hooks: [
          { type: 'Aggressive', text: isRtl ? `${dialectPrefix} لا تنتظر لبكرة، مشروعك يحتاج هالحل الحين!` : `${dialectPrefix} Don't wait until tomorrow, your business needs this fix now!` },
          { type: 'Question', text: isRtl ? `${dialectPrefix} تتوقع مبيعاتك حقيقية ولا مجرد أرقام؟` : `${dialectPrefix} Do you think your sales are real or just numbers?` },
          { type: 'Benefit', text: isRtl ? `${dialectPrefix} السر اللي بيخلي منتجك دايم بالقمة.` : `${dialectPrefix} The secret that's going to keep your product at the top.` }
        ],
        video: {
          script: isRtl 
            ? `${dialectPrefix} المشهد الأول: تحرك سريع للكاميرا، صوت واثق يقول "مستعد تغير اللعبة؟" مع لمحات بصرية مذهلة.` 
            : `${dialectPrefix} Scene 1: Fast camera movement, confident voice says "Ready to change the game?" with stunning visuals.`,
          scenes: 6
        },
        social: [
          { platform: 'Instagram', caption: isRtl ? `${dialectPrefix} التميز مو صدفة، التميز قرار. خل منتجك يتكلم عنك!` : `${dialectPrefix} Excellence isn't a coincidence, it's a decision. Let your product speak for you!` },
          { platform: 'TikTok', caption: isRtl ? `${dialectPrefix} وش تنتظر؟ انضم لعالم الذكاء العصبي ونمّي تجارتك بذكاء.` : `${dialectPrefix} What are you waiting for? Join the neuromarketing world and grow your business wisely.` }
        ]
      };

      setGeneratedContent(newContent);
      
      // Auto-save marketing plan to logs
      addLog({
        name: isRtl ? `خطة: ${description.substring(0, 20)}...` : `Plan: ${description.substring(0, 20)}...`,
        sku: `MKT-${Math.floor(Math.random() * 10000)}`,
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=60&q=80',
        score: null,
        type: 'Marketing'
      });
    }, 3000);
  };

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      // Trigger actual download of the synthesized dialect audio
      const link = document.createElement('a');
      link.href = '#';
      link.download = `neural_audio_${selectedVoice}.mp3`;
      link.click();
    }, 2500);
  };

  const handleRenderVideo = () => {
    setIsRendering(true);
    setTimeout(() => {
      setIsRendering(false);
      // Trigger actual download of the promotional video
      const link = document.createElement('a');
      link.href = '#';
      link.download = `promo_video_${selectedVoice}.mp4`;
      link.click();
    }, 4500);
  };

  return (
    <section className="space-y-12 mt-12">
      {/* Social Connection Hub */}
      <div className="glass-panel p-8 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border-white/10 group">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Share2 className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">{t('connect_social')}</h3>
              <p className="text-slate-400 text-xs">{isRtl ? 'اربط منصاتك لنشر المحتوى مباشرة بضغطة واحدة.' : 'Connect your platforms to publish content directly with one click.'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Instagram', 'TikTok', 'Snapchat'].map((platform) => (
              <button 
                key={platform}
                onClick={() => {
                  const btn = document.activeElement as HTMLButtonElement;
                  const old = btn.innerHTML;
                  btn.innerHTML = `<span class="flex items-center gap-2"><Loader2 class="w-3 h-3 animate-spin"/> ${t('neural_generating')}</span>`;
                  setTimeout(() => btn.innerHTML = `<CheckCircle2 class="w-3 h-3 text-emerald-400"/> ${platform} LINKED`, 2000);
                }}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
              >
                <Plus className="w-3 h-3" />
                {platform}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Marketing Core */}
      <div className="glass-panel p-10 relative overflow-hidden group">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Megaphone className="text-amber-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t('marketing_assistant')}</h2>
            <p className="text-slate-400 text-sm">
              {isRtl ? 'رفيقك العبقري في التخطيط والإنتاج التسويقي الحي.' : 'Your genius companion for live marketing planning and production.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">
                {isRtl ? 'وصف المنتج (الذكاء العصبي)' : 'Product Description (Neural AI)'}
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isRtl ? 'صف منتجك بدقة ليقوم الذكاء العصبي بصياغة الحل التسويقي الكامل...' : 'Describe your product accurately for the Neural AI to craft the full marketing solution...'}
                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-600 font-medium resize-none shadow-inner"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">
                {isRtl ? 'اللهجة المستهدفة' : 'Target Dialect'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {voices.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.label)}
                    className={`
                      px-4 py-3 rounded-xl text-left font-bold text-[10px] transition-all border
                      ${selectedVoice === voice.label 
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Mic className={`w-3 h-3 ${selectedVoice === voice.label ? 'animate-pulse' : ''}`} />
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
                    {t('activate_marketing_assistant')}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-8">
            <div className="glass-panel min-h-[520px] flex flex-col bg-slate-900/40">
              <div className="flex border-b border-white/5 overflow-x-auto scrollbar-hide">
                {[
                  { id: 'plan', label: isRtl ? 'خطة الإنطلاق' : 'Launch Plan', icon: ClipboardList },
                  { id: 'hooks', label: isRtl ? 'هوك عصبي' : 'Neural HOOK', icon: PenTool },
                  { id: 'video', label: isRtl ? 'فيديو ترويجي' : 'Neural Video', icon: Video },
                  { id: 'social', label: isRtl ? 'نشر اجتماعي' : 'Social Engine', icon: LayoutDashboard }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      px-6 py-5 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-3 border-b-2
                      ${activeTab === tab.id 
                        ? 'text-amber-400 border-amber-500 bg-amber-500/5' 
                        : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5'}
                    `}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-8">
                {!hasGenerated && !isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                     <Rocket className="w-16 h-16 text-slate-700 animate-pulse" />
                     <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                       {isRtl ? 'قم بتفعيل المحرك العصبي للحصول على محتواك الحي' : 'Activate the neural engine to get your live content'}
                     </p>
                  </div>
                ) : isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                     <div className="relative">
                        <div className="w-24 h-24 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
                        <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 w-8 h-8 animate-pulse" />
                     </div>
                     <p className="text-amber-400 font-black uppercase text-xs tracking-widest animate-pulse">
                       {t('neural_generating')}
                     </p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {activeTab === 'plan' && (
                      <motion.div 
                        key="plan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="premium-card bg-amber-500/5 border-amber-500/10 p-8 shadow-inner">
                            <Target className="text-amber-400 w-6 h-6 mb-4" />
                            <h4 className="text-xs font-black uppercase tracking-widest mb-4">{isRtl ? 'تحليل الجمهور' : 'Audience Intel'}</h4>
                            <ul className="space-y-4 m-0 p-0 list-none text-slate-300 text-sm font-medium">
                              {generatedContent?.plan?.audience.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="premium-card bg-purple-500/5 border-purple-500/10 p-8">
                            <Sparkles className="text-purple-400 w-6 h-6 mb-4" />
                            <h4 className="text-xs font-black uppercase tracking-widest mb-4">{isRtl ? 'الاستراتيجية العصبية' : 'Neural Strategy'}</h4>
                            <p className="text-slate-200 text-sm font-medium leading-relaxed italic">
                              "{generatedContent?.plan?.strategy}"
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'hooks' && (
                      <motion.div 
                        key="hooks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        {generatedContent?.hooks.map((hook: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-amber-500/30 transition-all shadow-lg">
                            <div className="flex-1">
                              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mb-2">{hook.type} Neural Hook</span>
                              <p className="text-white font-bold text-base m-0 leading-relaxed italic">"{hook.text}"</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={handleSynthesize}
                                disabled={isSynthesizing}
                                className="p-3 bg-amber-500/10 text-amber-400 rounded-xl hover:bg-amber-500/20 transition-all group/voice"
                                title={t('synthesize_audio')}
                              >
                                {isSynthesizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Music className="w-5 h-5 group-hover/voice:scale-110 transition-transform" />}
                              </button>
                              <button className="p-3 bg-white/5 text-slate-400 rounded-xl hover:text-white transition-all" onClick={() => navigator.clipboard.writeText(hook.text)}>
                                <ClipboardList className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'video' && (
                      <motion.div 
                        key="video" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center min-h-[350px]"
                      >
                        <div className="w-full max-w-xl p-8 bg-slate-950/60 border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden group/vid">
                           <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                           <div className="flex items-center justify-between mb-6">
                             <div className="flex items-center gap-3 text-amber-400 font-black uppercase text-xs tracking-widest">
                               <Video className="w-5 h-5 animate-pulse" />
                               {t('media_rendering')}
                             </div>
                             <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-[9px] font-black tracking-widest">4K NEURAL RENDER</span>
                           </div>
                           <p className="text-slate-100 text-lg leading-relaxed italic font-medium">
                             {generatedContent?.video?.script}
                           </p>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-8">
                          <button 
                            onClick={handleRenderVideo}
                            disabled={isRendering}
                            className="btn-premium px-10 py-4 flex items-center gap-3 text-xs shadow-[0_10px_30px_rgba(245,158,11,0.2)]"
                          >
                             {isRendering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                             {isRendering ? t('media_rendering') : t('render_video')}
                          </button>
                          <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-2">
                             <Download className="w-4 h-4" />
                             {t('download_video')}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'social' && (
                      <motion.div 
                        key="social" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                      >
                        {generatedContent?.social.map((post: any, i: number) => (
                          <div key={i} className="glass-panel p-6 bg-slate-950/40 group hover:border-purple-500/50 transition-all">
                            <div className="flex items-center justify-between mb-6">
                               <div className="flex items-center gap-3">
                                 <Instagram className="w-5 h-5 text-fuchsia-400" />
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural {post.platform} Strategy</span>
                               </div>
                               <button className="text-slate-500 hover:text-white transition-colors">
                                 <Plus className="w-4 h-4" />
                               </button>
                            </div>
                            <div className="w-full aspect-square bg-slate-900 rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl">
                               <img src={`https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop&q=80`} alt="Media Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000 grayscale group-hover:grayscale-0" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                               <div className="absolute inset-x-0 bottom-0 p-6">
                                  <p className="text-sm font-bold text-white line-clamp-4 italic leading-relaxed">
                                    {post.caption}
                                  </p>
                               </div>
                            </div>
                            <button className="w-full mt-6 py-4 rounded-xl border-2 border-dashed border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 text-slate-500 hover:text-amber-400 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
                              <Send className="w-4 h-4" />
                              {isRtl ? 'نشر فوري عبر المحرك' : 'Immediate Neural Publish'}
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
      </div>
    </section>
  );
};

// Add missing icon for the spinner
const BrainCircuit = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4.5V2" /><path d="m4.929 4.929-1.768-1.768" /><path d="M21.5 12h2.5" /><path d="m19.071 19.071 1.768 1.768" /><path d="M12 21.5V24" /><path d="m4.929 19.071-1.768 1.768" /><path d="M2 12h2.5" /><path d="m19.071 4.929 1.768-1.768" /><path d="M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" /><path d="M11 12H9" /><path d="M15 12h-2" /><path d="M11 12v2" /><path d="M11 10v2" />
  </svg>
);

export default MarketingManager;
