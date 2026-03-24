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
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const SocialDashboard = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  
  const [platforms, setPlatforms] = useState([
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20', connected: true },
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'text-slate-200', bg: 'bg-slate-200/10', border: 'border-slate-200/20', connected: true },
    { id: 'tiktok', name: 'TikTok', icon: Smartphone, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', connected: false },
    { id: 'snapchat', name: 'Snapchat', icon: MessageCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', connected: false },
  ]);

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

  const toggleConnection = (id: string) => {
    setPlatforms(platforms.map(p => p.id === id ? { ...p, connected: !p.connected } : p));
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
                onClick={() => toggleConnection(platform.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${platform.connected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'}`}
              >
                {platform.connected ? (isRtl ? 'متصل' : 'Connected') : (isRtl ? 'ربط' : 'Connect')}
              </button>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{platform.name}</h3>
              {platform.connected ? (
                <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold">{isRtl ? 'المتابعين' : 'Followers'}</span>
                    <span className="text-sm text-white font-black">12.5K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold">{isRtl ? 'التفاعل' : 'Engagement'}</span>
                    <span className="text-sm text-emerald-400 font-black">+4.2%</span>
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
    </div>
  );
};

export default SocialDashboard;
