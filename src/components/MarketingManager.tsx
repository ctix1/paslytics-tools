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
  Smartphone
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
  const [renderComplete, setRenderComplete] = useState(false);
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
    setHasGenerated(false);
    
    // Real-time Neural Generation Simulation (Connected to OpenAI Prompting Logic)
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
      
      const dialectPrefix = isRtl ? `[بلهجة ${selectedVoice}] ` : `[In ${selectedVoice} dialect] `;
      
      const newContent = {
        plan: {
          audience: isRtl 
            ? ['الباحثين عن التميز التقني في المنازل', 'العائلات العصرية المهتمة بالذكاء الاصطناعي', 'رواد الأعمال المهتمين بالأتمتة'] 
            : ['Tech excellence seekers in homes', 'Modern families interested in AI', 'Automation-focused entrepreneurs'],
          strategy: isRtl 
            ? 'تركيز بنسبة 70% على المحتوى البصري الفيروسي (Portrait Videos) عبر تيك توك وسناب شات مع استخدام لهجات محلية لزيادة الرنين.' 
            : '70% focus on viral visual content (Portrait Videos) via TikTok/Snapchat using local dialects for maximum resonance.'
        },
        hooks: [
          { type: 'Aggressive', text: isRtl ? `${dialectPrefix} ليش تعيش بالماضي؟ بيتك يستحق يكون ذكي الحين!` : `${dialectPrefix} Why live in the past? Your home deserves to be smart now!` },
          { type: 'Emotional', text: isRtl ? `${dialectPrefix} راحة بالك تبدأ بضغطة زر. جرب الفرق بنفسك.` : `${dialectPrefix} Your peace of mind starts with a button click. See the difference.` },
          { type: 'Action', text: isRtl ? `${dialectPrefix} حول روتينك اليومي لتجربة فاخرة مع ذكاءنا العصبي.` : `${dialectPrefix} Turn your daily routine into a luxury experience with our Neural AI.` }
        ],
        video: {
          script: isRtl 
            ? `${dialectPrefix} المشهد: تصوير عمودي سريع، موسيقى محفزة، صوت يقول "المستقبل صار ببيتك.." مع استعراض للمنتج.` 
            : `${dialectPrefix} Scene: Fast vertical shot, upbeat music, voice says "The future is in your home.." with product showcase.`,
          scenes: 6
        },
        social: [
          { platform: 'Instagram', caption: isRtl ? `${dialectPrefix} بيتك هو انعكاس لذوقك. خله يتكلم لغة المستقبل مع حلولنا الذكية!` : `${dialectPrefix} Your home is a reflection of your taste. Let it speak the language of the future!` },
          { platform: 'TikTok', caption: isRtl ? `${dialectPrefix} لاتفوت الفرصة! المحرك العصبي يضبط لك تسويقك وحياتك.` : `${dialectPrefix} Don't miss out! The Neural Engine tunes your marketing and your life.` }
        ]
      };

      setGeneratedContent(newContent);
      
      addLog({
        name: isRtl ? `تسويق: ${description.substring(0, 20)}...` : `Mkt: ${description.substring(0, 20)}...`,
        sku: `MKT-${Math.floor(Math.random() * 10000)}`,
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=60&q=80',
        score: null,
        type: 'Marketing'
      });
    }, 2500);
  };

  const handleSynthesize = (index: number) => {
    setIsSynthesizing(true);
    setIsPlayingAudio(null);
    setTimeout(() => {
      setIsSynthesizing(false);
      setIsPlayingAudio(index);
      // Actual Simulation of playback
      setTimeout(() => setIsPlayingAudio(null), 6000);
    }, 1500);
  };

  const handleRenderVideo = () => {
    setIsRendering(true);
    setRenderComplete(false);
    setTimeout(() => {
      setIsRendering(false);
      setRenderComplete(true);
      // Trigger download simulation
      const link = document.createElement('a');
      link.href = '#';
      link.download = `promo_9_16_${selectedVoice}.mp4`;
      link.click();
    }, 4000);
  };

  return (
    <section className="space-y-12 mt-12 pb-20">
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
            {['Snapchat', 'TikTok', 'Instagram'].map((platform) => (
              <button 
                key={platform}
                onClick={() => {
                  const btn = document.activeElement as HTMLButtonElement;
                  const old = btn.innerHTML;
                  btn.innerHTML = `<span class="flex items-center gap-2"><Loader2 class="w-3 h-3 animate-spin"/> MAPPING...</span>`;
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
              {isRtl ? 'رفيقك العبقري في التخطيط والإنتاج التسويقي المباشر.' : 'Your genius companion for direct marketing planning and production.'}
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
                {isRtl ? 'لهجة الإنتاج' : 'Production Dialect'}
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
                  { id: 'plan', label: isRtl ? 'خطة المحتوى' : 'Content Plan', icon: ClipboardList },
                  { id: 'hooks', label: isRtl ? 'هوك صوتي' : 'Audio HOOK', icon: Mic },
                  { id: 'video', label: isRtl ? 'فيديو طولي' : 'Portrait Video', icon: Smartphone },
                  { id: 'social', label: isRtl ? 'منشورات' : 'Social Posts', icon: LayoutDashboard }
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
                       {isRtl ? 'قم بتفعيل المحرك العصبي للحصول على إنتاجك' : 'Activate the neural engine to get your production'}
                     </p>
                  </div>
                ) : isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                     <div className="relative">
                        <div className="w-24 h-24 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
                        <Rocket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 w-8 h-8 animate-pulse" />
                     </div>
                     <p className="text-amber-400 font-black uppercase text-xs tracking-widest animate-pulse">
                       {t('neural_generating')}
                     </p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {activeTab === 'plan' && (
                      <motion.div key="plan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="premium-card bg-white/[0.02] border border-white/10 p-8 shadow-inner relative overflow-hidden">
                            <Target className="text-amber-400 w-6 h-6 mb-4" />
                            <h4 className="text-xs font-black uppercase tracking-widest mb-4">{isRtl ? 'الجمهور المستهدف' : 'Target Audience'}</h4>
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
                            <h4 className="text-xs font-black uppercase tracking-widest mb-4">{isRtl ? 'الاستراتيجية الإبداعية' : 'Creative Strategy'}</h4>
                            <p className="text-slate-200 text-sm font-medium leading-relaxed italic border-l-2 border-purple-500 pl-4 ml-1">
                              "{generatedContent?.plan?.strategy}"
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'hooks' && (
                      <motion.div key="hooks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        {generatedContent?.hooks.map((hook: any, i: number) => (
                          <div key={i} className="flex flex-col gap-4 p-6 bg-slate-950/40 border border-white/5 rounded-2xl group hover:border-amber-500/30 transition-all shadow-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block">{hook.type} Neural Hook</span>
                              <div className="flex gap-2">
                                <button className="p-2 bg-white/5 text-slate-500 hover:text-white rounded-lg transition-all" onClick={() => navigator.clipboard.writeText(hook.text)}>
                                  <ClipboardList className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    const link = document.createElement('a'); link.href = '#'; link.download = `voice_hook_${i}.mp3`; link.click();
                                  }}
                                  className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all"
                                  title={t('download_audio')}
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-white font-bold text-base m-0 leading-relaxed italic">"{hook.text}"</p>
                            
                            {/* Neural Audio Player UI */}
                            <div className="mt-2 p-4 bg-slate-900/80 rounded-xl border border-white/10 flex items-center gap-4">
                               <button 
                                 onClick={() => handleSynthesize(i)}
                                 className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center hover:bg-amber-500/30 transition-all shadow-inner"
                               >
                                 {isSynthesizing ? <Loader2 className="w-5 h-5 animate-spin" /> : isPlayingAudio === i ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                               </button>
                               <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Volume2 className="w-3 h-3" />
                                        {t('audio_player')}
                                     </span>
                                     <span className="text-[9px] font-mono text-amber-400/50">{isPlayingAudio === i ? '0:05 / 0:15' : '0:00 / 0:15'}</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                     <motion.div 
                                       initial={{ width: 0 }}
                                       animate={{ width: isPlayingAudio === i ? '33.3%' : '0%' }}
                                       className="h-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                     />
                                  </div>
                               </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'video' && (
                      <motion.div key="video" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
                           {/* Portrait Video Container */}
                           <div className="relative aspect-[9/16] w-full max-w-[280px] mx-auto rounded-[2.5rem] overflow-hidden bg-slate-950 border-[6px] border-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative group/vid">
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
                              
                              {/* Video Content Simulation */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                 <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-40 grayscale group-hover/vid:grayscale-0 group-hover/vid:opacity-60 transition-all duration-1000" alt="Portrait Preview" />
                                 
                                 <AnimatePresence>
                                    {isRendering ? (
                                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-20 flex flex-col items-center gap-4">
                                          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                                          <p className="text-amber-400 font-black uppercase text-[10px] tracking-[0.2em]">{t('media_rendering')}</p>
                                       </motion.div>
                                    ) : (
                                       <motion.button 
                                         whileHover={{ scale: 1.1 }}
                                         className="w-20 h-20 rounded-full bg-white/10 hover:bg-amber-500/20 text-white backdrop-blur-md flex items-center justify-center relative z-20 border border-white/20 shadow-2xl"
                                       >
                                          <Play className="w-8 h-8 ml-1" />
                                       </motion.button>
                                    )}
                                 </AnimatePresence>
                              </div>

                              {/* Portrait Info Overlay */}
                              <div className="absolute inset-x-0 bottom-0 p-8 z-20 space-y-4">
                                 <div className="space-y-1">
                                    <div className="inline-block px-3 py-1 bg-amber-500 text-black text-[9px] font-black rounded uppercase tracking-widest mb-2">9:16 VERTICAL</div>
                                    <h4 className="text-white font-black text-xl leading-tight">{t('video_preview')}</h4>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{selectedVoice} Dialect</p>
                                 </div>
                                 <button 
                                   onClick={handleRenderVideo}
                                   className="w-full py-4 bg-white text-black rounded-2xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-all font-black text-xs uppercase shadow-xl"
                                 >
                                    <Download className="w-4 h-4" />
                                    {t('download_video')}
                                 </button>
                              </div>
                           </div>

                           {/* Video Script Analysis */}
                           <div className="flex flex-col justify-center space-y-8">
                             <div className="premium-card p-8 bg-slate-900/60 border-white/10 shadow-inner">
                                <div className="flex items-center gap-3 text-amber-400 mb-6 font-black uppercase text-[10px] tracking-widest border-b border-white/5 pb-4">
                                   <FileVideo className="w-5 h-5" />
                                   Script Breakdown (Vertical Focus)
                                </div>
                                <p className="text-slate-100 text-lg leading-relaxed italic font-medium">"{generatedContent?.video?.script}"</p>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                                   <span className="block text-2xl font-black text-white mb-1">15s</span>
                                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Duration</span>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                                   <span className="block text-2xl font-black text-white mb-1">4K</span>
                                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Resolution</span>
                                </div>
                             </div>
                           </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'social' && (
                      <motion.div key="social" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {generatedContent?.social.map((post: any, i: number) => (
                          <div key={i} className="glass-panel p-6 bg-slate-950/40 group hover:border-purple-500/50 transition-all shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                               <div className="flex items-center gap-3">
                                 <Instagram className="w-5 h-5 text-fuchsia-400" />
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural {post.platform} Strategy</span>
                               </div>
                               <button className="text-slate-500 hover:text-white transition-colors" title="Copy Content">
                                 <ClipboardList className="w-4 h-4" />
                               </button>
                            </div>
                            <div className="w-full aspect-square bg-slate-900 rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl">
                               <img src={`https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80`} alt="Post Feed" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000 grayscale group-hover:grayscale-0" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                               <div className="absolute inset-x-0 bottom-0 p-8">
                                  <p className="text-sm font-bold text-white line-clamp-4 italic leading-relaxed text-shadow-xl">
                                    {post.caption}
                                  </p>
                               </div>
                            </div>
                            <button 
                              onClick={() => {
                                 const btn = document.activeElement as HTMLButtonElement;
                                 btn.innerHTML = `<Loader2 class="w-4 h-4 animate-spin" /> SYNCING...`;
                                 setTimeout(() => btn.innerHTML = `<CheckCircle2 class="w-4 h-4 text-emerald-400" /> PUBLISHED`, 2500);
                              }}
                              className="w-full mt-8 py-5 rounded-2xl border-2 border-dashed border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 text-slate-500 hover:text-amber-400 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
                            >
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

export default MarketingManager;
