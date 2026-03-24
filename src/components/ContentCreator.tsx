import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useLogs } from '../context/LogContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Megaphone, 
  Sparkles, 
  Mic, 
  Instagram,
  Loader2,
  CheckCircle2,
  PenTool,
  Target,
  Rocket,
  Plus,
  ClipboardList,
  Download,
  Play,
  Pause,
  Smartphone,
  Layers,
  Zap,
  Package,
  Twitter
} from 'lucide-react';

const STYLES = [
  { id: 'formal', name: 'الرسمي', label: 'Formal', rate: 1.0, pitch: 1.0 },
  { id: 'energetic', name: 'الحماسي', label: 'Energetic', rate: 1.2, pitch: 1.1 },
  { id: 'friendly', name: 'الودي', label: 'Friendly', rate: 1.0, pitch: 1.05 },
  { id: 'calm', name: 'الهادئ', label: 'Calm', rate: 0.85, pitch: 0.95 }
];

const VOICES = [
  // From user image
  { id: 'khalid', name: 'خالد', gender: 'male', gcpName: 'ar-XA-Wavenet-B', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 'munaib', name: 'منيب', gender: 'male', gcpName: 'ar-XA-Wavenet-C', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: 'ahmed', name: 'أحمد', gender: 'male', gcpName: 'ar-XA-Wavenet-B', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 'hany', name: 'هاني', gender: 'male', gcpName: 'ar-XA-Wavenet-C', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
  { id: 'reem', name: 'ريم', gender: 'female', gcpName: 'ar-XA-Wavenet-A', avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop' },
  { id: 'sara', name: 'سارة', gender: 'female', gcpName: 'ar-XA-Wavenet-D', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: 'hadeel', name: 'هديل', gender: 'female', gcpName: 'ar-XA-Wavenet-A', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 'faris', name: 'فارس', gender: 'male', gcpName: 'ar-XA-Wavenet-B', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
  { id: 'noura', name: 'نورة', gender: 'female', gcpName: 'ar-XA-Wavenet-D', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop' },
  { id: 'huda', name: 'هدى', gender: 'female', gcpName: 'ar-XA-Wavenet-A', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
  // Additional choices
  { id: 'majed', name: 'ماجد', gender: 'male', gcpName: 'ar-XA-Wavenet-C', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop' },
  { id: 'laila', name: 'ليلى', gender: 'female', gcpName: 'ar-XA-Wavenet-D', avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=100&h=100&fit=crop' },
  { id: 'sultan', name: 'سلطان', gender: 'male', gcpName: 'ar-XA-Wavenet-B', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop' },
  { id: 'amal', name: 'أمال', gender: 'female', gcpName: 'ar-XA-Wavenet-A', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop' },
  { id: 'bassem_2', name: 'باسم', gender: 'male', gcpName: 'ar-XA-Wavenet-C', avatar: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=100&h=100&fit=crop' }
];

export const prepareSSML = (text: string) => {
  let processed = text;
  // Replace tokens safely
  processed = processed.replace(/\[Pause\]/gi, '___PAUSE___')
                       .replace(/\[Steady\]/gi, '___STEADY___')
                       .replace(/\[Excited\]/gi, '___EXCITED___')
                       .replace(/\[Breath\]/gi, '___BREATH___')
                       .replace(/\[.*?\]/g, '');
                       
  // Escape HTML XML chars to prevent HTTP 400 Bad Request
  processed = processed.replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;');
                       
  // Restore SSML
  processed = processed.replace(/___PAUSE___/g, '<break time="0.4s"/>')
                       .replace(/___STEADY___/g, '<prosody rate="default">')
                       .replace(/___EXCITED___/g, '<prosody rate="fast">')
                       .replace(/___BREATH___/g, '<break time="0.2s"/>');
    
  const openCount = (processed.match(/<prosody/g) || []).length;
  for (let i = 0; i < openCount; i++) {
    processed += '</prosody>';
  }
  return `<speak>${processed}</speak>`;
};

const ContentCreator = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const { addLog } = useLogs();
  const navigate = useNavigate();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<number | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [activeTab, setActiveTab] = useState<'plan' | 'hooks' | 'video' | 'posts' | 'social'>('plan');
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [socialLinked, setSocialLinked] = useState({ snapchat: false, tiktok: false, instagram: false, twitter: false });

  const [generatedContent, setGeneratedContent] = useState<any>(() => {
    const saved = sessionStorage.getItem('paslytics_generator_content');
    try {
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [description, setDescription] = useState(() => {
    return sessionStorage.getItem('paslytics_generator_desc') || '';
  });

  const [hasGenerated, setHasGenerated] = useState(!!generatedContent);

  useEffect(() => {
    sessionStorage.setItem('paslytics_generator_content', JSON.stringify(generatedContent));
    sessionStorage.setItem('paslytics_generator_desc', description);
  }, [generatedContent, description]);

  const [isPostLoading, setIsPostLoading] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!description) return;
    setIsGenerating(true);
    setHasGenerated(false);
    setGeneratedContent(null);
    sessionStorage.removeItem('paslytics_generator_content');
    
    try {
      const voiceName = VOICES.find(v => v.id === selectedVoice)?.name || selectedVoice;
      const styleName = STYLES.find(s => s.id === selectedStyle)?.label || selectedStyle;
      const dialectPrefix = isRtl ? `[بلهجة خليجية وصوت ${voiceName} بأسلوب ${styleName}] ` : `[In Khaleeji dialect, ${voiceName} voice/dialect with ${styleName} style] `;
      const prompt = `
        نظام: أنت خبير صناعة محتوى تسويقي محترف. قم بإنشاء محتوى ترويجي شامل للمنتج: "${description}"
        ${dialectPrefix}
        المطلوب هو توليد خطة متكاملة تشمل:
        1. خطة محتوى (جمهور مستهدف واستراتيجية).
        2. 2 هوك (Hook) قوي للفيديوهات. (ملاحظة: ضمن النص، أضف واصفات المشاعر والتنغيم الصوتي مثل [Excited], [Steady], [Breath], [Pause] لتوجيه محركات توليد الصوت المتقدمة).
        3. سيناريو لإنشاء فيديو ترويجي إعلاني دعائي مقسم إلى 3 مشاهد على الأقل، مع وصف لكل مشهد. (أضف أيضاً واصفات المشاعر في الحوار/النص).
        4. منشورين اجتماعيين احترافيين (Instagram و Twitter) مع كابشن جذاب، علامات هاشتاج، ووصف للصورة (Image Prompt).
        
        ملاحظة الهامة جداً: يجب أن يكون المحتوى وكل النصوص الخاصة بالتعليق الصوتي مألوفة، عامية، وبلهجة خليجية دارجة جداً (كأنها من صانع محتوى عفوي في تيك توك) وتجنب تماماً اللغة العربية الفصحى أو أسلوب نشرات الأخبار لضمان ألا يبدو التعليق الصوتي وكأنه "تقرير إخباري". استخدم أسلوب عفوي ومفردات يومية طبيعية جداً.
        
        أجب بتنسيق JSON حصراً:
        {
          "plan": { "audience": ["...", "...", "..."], "strategy": "..." },
          "hooks": [
            { "type": "إبداعي", "text": "..." },
            { "type": "قيمي", "text": "..." }
          ],
          "video": { 
            "script": "...", 
            "scenes": [
              { "title": "المشهد 1", "action": "..." },
              { "title": "المشهد 2", "action": "..." },
              { "title": "المشهد 3", "action": "..." }
            ]
          },
          "posts": [
            { "platform": "Instagram", "caption": "...", "image_prompt": "..." },
            { "platform": "Twitter", "caption": "...", "image_prompt": "..." }
          ]
        }
      `;

      const { analyzeMarketing } = await import('../lib/google-ai-service');
      const responseText = await analyzeMarketing(prompt);
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      const cleanedJson = jsonMatch ? jsonMatch[0] : responseText.replace(/```json/i, '').replace(/```/i, '').trim();
      const newContent = JSON.parse(cleanedJson);

      setGeneratedContent(newContent);
      setHasGenerated(true);
      
      addLog({
        name: description.substring(0, 30) + '...',
        sku: `CNT-${Math.floor(Math.random() * 10000)}`,
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=60&q=80',
        score: null,
        type: 'Content',
        details: newContent.plan?.strategy,
        problem: newContent.video?.script
      });
    } catch (error) {
      console.error("Content Generation Failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBatchSync = () => {
    if (!hasGenerated) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      
      // Save pseudo posts to localStorage to pass to the Social Dashboard
      const publishedPosts = [];
      if (generatedContent.video) {
        publishedPosts.push({
          id: Date.now(),
          type: 'video',
          platform: 'All Platforms',
          status: 'published',
          date: new Date().toISOString().split('T')[0],
          content: 'فيديو ترويجي 9:16: ' + (generatedContent.hooks?.[0]?.text?.substring(0, 40) + '...' || 'محتوى فيديو متميز'),
          views: '0',
          likes: '0'
        });
      }
      
      if (generatedContent.posts) {
        generatedContent.posts.forEach((p: any, idx: number) => {
          publishedPosts.push({
            id: Date.now() + idx + 1,
            type: 'post',
            platform: p.platform,
            status: 'published',
            date: new Date().toISOString().split('T')[0],
            content: p.caption?.substring(0, 60) + '...',
            views: '0',
            likes: '0'
          });
        });
      }
      
      // Merge with existing
      const existing = JSON.parse(localStorage.getItem('paslytics_published_posts') || '[]');
      localStorage.setItem('paslytics_published_posts', JSON.stringify([...publishedPosts, ...existing]));

      // Success simulation & Redirect
      const toast = document.createElement('div');
      toast.className = `fixed top-8 ${isRtl ? 'left-8' : 'right-8'} glass-panel px-8 py-5 border-emerald-500/50 bg-emerald-500/20 text-emerald-400 font-black uppercase tracking-widest text-xs z-[200] animate-slideDown flex items-center gap-4`;
      toast.innerHTML = `<CheckCircle2 class="w-5 h-5" /> ${isRtl ? 'تم النشر! جاري تحويلك لمنصة السوشيال ميديا...' : 'Published! Redirecting to Social Dashboard...'}`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
        navigate('/social');
      }, 1500);
    }, 2500);
  };

  const handleSynthesize = async (index: number) => {
    if (!generatedContent?.hooks[index]) return;
    
    setIsSynthesizing(true);
    setIsPlayingAudio(null);
    window.speechSynthesis.cancel();

    try {
      const style = STYLES.find(s => s.id === selectedStyle) || STYLES[0];
      const voice = VOICES.find(v => v.id === selectedVoice) || VOICES[0];
      const apiKey = (import.meta as any).env.VITE_GOOGLE_TTS_API_KEY || "AIzaSyCUYDI5GgLqY6gJUXSBqNrbdwx4dJdM-Rc";
      
      const ssml = prepareSSML(generatedContent.hooks[index].text);
      
      // Calculate GCP Pitch (-20 to 20 range, where 0 is default 1.0)
      const combinedPitch = style.pitch * voicePitch; // e.g. 1.0 * 1.0 = 1.0, 1.1 * 1.5 = 1.65
      const gcpPitch = (combinedPitch - 1.0) * 20; 

      // Get exact language code derived from GCP Voice Name
      const langCode = voice.gcpName ? voice.gcpName.substring(0, 5) : 'ar-XA';
      
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { ssml: ssml },
          voice: { languageCode: langCode, name: voice.gcpName || 'ar-XA-Wavenet-B' },
          audioConfig: { 
            audioEncoding: 'MP3',
            speakingRate: style.rate * voiceSpeed,
            pitch: Math.max(-20, Math.min(20, gcpPitch)) // Clamp between -20 and 20
          }
        })
      });

      if (!response.ok) throw new Error('GCP TTS failed. Falling back to local...');

      const data = await response.json();
      const audio = new Audio("data:audio/mp3;base64," + data.audioContent);
      setIsSynthesizing(false);
      setIsPlayingAudio(index);
      
      audio.onended = () => setIsPlayingAudio(null);
      audio.onerror = () => setIsPlayingAudio(null);
      audio.play();

    } catch (error) {
      console.warn('Real TTS Failed:', error);
      
      const toast = document.createElement('div');
      toast.className = `fixed bottom-8 left-8 right-8 md:left-auto md:right-8 p-6 rounded-2xl border border-red-500/50 bg-red-500/20 text-red-100 font-bold tracking-widest text-[11px] md:text-xs z-[200] animate-slideDown flex items-center gap-4 max-w-sm backdrop-blur-xl shadow-2xl`;
      toast.innerHTML = `<span class="leading-relaxed">⚠️ فشل الاتصال بمحرك Wavenet. تأكد من تفعيل Google Cloud TTS API في مفتاحك VITE_GOOGLE_TTS_API_KEY. سيتم استخدام الصوت الآلي مؤقتاً.</span>`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 7000);
      
      // Fallback
      setTimeout(() => {
        setIsSynthesizing(false);
        setIsPlayingAudio(index);
        
        const style = STYLES.find(s => s.id === selectedStyle) || STYLES[0];
        const rawText = generatedContent.hooks[index].text;
        const cleanText = rawText.replace(/\[.*?\]/g, '').trim();
        const utter = new SpeechSynthesisUtterance(cleanText);
        utter.lang = isRtl ? 'ar-SA' : 'en-US';
        utter.rate = style.rate * voiceSpeed;
        utter.pitch = style.pitch * voicePitch;
        
        // Try to select a high-quality Arabic voice available locally
        const availableVoices = window.speechSynthesis.getVoices();
        const arabicVoice = availableVoices.find(v => v.lang.startsWith('ar') && (v.name.includes("Maged") || v.name.includes("Tarik") || v.name.includes("Laila"))) 
                           || availableVoices.find(v => v.lang.startsWith('ar'));
        if (arabicVoice) {
          utter.voice = arabicVoice;
        }
        
        utter.onend = () => setIsPlayingAudio(null);
        utter.onerror = () => setIsPlayingAudio(null);
        
        window.speechSynthesis.speak(utter);
      }, 500);
    }
  };

  const handleGeneratePostFromHook = async (hookIndex: number) => {
    if (!generatedContent?.hooks[hookIndex]) return;
    setIsPostLoading(hookIndex);
    
    try {
      const hookText = generatedContent.hooks[hookIndex].text;
      const prompt = `أنت خبير تسويق. قم بإنشاء منشور اجتماعي احترافي وجذاب ومعاصر ومناسب للنشر في انستقرام وتويتر بناءً على هذا الهوك: "${hookText}". المنتج هو: "${description}". يجب أن يكون النص باللهجة الخليجية العامية الدارجة جداً بعيداً عن الفصحى وأسلوب التقارير. استخدم أسلوب التنغيم الصوتي (Prosody) وقم بتضمين واصفات المشاعر مثل [Excited], [Steady] في النص. أجب بتنسيق JSON: { "platform": "Instagram", "caption": "...", "image_prompt": "..." }`;
      
      const { analyzeMarketing } = await import('../lib/google-ai-service');
      const responseText = await analyzeMarketing(prompt);
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      const cleanedJson = jsonMatch ? jsonMatch[0] : responseText.replace(/```json/i, '').replace(/```/i, '').trim();
      const parsedData = JSON.parse(cleanedJson);
      
      // Ensure we always push an array of posts or single post properly
      const newPosts = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      setGeneratedContent((prev: any) => ({
        ...prev,
        posts: [...(prev.posts || []), ...newPosts]
      }));
      setActiveTab('posts');
    } catch (err) {
      console.error("Hook-to-Post failed:", err);
    } finally {
      setIsPostLoading(null);
    }
  };

  const handleDownloadAsset = (type: string) => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} glass-panel px-6 py-4 border-purple-500/50 bg-purple-500/10 text-purple-400 font-black uppercase tracking-widest text-xs z-50 animate-bounce flex items-center gap-3`;
    toast.innerHTML = `<Download class="w-4 h-4" /> ${isRtl ? 'جاري التحميل...' : 'Downloading Assets...'}`;
    document.body.appendChild(toast);
    
    // Fix: Create a real dummy file to avoid "empty HTML" error
    const dummyContent = type === 'video' 
      ? "RIFF....WAVEfmt ........data...." // Fake video header
      : "Professional Post Content Generated by Content Creator";
      
    const blob = new Blob([dummyContent], { type: type === 'video' ? 'video/mp4' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = type === 'video' ? 'marketing_video_916.mp4' : 'professional_post.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => toast.remove(), 2000);
  };

  return (
    <section className="space-y-12 mt-12 pb-20">
      {/* Social Connection & Batch Sync */}
      <div className="glass-panel p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/5 border-white/10 relative overflow-hidden group mb-8">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Layers className="w-32 h-32" /></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
              <Zap className="text-blue-400 w-8 h-8" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black text-white tracking-tight uppercase">{isRtl ? 'إدارة حسابات السوشيال ميديا' : 'Social Media Management'}</h3>
              <p className="text-slate-400 text-sm mt-1">{isRtl ? 'اربط حساباتك لمتابعة البوستات والحملات الإعلانية ونشرها بضغطة زر واحدة' : 'Link accounts to track posts and campaigns, and publish with one click'}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
               {['Snapchat', 'TikTok', 'Instagram', 'Twitter'].map((p) => (
                 <button 
                   key={p}
                  onClick={() => setSocialLinked(prev => ({ ...prev, [p.toLowerCase()]: !prev[p.toLowerCase() as keyof typeof socialLinked] }))}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${socialLinked[p.toLowerCase() as keyof typeof socialLinked] ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}
                 >
                   {socialLinked[p.toLowerCase() as keyof typeof socialLinked] ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                   {isRtl && p === 'Twitter' ? 'X (تويتر)' : p}
                 </button>
               ))}
            </div>
             
             <button 
               onClick={handleBatchSync}
               disabled={!hasGenerated || isSyncing || !Object.values(socialLinked).some(Boolean)}
               className={`w-full lg:w-auto px-10 py-4 rounded-xl flex items-center justify-center gap-3 transition-all font-black uppercase tracking-widest text-xs relative overflow-hidden
                 ${!hasGenerated || !Object.values(socialLinked).some(Boolean) 
                   ? 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed' 
                   : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-blue-500/50 group/sync'}`}
             >
                {isSyncing ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {isRtl ? 'جاري النشر على جميع الحسابات...' : 'Publishing to all accounts...'}</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 group-hover/sync:animate-bounce" />
                    <span className="relative z-10">{isRtl ? 'نشر على جميع الحسابات بضغطة زر' : 'Publish to All Linked Accounts'}</span>
                  </>
                )}
             </button>
          </div>
        </div>
        
        {Object.values(socialLinked).some(Boolean) && (
          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs font-bold text-slate-400">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isRtl ? 'تتبع الحملات الإعلانية والبوستات نَشِط' : 'Campaign & Post Tracking Active'}</span>
             </div>
             <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><Rocket className="w-3.5 h-3.5 text-blue-400" /> {isRtl ? 'إحصائيات الحملات' : 'Campaign Stats'}</span>
                <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-purple-400" /> {isRtl ? 'متابعة التفاعل' : 'Engagement Tracking'}</span>
             </div>
          </div>
        )}
      </div>

      {/* Agency Workflow Hub */}
      <div className="glass-panel p-10 bg-slate-950/40 relative group">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                <Megaphone className="text-amber-400 w-6 h-6" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-white">{t('content_builder')}</h2>
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
                {isRtl ? 'إدخال بصري (اختياري)' : 'Visual Input (Optional)'}
              </label>
              <div 
                onClick={() => document.getElementById('content-img-upload')?.click()}
                className="w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-all bg-white/5 group"
              >
                <input 
                  type="file" 
                  id="content-img-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsGenerating(true);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = async () => {
                      try {
                        const base64 = reader.result as string;
                        const prompt = "حلل هذا المنتج واستخرج وصفاً تسويقياً دقيقاً له باللهجة الخليجية فقط.";
                        const { analyzeMarketing } = await import('../lib/google-ai-service');
                        const desc = await analyzeMarketing(prompt, base64);
                        setDescription(desc.trim());
                      } catch (err) {
                        console.error("Image analysis failed:", err);
                      } finally {
                        setIsGenerating(false);
                      }
                    };
                  }}
                />
                <Plus className="w-6 h-6 text-slate-500 group-hover:text-amber-400 mb-2" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white">
                  {isRtl ? 'رفع صورة المنتج' : 'Upload Product Image'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block ml-1">
                {isRtl ? 'وصف المنتج (التحليل الذكي)' : 'Product Analysis Target'}
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
                {isRtl ? 'اختيار النمط (Style Selection)' : 'Style Selection'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`
                      px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
                      ${selectedStyle === s.id 
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-xl' 
                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}
                    `}
                  >
                    {isRtl ? s.name : s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block ml-1">
                {isRtl ? 'إعدادات الصوت (المذيعين المختارة)' : 'Voiceover Master Selection'}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto custom-scrollbar p-2">
                {VOICES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={`
                      relative p-2 rounded-xl transition-all border group
                      ${selectedVoice === v.id 
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-md scale-105' 
                        : 'bg-white/5 border-white/5 hover:border-white/10'}
                    `}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                       <div className="w-10 h-10 rounded-full overflow-hidden border border-transparent group-hover:border-amber-500/20 transition-all">
                          <img src={v.avatar} alt={v.name} className="w-full h-full object-cover" />
                       </div>
                       <span className={`text-[9px] font-black uppercase tracking-widest ${selectedVoice === v.id ? 'text-amber-400' : 'text-slate-500'}`}>
                          {v.name}
                       </span>
                    </div>
                    {selectedVoice === v.id && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-2.5 h-2.5 text-black" />
                      </div>
                    )}
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
                  { id: 'plan', label: isRtl ? 'تحليل الباقة' : 'Package Analysis', icon: ClipboardList, ai: true },
                  { id: 'hooks', label: isRtl ? 'هوك ذكي (صوت)' : 'Smart Audio', icon: Mic, ai: true },
                  { id: 'video', label: isRtl ? 'إنشاء فيديو إعلاني دعائي' : 'Create Promo Video', icon: Smartphone, ai: true },
                  { id: 'posts', label: t('promotional_post'), icon: PenTool, ai: true }
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
                    <div className="flex flex-col items-start gap-1">
                      {tab.label}
                    </div>
                  </button>
                ))}
             </div>

             <div className="flex-1 p-10 relative">
                {!hasGenerated && !isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                     <Rocket className="w-20 h-20 text-slate-800 mb-6 animate-pulse" />
                     <p className="text-slate-600 font-bold uppercase text-[11px] tracking-[0.3em]">
                        {isRtl ? 'النظام بانتظار إشارتك...' : 'System awaiting signal...'}
                     </p>
                  </div>
                ) : isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                     <div className="relative">
                        <div className="w-32 h-32 border-[6px] border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
                        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 w-10 h-10 animate-bounce" />
                     </div>
                     <p className="text-amber-400 font-black uppercase text-sm tracking-[0.2em] animate-pulse">
                        {isRtl ? 'جاري التحليل والإنتاج...' : 'Analyzing & Producing Content...'}
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
                                <p className="text-slate-100 text-lg leading-relaxed italic font-medium">
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
                                   <div className="flex items-center gap-4">
                                      <div className="px-3 py-1 bg-amber-500 text-black text-[9px] font-black rounded uppercase tracking-widest">{h.type} HOOK</div>
                                   </div>
                                   <div className="flex gap-2">
                                      <button className="p-2.5 bg-white/5 text-slate-500 hover:text-white rounded-xl" onClick={() => navigator.clipboard.writeText(h.text)}><ClipboardList className="w-4 h-4" /></button>
                                      <button 
                                        onClick={() => handleGeneratePostFromHook(i)}
                                        disabled={isPostLoading === i}
                                        className="p-2.5 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-xl flex items-center gap-2"
                                      >
                                        {isPostLoading === i ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PenTool className="w-3.5 h-3.5" />}
                                        <span className="text-[8px] font-black uppercase tracking-widest">{isRtl ? 'تحويل لبوست' : 'Post it'}</span>
                                      </button>
                                      <button 
                                        onClick={() => handleDownloadAsset('audio')}
                                        className="p-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl"
                                      >
                                        <Download className="w-4 h-4" />
                                      </button>
                                   </div>
                                </div>
                                <p className="text-white text-xl font-bold italic mb-6">"{h.text}"</p>
                                
                                <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl flex flex-col gap-4">
                                    <div className="flex items-center gap-6">
                                       <button 
                                         onClick={() => handleSynthesize(i)}
                                         className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-xl hover:bg-amber-500/30 transition-all"
                                       >
                                          {isSynthesizing ? <Loader2 className="w-6 h-6 animate-spin" /> : isPlayingAudio === i ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                                       </button>
                                       <div className="flex-1 space-y-2">
                                          <div className="flex items-center justify-between text-[10px] font-black text-slate-500 tracking-[0.2em]">
                                             <span>SMART SYNTHESIS</span>
                                          </div>
                                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                             <motion.div initial={{ width: 0 }} animate={{ width: isPlayingAudio === i ? '100%' : 0 }} transition={{ duration: 5 }} className="h-full bg-gradient-to-r from-amber-500 to-orange-500" />
                                          </div>
                                       </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-6 pt-2 border-t border-white/5">
                                       <div className="space-y-2">
                                          <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                                             <span>{isRtl ? 'السرعة' : 'Speed'}</span>
                                             <span>{voiceSpeed}x</span>
                                          </div>
                                          <input type="range" min="0.5" max="2" step="0.1" value={voiceSpeed} onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))} className="w-full accent-amber-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                                       </div>
                                       <div className="space-y-2">
                                          <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                                             <span>{isRtl ? 'النبرة' : 'Pitch'}</span>
                                             <span>{voicePitch}x</span>
                                          </div>
                                          <input type="range" min="0.5" max="2" step="0.1" value={voicePitch} onChange={(e) => setVoicePitch(parseFloat(e.target.value))} className="w-full accent-amber-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                                       </div>
                                    </div>
                                 </div>
                             </div>
                          ))}
                       </motion.div>
                     )}

                      {activeTab === 'video' && (
                        <motion.div key="video" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                           <div className="relative aspect-[9/16] w-full max-w-[300px] mx-auto rounded-[3rem] border-[8px] border-slate-950 bg-slate-900 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] group/screen">
                              <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                              <div className="absolute inset-0">
                                 <img 
                                   src={`https://images.unsplash.com/photo-${activeScene === 0 ? '1542744173-8e7e53415bb0' : activeScene === 1 ? '1460925895917-afdab827c52f' : '1486312338219-ce68d2c6f44d'}?w=800&fit=crop`} 
                                   className="w-full h-full object-cover opacity-60 transition-all duration-700" 
                                   alt="Portrait Reel" 
                                 />
                                 
                                 <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <button onClick={() => { setIsRendering(true); setTimeout(() => setIsRendering(false), 3000); }} className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
                                      {isRendering ? <Loader2 className="w-8 h-8 animate-spin text-white" /> : <Play className="w-8 h-8 text-white ml-1.5" />}
                                    </button>
                                 </div>
                                 
                                 <div className="absolute inset-x-0 bottom-32 px-6 z-20 space-y-2">
                                     <div className="px-3 py-1 bg-amber-500 text-black text-[7px] font-black rounded w-fit uppercase tracking-widest leading-none">{isRtl ? 'وصف المشهد' : 'SCENE OVERLAY'}</div>
                                    <motion.div 
                                      key={activeScene}
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      className="bg-black/80 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-2xl"
                                    >
                                       <p className="text-white text-[11px] font-bold leading-relaxed text-center italic">
                                         "{generatedContent?.video?.scenes[activeScene]?.action}"
                                       </p>
                                    </motion.div>
                                 </div>
                              </div>
                              <div className="absolute inset-x-0 bottom-0 p-8 z-20 space-y-4">
                                 {renderProgress > 0 && renderProgress < 100 ? (
                                   <div className="w-full space-y-2">
                                      <div className="flex justify-between text-[9px] font-black text-amber-400 uppercase tracking-widest">
                                         <span>{isRtl ? 'جاري الرندرة...' : 'Rendering...'}</span>
                                         <span>{renderProgress}%</span>
                                      </div>
                                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                         <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${renderProgress}%` }} />
                                      </div>
                                   </div>
                                 ) : (
                                   <>
                                     <div>
                                        <div className="inline-flex px-2 py-0.5 bg-amber-500 text-black text-[8px] font-black rounded uppercase mb-2">9:16 REEL</div>
                                        <h4 className="text-white text-lg font-black">{t('video_preview')}</h4>
                                     </div>
                                     <button 
                                       onClick={() => {
                                         if (renderProgress === 100) {
                                            handleDownloadAsset('video');
                                         } else {
                                            setRenderProgress(1);
                                            const interval = setInterval(() => {
                                               setRenderProgress(prev => {
                                                  if (prev >= 100) {
                                                     clearInterval(interval);
                                                     return 100;
                                                  }
                                                  const next = prev + 4;
                                                  if (next < 33) setActiveScene(0);
                                                  else if (next < 66) setActiveScene(1);
                                                  else setActiveScene(2);
                                                  return next;
                                               });
                                            }, 150);
                                         }
                                       }}
                                       className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-xl"
                                     >
                                        {renderProgress === 100 ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                                        {renderProgress === 100 ? (isRtl ? 'تحميل الفيديو' : 'Download Video') : (isRtl ? 'بدء الرندرة والإنشاء' : 'Start Render & Create')}
                                     </button>
                                   </>
                                 )}
                              </div>
                           </div>
                           <div className="space-y-6 overflow-y-auto max-h-[600px] custom-scrollbar pr-4 m-0">
                              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-4">{isRtl ? 'السيناريو المقترح' : 'PROPOSED SCRIPT'}</h4>
                                 <p className="text-white text-sm leading-relaxed italic m-0">"{generatedContent?.video?.script}"</p>
                              </div>
                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{isRtl ? 'تسلسل المشاهد' : 'SCENE SEQUENCE'}</h4>
                                 {generatedContent?.video?.scenes.map((scene: any, idx: number) => (
                                    <div 
                                      key={idx} 
                                      onClick={() => setActiveScene(idx)}
                                      className={`p-4 border rounded-2xl flex gap-4 transition-all duration-500 cursor-pointer hover:border-amber-500/40 ${activeScene === idx ? 'bg-amber-500/20 border-amber-500/50 scale-[1.02] shadow-lg' : 'bg-slate-950/40 border-white/5'}`}
                                    >
                                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${activeScene === idx ? 'bg-amber-500 text-black' : 'bg-amber-500/20 text-amber-400'}`}>{idx + 1}</div>
                                       <div>
                                          <div className={`text-[10px] font-black uppercase mb-1 ${activeScene === idx ? 'text-white' : 'text-slate-400'}`}>{scene.title}</div>
                                          <div className={`text-xs leading-relaxed ${activeScene === idx ? 'text-slate-200' : 'text-slate-500'}`}>{scene.action}</div>
                                       </div>
                                    </div>
                                 ))}
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
                                       <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                         {String(p.platform).toLowerCase().includes('twitter') || String(p.platform).toLowerCase().includes('x') 
                                           ? <Twitter className="text-purple-400 w-5 h-5" /> 
                                           : <Instagram className="text-purple-400 w-5 h-5" />}
                                       </div>
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.platform}</span>
                                    </div>
                                 </div>
                                 <div className="aspect-square bg-slate-900 rounded-[2rem] overflow-hidden relative shadow-inner border border-white/5">
                                    <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&fit=crop" className="w-full h-full object-cover opacity-40 group-hover/post:opacity-60 transition-all duration-700" alt="Post Design" />
                                    <div className="absolute inset-x-6 bottom-6 glass-panel p-6 border-white/20 shadow-2xl backdrop-blur-xl">
                                       <p className="text-white text-xs font-bold leading-relaxed">{p.caption}</p>
                                       <div className="mt-4 flex gap-2">
                                          <div className="px-2 py-1 bg-purple-500/20 rounded-md text-[8px] font-black text-purple-400 uppercase tracking-widest">PRO STYLE</div>
                                          <div className="px-2 py-1 bg-white/10 rounded-md text-[8px] font-black text-white/50 uppercase tracking-widest">PREMIUM COPY</div>
                                       </div>
                                    </div>
                                    {p.image_prompt && (
                                       <div className="absolute top-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover/post:opacity-100 transition-opacity">
                                          <div className="text-[8px] font-black text-amber-400 uppercase tracking-widest mb-1">IMAGE PROMPT</div>
                                          <p className="text-[9px] text-white/80 italic leading-snug">{p.image_prompt}</p>
                                       </div>
                                    )}
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => navigator.clipboard.writeText(p.caption)} className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">{isRtl ? 'نسخ النص' : 'Copy Text'}</button>
                                    <button onClick={() => handleDownloadAsset('static')} className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">{isRtl ? 'تحميل الصورة' : 'Download Img'}</button>
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

export default ContentCreator;
