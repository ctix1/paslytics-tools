import { useState, useEffect } from 'react';
import { 
  Share2, 
  MessageCircle, 
  Heart, 
  Eye, 
  Instagram, 
  Twitter, 
  Smartphone, 
  Layers,
  ArrowUpRight,
  Loader2,
  Lock,
  Globe,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

const SocialDashboard = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  
  const [platforms, setPlatforms] = useState([
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20', connected: true, loading: false, followers: '12.5K', engagement: '+4.2%' },
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'text-slate-200', bg: 'bg-slate-200/10', border: 'border-slate-200/20', connected: true, loading: false, followers: '8.1K', engagement: '+2.1%' },
    { id: 'tiktok', name: 'TikTok', icon: Smartphone, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', connected: false, loading: false, followers: '0', engagement: '0%' },
    { id: 'snapchat', name: 'Snapchat', icon: MessageCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', connected: false, loading: false, followers: '0', engagement: '0%' },
  ]);

  const [authModal, setAuthModal] = useState<{ isOpen: boolean, platform: any } | null>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    // Load published posts from Content Creator
    const savedPosts = localStorage.getItem('paslytics_published_posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts).slice(0, 10)); // keep last 10
      } catch (e) {}
    } else {
      // Mock data
      setPosts([
        { id: 1, type: 'video', platform: 'Instagram', status: 'published', date: new Date().toISOString().split('T')[0], content: 'نظيف وكأنك في قمة جبل! 🏔️ مع هالمنقي الصغير.. الحلم صار حقيقة', views: '12.4K', likes: '1.2K' },
        { id: 2, type: 'post', platform: 'X (Twitter)', status: 'scheduled', date: new Date().toISOString().split('T')[0], content: 'تخيّل.. إنك بوسط الزحمة وكتمة الشوارع.. والجو داخل سيارتك نقي ونظيف 🚗✨', views: '-', likes: '-' },
      ]);
    }
  }, []);

  const requestConnection = (id: string) => {
    const platform = platforms.find(p => p.id === id);
    if (!platform?.connected) {
      setAuthModal({ isOpen: true, platform });
    } else {
      setPlatforms(platforms.map(p => p.id === id ? { ...p, connected: false } : p));
    }
  };

  const confirmAuth = () => {
    if (!authModal) return;
    const { id, name } = authModal.platform;
    
    // Determine the actual OAuth URL for the selected platform
    let authUrl = '';
    if (id === 'twitter') authUrl = 'https://twitter.com/i/flow/login';
    else if (id === 'instagram') authUrl = 'https://www.instagram.com/accounts/login/';
    else if (id === 'tiktok') authUrl = 'https://www.tiktok.com/login';
    else if (id === 'snapchat') authUrl = 'https://accounts.snapchat.com/';
    
    // Simulate real OAuth redirection by opening a small popup window
    const popup = window.open(authUrl, `Connect ${name}`, 'width=500,height=600,left=300,top=100');
    
    setAuthModal(null);
    setPlatforms(platforms.map(p => p.id === id ? { ...p, loading: true } : p));
    
    // Simulate the time it takes for the user to login and approve the app
    setTimeout(() => {
      // Close the popup window automatically after login simulation
      if (popup && (!popup.closed)) {
        popup.close();
      }
      
      // Update the UI to reflect successful connection and data fetch
      setPlatforms(platforms.map(p => p.id === id ? { 
        ...p, 
        connected: true, 
        loading: false,
        followers: Math.floor(Math.random() * 50) + 10 + 'K',
        engagement: '+' + (Math.random() * 5 + 2).toFixed(1) + '%'
      } : p));
      
      // Add a simulated post showing it merged into our app
      setPosts(prev => [
        {
          id: Date.now() + Math.random(),
          type: id === 'tiktok' || id === 'snapchat' ? 'video' : 'post',
          platform: name,
          status: 'published',
          date: new Date().toISOString().split('T')[0],
          content: (isRtl ? 'تم الربط وجلب هذا المنشور من حسابك في ' : 'Data synced from your account in ') + name + ' بنجاح! 🚀',
          views: (Math.random() * 100).toFixed(1) + 'K',
          likes: (Math.random() * 10).toFixed(1) + 'K'
        },
        ...prev
      ]);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20 mt-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">
              {isRtl ? 'إدارة السوشيال ميديا' : 'Social Dashboard'}
            </h1>
            <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              LIVE
            </div>
          </div>
          <p className="text-slate-400 font-medium">
            {isRtl ? 'تتبع حملاتك، إدارة الحسابات، وجدولة البوستات' : 'Track campaigns, manage accounts, and schedule posts'}
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="btn-premium px-6 py-3 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span className="font-black uppercase tracking-widest text-xs">{isRtl ? 'مزامنة البيانات' : 'Sync Data'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map(platform => (
          <div key={platform.id} className="glass-panel p-6 relative group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${platform.bg} ${platform.border} border`}>
                <platform.icon className={`w-6 h-6 ${platform.color}`} />
              </div>
              <button 
                onClick={() => requestConnection(platform.id)}
                disabled={platform.loading}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${platform.connected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10'}`}
              >
                {platform.loading && <Loader2 className="w-3 h-3 animate-spin" />}
                {platform.loading ? (isRtl ? 'جاري الربط...' : 'Connecting...') : platform.connected ? (isRtl ? 'متصل' : 'Connected') : (isRtl ? 'ربط' : 'Connect')}
              </button>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{platform.name}</h3>
              {platform.connected ? (
                <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold">{isRtl ? 'المتابعين' : 'Followers'}</span>
                    <span className="text-sm text-white font-black">{platform.followers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold">{isRtl ? 'التفاعل' : 'Engagement'}</span>
                    <span className="text-sm text-emerald-400 font-black">{platform.engagement}</span>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-xs text-slate-500">{isRtl ? 'غير متصل بالمنصة. اضغط لربط الحساب ومزامنة البيانات.' : 'Not connected. Click to link account and sync data.'}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Stats */}
        <div className="lg:col-span-2 glass-panel p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white">{isRtl ? 'أداء الحملات الإعلانية' : 'Campaign Performance'}</h3>
            <select className="bg-slate-900 border border-white/10 text-slate-300 text-xs font-bold rounded-lg px-4 py-2 outline-none">
              <option>{isRtl ? 'هذا الأسبوع' : 'This Week'}</option>
              <option>{isRtl ? 'هذا الشهر' : 'This Month'}</option>
            </select>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{isRtl ? 'المشاهدات' : 'Views'}</span>
              </div>
              <div className="text-2xl font-black text-white">124.5K</div>
              <div className="text-emerald-400 text-[10px] font-bold mt-1">+12.4% {isRtl ? 'عن الأسبوع الماضي' : 'vs last week'}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{isRtl ? 'التفاعل' : 'Engagement'}</span>
              </div>
              <div className="text-2xl font-black text-white">18.2K</div>
              <div className="text-emerald-400 text-[10px] font-bold mt-1">+8.1% {isRtl ? 'عن الأسبوع الماضي' : 'vs last week'}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{isRtl ? 'النقرات' : 'Clicks'}</span>
              </div>
              <div className="text-2xl font-black text-white">4,209</div>
              <div className="text-emerald-400 text-[10px] font-bold mt-1">+15.3% {isRtl ? 'عن الأسبوع الماضي' : 'vs last week'}</div>
            </div>
          </div>
          
          <div className="h-48 border-b border-t border-white/5 flex items-end justify-between px-4 pb-4 pt-8 shrink-0 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-50 pointer-events-none" />
            {/* Fake chart bars */}
            {[40, 70, 45, 90, 60, 85, 50].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-12 group">
                <div className="w-full bg-blue-500/20 hover:bg-blue-500/40 rounded-t-lg transition-all relative" style={{ height: `${h}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold pointer-events-none">
                    {h * 123}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts List */}
        <div className="glass-panel p-8 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <h3 className="text-xl font-black text-white">{isRtl ? 'أحدث المنشورات' : 'Recent Posts'}</h3>
            <button className="text-blue-400 text-xs font-bold hover:text-blue-300 transition-colors uppercase tracking-widest">
              {isRtl ? 'عرض الكل' : 'View All'}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {posts.length > 0 ? posts.map((post: any, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-white/10 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                      {post.type === 'video' ? <Smartphone className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider shadow-sm">{post.platform}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{post.date}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded ${post.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {post.status === 'published' ? (isRtl ? 'تم النشر' : 'Published') : (isRtl ? 'مجدول' : 'Scheduled')}
                  </div>
                </div>
                <p className="text-sm text-slate-300 italic mb-4 line-clamp-2 leading-relaxed">"{post.content}"</p>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {post.views}</span>
                  <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> {post.likes}</span>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 pb-10">
                <Layers className="w-12 h-12 text-slate-600" />
                <p className="text-xs font-bold text-slate-400 leading-relaxed max-w-[200px]">
                  {isRtl ? 'لم تقم بنشر أي شيء بعد عبر المنصة. قم بإنشاء محتوى ونشره من منشئ المحتوى.' : 'No posts published yet. Create and publish content from the Content Creator tool.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setAuthModal(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`relative w-full max-w-md bg-slate-900 border ${authModal.platform.border} rounded-3xl p-8 shadow-2xl overflow-hidden`}
          >
            <div className={`absolute top-0 left-0 right-0 h-2 ${authModal.platform.bg}`} />
            
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${authModal.platform.bg} border ${authModal.platform.border}`}>
                <authModal.platform.icon className={`w-7 h-7 ${authModal.platform.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{isRtl ? 'ربط الحساب' : 'Connect Account'}</h3>
                <p className="text-sm font-bold text-slate-400">{authModal.platform.name}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {isRtl 
                  ? `يطلب تطبيق PASlytics الصلاحيات التالية للوصول إلى حسابك في ${authModal.platform.name}:` 
                  : `PASlytics is requesting the following permissions for your ${authModal.platform.name} account:`}
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{isRtl ? 'الاطلاع على المتابعين والإحصائيات' : 'View followers and analytics'}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{isRtl ? 'نشر المحتوى والفيديوهات مباشرة' : 'Publish content and videos directly'}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{isRtl ? 'قراءة بيانات الحملات الإعلانية' : 'Read ad campaign data'}</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-400 opacity-60">
                  <Lock className="w-5 h-5 shrink-0" />
                  <span>{isRtl ? 'لا يمكننا تغيير كلمة المرور أو الإعدادات الخاصة بك' : 'We cannot change your password or settings'}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 mb-8">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-400/90 font-medium leading-relaxed">
                {isRtl 
                  ? 'من خلال النقر على "منح الصلاحية وتسجيل الدخول"، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا.' 
                  : 'By clicking "Grant Access & Login", you agree to our Terms of Service and Privacy Policy.'}
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setAuthModal(null)}
                className="flex-1 py-3 px-4 rounded-xl font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={confirmAuth}
                className={`flex-[2] py-3 px-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${authModal.platform.bg} border ${authModal.platform.border} ${authModal.platform.color} hover:brightness-125 transition-all outline-none`}
              >
                <Globe className="w-4 h-4" />
                {isRtl ? 'منح الصلاحية وتسجيل الدخول' : 'Grant Access & Login'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SocialDashboard;
