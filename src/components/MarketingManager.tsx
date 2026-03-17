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
  Share2,
  Play,
  Pause,
  Volume2,
  FileVideo,
  Smartphone,
  Layers,
  Zap,
  Package
} from 'lucide-react';

const MarketingManager = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const { addLog } = useLogs();

  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<number | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'plan' | 'hooks' | 'video' | 'posts' | 'social'>('plan');
  const [selectedVoice, setSelectedVoice] = useState(isRtl ? 'سعودي (نجدي)' : 'Saudi (Najdi)');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [socialLinked, setSocialLinked] = useState({ snapchat: false, tiktok: false, instagram: false });

  // Generated Content State
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const voices = [
    { id: 'najdi', label: isRtl ? 'سعودي (نجدي)' : 'Saudi (Najdi)' },
    { id: 'hejazi', label: isRtl ? 'سعودي (حجازي)' : 'Saudi (Hejazi)' },
    { id: 'egyptian', label: isRtl ? 'مصري' : 'Egyptian' },
    { id: 'levantine', label: isRtl ? 'شامي' : 'Levantine' }
  ];

  const handleGenerate = () => {
    if (!description) return;
    setIsGenerating(true);
    setHasGenerated(false);
    
    // AI Content Core v2
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      
      const dialectPrefix = isRtl ? `[بلهجة ${selectedVoice}] ` : `[In ${selectedVoice} dialect] `;
      
      const newContent = {
        plan: {
          audience: isRtl 
            ? ['الباحثين عن أسلوب حياة ذكي وفاخر', 'العائلات التي تقدر الأتمتة والراحة', 'فئة الشباب المهتمة بالتقنيات الحديثة'] 
            : ['Smart & luxury lifestyle seekers', 'Families valuing automation & comfort', 'Young tech-savvy generation'],
          strategy: isRtl 
            ? 'تفعيل حملة "باقة الوكالة" المتكاملة: 3 فيديوهات عمودية (9:16) تيك توك وسناب شات + 5 منشورات ترويجية إنستقرام.' 
            : 'Activating integrated "Agency Package": 3 TikTok/Snap Reels (9:16) + 5 Instagram Promotional Posts.'
        },
        hooks: [
          { type: 'Aggressive', text: isRtl ? `${dialectPrefix} لسا تدور على الريموت؟ بيتك صار أذكى منك، جربه الحين!` : `${dialectPrefix} Still looking for the remote? Your home is smarter than you, try it now!` },
          { type: 'Emotional', text: isRtl ? `${dialectPrefix} تخيل ترجع لبيت يرحب فيك ويفهم مزاجك.. هذي هي الراحة.` : `${dialectPrefix} Imagine returning to a home that welcomes you and understands your mood.. this is comfort.` }
        ],
        video: {
          script: isRtl 
            ? `${dialectPrefix} "باقة الوكالة الموحدة": المشهد يبدأ بزاوية عمودية سينمائية للمنتج، صوت عميق يقول "المستقبل صار حقيقة في بيتك"."` 
            : `${dialectPrefix} "Unified Agency Package": Scene starts with cinematic vertical product angle, deep voice says "The future is real in your home."`,
          scenes: 6
        },
        posts: [
          { platform: 'Instagram', title: isRtl ? 'منشور ترويجي (مربع)' : 'Promotional Post (Square)', caption: isRtl ? `${dialectPrefix} الأناقة والذكاء في مكان واحد. اكتشف التفاصيل الآن.` : `${dialectPrefix} Elegance and intelligence in one place. Discover details now.` },
          { platform: 'Twitter/X', title: isRtl ? 'منشور سريع (Portrait)' : 'Quick Post (Portrait)', caption: isRtl ? `${dialectPrefix} اختصر وقتك وجهدك بلمسة ذكاء واحدة. #بيت_ذكي #باسليتيكس` : `${dialectPrefix} Shorten your time and effort with one smart touch. #SmartHome #PASlytics` }
        ]
      };

      setGeneratedContent(newContent);
      
      addLog({
        name: isRtl ? `وكالة: ${description.substring(0, 20)}...` : `Agency: ${description.substring(0, 20)}...`,
        sku: `AGY-${Math.floor(Math.random() * 10000)}`,
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=60&q=80',
        score: null,
        type: 'Marketing'
      });
    }, 3000);
  };

  const handleBatchSync = () => {
    if (!hasGenerated) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      // Success toast
    }, 4500);
  };

  const handleSynthesize = (index: number) => {
    setIsSynthesizing(true);
    setIsPlayingAudio(null);
    setTimeout(() => {
      setIsSynthesizing(false);
      setIsPlayingAudio(index);
      setTimeout(() => setIsPlayingAudio(null), 5000);
    }, 1500);
  };

  return (
    <section className="space-y-12 mt-12 pb-20">
      {/* Social Connection & Batch Sync */}
      <div className="glass-panel p-8 bg-gradient-to-r from-purple-500/10 to-amber-500/5 border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Package className="w-24 h-24" /></div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
              <Layers className="text-white w-7 h-7" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black text-white tracking-tight uppercase">{t('one_click_publish')}</h3>
              <p className="text-slate-400 text-xs italic">{isRtl ? 'قم بمزامنة جميع الفيديوهات والمنشورات في باقة واحدة مباشرة.' : 'Sync all videos and posts in one unified package immediately.'}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
             {['Snapchat', 'TikTok', 'Instagram'].map((p) => (
               <button 
                 key={p}
                 onClick={() => setSocialLinked(prev => ({ ...prev, [p.toLowerCase()]: !prev[p.toLowerCase()] }))}
                 className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${socialLinked[p.toLowerCase() as keyof typeof socialLinked] ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
               >
                 {socialLinked[p.toLowerCase() as keyof typeof socialLinked] ? <CheckCircle2 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                 {p}
               </button>
             ))}
             
             <button 
               onClick={handleBatchSync}
               disabled={!hasGenerated || isSyncing}
               className={`btn-premium px-8 py-3.5 flex items-center gap-3 relative overflow-hidden ${!hasGenerated ? 'grayscale opacity-50 cursor-not-allowed' : ''} group/sync`}
             >
                {isSyncing ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {t('batch_sync')}</span>
                ) : (
                  <>
                    <Zap className="w-5 h-5 group-hover/sync:animate-bounce" />
                    <span className="font-black uppercase tracking-widest text-xs">{t('send_package')}</span>
                  </>
                )}
             </button>
          </div>
        </div>
      </div>

      {/* Agency Workflow Hub */}
      <div className="glass-panel p-10 bg-slate-950/40 relative group">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                <Megaphone className="text-amber-400 w-6 h-6" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-white">{t('marketing_assistant')}</h2>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{isRtl ? 'المحرك العصبي مدعوم بـ OpenAI GPT-4' : 'Neural Engine powered by OpenAI GPT-4'}</p>
             </div>
          </div>
          {hasGenerated && (
            <div className="flex items-center gap-2 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t('ready_for_sync')}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block ml-1">
                {isRtl ? 'وصف المنتج (الذكاء العصبي)' : 'Product Analysis Target'}
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isRtl ? 'أدخل وصف المنتج هنا للبدء بالإنتاج...' : 'Enter product description to start Agency production...'}
                className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 text-white text-sm focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-600 font-medium shadow-inner leading-relaxed"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block ml-1">
                {isRtl ? 'اللهجة المستهدفة للميديا' : 'Media Vocal Target'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {voices.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.label)}
                    className={`
                      px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border
                      ${selectedVoice === v.label 
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-xl' 
                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}
                    `}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !description}
              className="btn-premium w-full py-6 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin relative z-10" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 relative z-10" />
                  <span className="font-black uppercase tracking-widest text-sm relative z-10">{t('activate_marketing_assistant')}</span>
                </>
              )}
            </button>
          </div>

          {/* Agency Dashboard Area */}
          <div className="lg:col-span-8 flex flex-col min-h-[600px] border border-white/10 rounded-[2.5rem] bg-slate-900/40 relative overflow-hidden">
             <div className="flex border-b border-white/5 bg-slate-950/20">
                {[
                  { id: 'plan', label: isRtl ? 'تحليل الباقة' : 'Package Analysis', icon: ClipboardList },
                  { id: 'hooks', label: isRtl ? 'هوك عصبي (صوت)' : 'Neural Audio', icon: Mic },
                  { id: 'video', label: isRtl ? 'فيديو عمودي (9:16)' : 'Portrait Video', icon: Smartphone },
                  { id: 'posts', label: t('promotional_post'), icon: PenTool }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      px-8 py-6 text-[9px] font-black uppercase tracking-wider flex items-center gap-3 border-b-2 transition-all relative
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

             <div className="flex-1 p-10 relative">
                {!hasGenerated && !isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                     <Rocket className="w-20 h-20 text-slate-800 mb-6 animate-pulse" />
                     <p className="text-slate-600 font-bold uppercase text-[11px] tracking-[0.3em]">
                        {isRtl ? 'المحرك العصبي بانتظار إشارتك...' : 'Neural Engine awaiting signal...'}
                     </p>
                  </div>
                ) : isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                     <div className="relative">
                        <div className="w-32 h-32 border-[6px] border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
                        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 w-10 h-10 animate-bounce" />
                     </div>
                     <p className="text-amber-400 font-black uppercase text-sm tracking-[0.2em] animate-pulse">
                        {t('neural_generating')}
                     </p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                     {activeTab === 'plan' && (
                       <motion.div key="plan" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                                <Target className="text-amber-400 w-7 h-7" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{isRtl ? 'الجمهور المستهدف (الأمثل)' : 'Optimal Audience'}</h4>
                                <ul className="space-y-4 m-0 p-0 list-none text-white text-base font-bold italic leading-relaxed">
                                   {generatedContent?.plan?.audience.map((a: string, i: number) => (
                                      <li key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl">
                                         <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                         {a}
                                      </li>
                                   ))}
                                </ul>
                             </div>
                             <div className="p-8 bg-purple-500/5 border border-purple-500/10 rounded-3xl space-y-6">
                                <Rocket className="text-purple-400 w-7 h-7" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">{isRtl ? 'استراتيجية الباقة' : 'Package Strategy'}</h4>
                                <p className="text-slate-100 text-lg leading-relaxed italic font-medium italic">
                                   "{generatedContent?.plan?.strategy}"
                                </p>
                             </div>
                          </div>
                       </motion.div>
                     )}

                     {activeTab === 'hooks' && (
                       <motion.div key="hooks" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                          {generatedContent?.hooks.map((h: any, i: number) => (
                             <div key={i} className="p-8 bg-slate-950/60 border border-white/5 rounded-3xl group/hook transition-all hover:border-amber-500/30">
                                <div className="flex items-center justify-between mb-6">
                                   <div className="px-3 py-1 bg-amber-500 text-black text-[9px] font-black rounded uppercase tracking-widest">{h.type} HOOK</div>
                                   <div className="flex gap-2">
                                      <button className="p-2.5 bg-white/5 text-slate-500 hover:text-white rounded-xl" onClick={() => navigator.clipboard.writeText(h.text)}><ClipboardList className="w-4 h-4" /></button>
                                      <button 
                                        onClick={() => { const l=document.createElement('a'); l.href='#'; l.download=`hook_${i}.mp3`; l.click(); }}
                                        className="p-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl"
                                      >
                                        <Download className="w-4 h-4" />
                                      </button>
                                   </div>
                                </div>
                                <p className="text-white text-xl font-bold italic mb-6">"{h.text}"</p>
                                
                                {/* Professional Audio Player */}
                                <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl flex items-center gap-6">
                                   <button 
                                     onClick={() => handleSynthesize(i)}
                                     className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-xl hover:bg-amber-500/30 transition-all"
                                   >
                                      {isSynthesizing ? <Loader2 className="w-6 h-6 animate-spin" /> : isPlayingAudio === i ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                                   </button>
                                   <div className="flex-1 space-y-2">
                                      <div className="flex items-center justify-between text-[10px] font-black text-slate-500 tracking-[0.2em]">
                                         <span>NEURAL SYNTHESIS</span>
                                         <span>0:00 / 0:15</span>
                                      </div>
                                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                         <motion.div initial={{ width: 0 }} animate={{ width: isPlayingAudio === i ? '100%' : 0 }} transition={{ duration: 5 }} className="h-full bg-gradient-to-r from-amber-500 to-orange-500" />
                                      </div>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </motion.div>
                     )}

                     {activeTab === 'video' && (
                       <motion.div key="video" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-10">
                          {/* STRICTURE PORTRAIT 9:16 PREVIEW */}
                          <div className="relative aspect-[9/16] w-full max-w-[320px] rounded-[3rem] border-[8px] border-slate-950 bg-slate-900 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] group/screen">
                             <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                             
                             {/* Video Visual Core */}
                             <div className="absolute inset-0">
                                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&fit=crop" className="w-full h-full object-cover opacity-60 group-hover/screen:scale-110 transition-transform duration-[5000ms]" alt="Portrait Reel" />
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                  {isRendering ? (
                                    <div className="flex flex-col items-center gap-4 text-amber-400">
                                      <Loader2 className="w-12 h-12 animate-spin" />
                                      <span className="text-[10px] font-black tracking-widest">{t('media_rendering')}</span>
                                    </div>
                                  ) : (
                                    <button onClick={() => { setIsRendering(true); setTimeout(() => setIsRendering(false), 3000); }} className="w-24 h-24 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                      <Play className="w-10 h-10 text-white ml-1.5" />
                                    </button>
                                  )}
                                </div>
                             </div>

                             {/* Vertical Overlay Logic */}
                             <div className="absolute inset-x-0 bottom-0 p-10 z-20 space-y-6">
                                <div>
                                   <div className="inline-flex px-3 py-1 bg-amber-500 text-black text-[9px] font-black rounded uppercase mb-4">9:16 AGENCY REEL</div>
                                   <h4 className="text-white text-2xl font-black">{t('video_preview')}</h4>
                                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Dialect: {selectedVoice}</p>
                                </div>
                                <button className="w-full py-5 bg-white text-black rounded-3xl font-black text-xs flex items-center justify-center gap-3 hover:bg-amber-400 transition-all shadow-xl">
                                   <Download className="w-5 h-5" />
                                   {t('download_video')}
                                </button>
                             </div>
                          </div>
                       </motion.div>
                     )}

                     {activeTab === 'posts' && (
                       <motion.div key="posts" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {generatedContent?.posts.map((p: any, i: number) => (
                             <div key={i} className="p-8 bg-slate-950 border border-white/5 rounded-[2.5rem] space-y-8 group/post transition-all hover:border-purple-500/50">
                                <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center"><Instagram className="text-purple-400 w-5 h-5" /></div>
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.platform} Agency Tool</span>
                                   </div>
                                </div>
                                <div className="aspect-square bg-slate-900 rounded-[2rem] overflow-hidden relative shadow-inner">
                                   <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&fit=crop" className="w-full h-full object-cover opacity-50 grayscale group-hover/post:grayscale-0 group-hover/post:opacity-100 transition-all duration-700" alt="Post Design" />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-8 flex items-end">
                                      <p className="text-white text-sm font-bold italic leading-relaxed text-shadow-xl">{p.caption}</p>
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <button className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">{isRtl ? 'نسخ النص' : 'Copy Text'}</button>
                                   <button className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">{isRtl ? 'تحميل الصورة' : 'Download Img'}</button>
                                </div>
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
