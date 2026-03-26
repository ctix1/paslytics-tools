import { useState, useEffect, useCallback, useRef } from 'react';
import { 
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
  CheckCircle2,
  RefreshCw,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { syncAllPlatforms, type CampaignStats, type PlatformPost } from '../lib/social-api-service';

const SocialDashboard = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const hasSyncedRef = useRef(false);
  
  const [platforms, setPlatforms] = useState([
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20', connected: true, loading: false, syncing: false, followers: '—', engagement: '—' },
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'text-slate-200', bg: 'bg-slate-200/10', border: 'border-slate-200/20', connected: true, loading: false, syncing: false, followers: '—', engagement: '—' },
    { id: 'tiktok', name: 'TikTok', icon: Smartphone, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', connected: false, loading: false, syncing: false, followers: '0', engagement: '0%' },
    { id: 'snapchat', name: 'Snapchat', icon: MessageCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', connected: false, loading: false, syncing: false, followers: '0', engagement: '0%' },
  ]);

  const [authModal, setAuthModal] = useState<{ isOpen: boolean, platform: any } | null>(null);
  const [posts, setPosts] = useState<PlatformPost[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [campaignStats, setCampaignStats] = useState<CampaignStats>({
    totalViews: '—',
    viewsChange: '—',
    totalEngagement: '—',
    engagementChange: '—',
    totalClicks: '—',
    clicksChange: '—',
    chartData: [30, 30, 30, 30, 30, 30, 30]
  });

  // Dynamic sync handler that fetches from each connected platform
  const handleSyncData = useCallback(async () => {
    const connectedPlatforms = platforms.filter(p => p.connected);
    if (connectedPlatforms.length === 0 || isSyncing) return;

    setIsSyncing(true);

    try {
      const result = await syncAllPlatforms(
        connectedPlatforms.map(p => ({ id: p.id, name: p.name })),
        // onPlatformStart — show spinner on specific platform card
        (id) => {
          setPlatforms(prev => prev.map(p => p.id === id ? { ...p, syncing: true } : p));
        },
        // onPlatformComplete — update that platform's stats and stop its spinner
        (id, profile) => {
          setPlatforms(prev => prev.map(p => p.id === id ? {
            ...p,
            syncing: false,
            followers: profile.followers,
            engagement: profile.engagement
          } : p));
        },
        // onError
        (id) => {
          setPlatforms(prev => prev.map(p => p.id === id ? { ...p, syncing: false } : p));
        }
      );

      // Update posts and campaign stats with fetched data
      setPosts(result.posts.slice(0, 15));
      setCampaignStats(result.campaignStats);
      setLastSyncTime(new Date());

      // Success toast
      const toast = document.createElement('div');
      toast.className = `fixed top-8 ${isRtl ? 'left-8' : 'right-8'} glass-panel px-8 py-5 border-emerald-500/50 bg-emerald-500/20 text-emerald-400 font-black uppercase tracking-widest text-xs z-[200] animate-slideDown flex items-center gap-4`;
      toast.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ${isRtl ? `تم مزامنة ${connectedPlatforms.length} منصات بنجاح!` : `${connectedPlatforms.length} platforms synced successfully!`}`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [platforms, isSyncing, isRtl]);

  // Auto-sync on mount
  useEffect(() => {
    if (!hasSyncedRef.current) {
      hasSyncedRef.current = true;
      const hasConnected = platforms.some(p => p.connected);
      if (hasConnected) {
        // Small delay so user can see the page load first
        const timer = setTimeout(() => handleSyncData(), 500);
        return () => clearTimeout(timer);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper: time-ago string
  const getTimeSinceSync = () => {
    if (!lastSyncTime) return isRtl ? 'لم تتم المزامنة بعد' : 'Not synced yet';
    const diff = Math.floor((Date.now() - lastSyncTime.getTime()) / 1000);
    if (diff < 60) return isRtl ? 'الآن' : 'Just now';
    const mins = Math.floor(diff / 60);
    if (mins < 60) return isRtl ? `منذ ${mins} دقيقة` : `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return isRtl ? `منذ ${hrs} ساعة` : `${hrs}h ago`;
  };

  const requestConnection = (id: string) => {
    const platform = platforms.find(p => p.id === id);
    if (!platform?.connected) {
      setAuthModal({ isOpen: true, platform });
    } else {
      // Disconnect: clear cached data
      localStorage.removeItem(`paslytics_social_${id}_profile`);
      setPlatforms(platforms.map(p => p.id === id ? { ...p, connected: false, followers: '0', engagement: '0%' } : p));
    }
  };

  const confirmAuth = () => {
    if (!authModal) return;
    const { id, name } = authModal.platform;
    
    let authUrl = '';
    if (id === 'twitter') authUrl = 'https://twitter.com/i/flow/login';
    else if (id === 'instagram') authUrl = 'https://www.instagram.com/accounts/login/';
    else if (id === 'tiktok') authUrl = 'https://www.tiktok.com/login';
    else if (id === 'snapchat') authUrl = 'https://accounts.snapchat.com/';
    
    const popup = window.open(authUrl, `Connect ${name}`, 'width=500,height=600,left=300,top=100');
    
    setAuthModal(null);
    setPlatforms(platforms.map(p => p.id === id ? { ...p, loading: true } : p));
    
    const completeConnection = () => {
      setPlatforms(prevList => {
        const updated = prevList.map(p => p.id === id ? { 
          ...p, 
          connected: true, 
          loading: false,
          followers: '—',
          engagement: '—'
        } : p);
        // Auto-sync after connecting a new platform
        setTimeout(() => handleSyncData(), 300);
        return updated;
      });
    };

    const checkClosed = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkClosed);
        completeConnection();
      }
    }, 1000);

    setTimeout(() => {
      if (popup && (!popup.closed)) {
        popup.close();
      }
      clearInterval(checkClosed);
      completeConnection();
    }, 60000);
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
        
        <div className="flex items-center gap-4">
          {/* Last Sync Time */}
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{getTimeSinceSync()}</span>
          </div>

          <button 
            onClick={handleSyncData}
            disabled={isSyncing}
            className="btn-premium px-6 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span className="font-black uppercase tracking-widest text-xs">{isSyncing ? (isRtl ? 'جاري المزامنة...' : 'Syncing...') : (isRtl ? 'مزامنة البيانات' : 'Sync Data')}</span>
          </button>
        </div>
      </div>

      {/* Grid of Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map(platform => (
          <div key={platform.id} className={`glass-panel p-6 relative group overflow-hidden transition-all ${platform.syncing ? 'border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : ''}`}>
            {/* Syncing overlay indicator */}
            {platform.syncing && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 origin-left"
              />
            )}

            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${platform.bg} ${platform.border} border relative`}>
                <platform.icon className={`w-6 h-6 ${platform.color}`} />
                {platform.syncing && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Loader2 className="w-2.5 h-2.5 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button 
                onClick={() => requestConnection(platform.id)}
                disabled={platform.loading || platform.syncing}
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
                    <span className={`text-sm font-black transition-all ${platform.syncing ? 'text-blue-400 animate-pulse' : 'text-white'}`}>
                      {platform.syncing ? '...' : platform.followers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold">{isRtl ? 'التفاعل' : 'Engagement'}</span>
                    <span className={`text-sm font-black transition-all ${platform.syncing ? 'text-blue-400 animate-pulse' : 'text-emerald-400'}`}>
                      {platform.syncing ? '...' : platform.engagement}
                    </span>
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
        {/* Campaign Stats — Dynamic */}
        <div className="lg:col-span-2 glass-panel p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white">{isRtl ? 'أداء الحملات الإعلانية' : 'Campaign Performance'}</h3>
            <div className="flex items-center gap-3">
              {isSyncing && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
              <select className="bg-slate-900 border border-white/10 text-slate-300 text-xs font-bold rounded-lg px-4 py-2 outline-none">
                <option>{isRtl ? 'هذا الأسبوع' : 'This Week'}</option>
                <option>{isRtl ? 'هذا الشهر' : 'This Month'}</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{isRtl ? 'المشاهدات' : 'Views'}</span>
              </div>
              <div className={`text-2xl font-black transition-all ${campaignStats.totalViews === '—' ? 'text-slate-600' : 'text-white'}`}>
                {campaignStats.totalViews}
              </div>
              <div className="text-emerald-400 text-[10px] font-bold mt-1">
                {campaignStats.viewsChange !== '—' ? `${campaignStats.viewsChange} ${isRtl ? 'عن الأسبوع الماضي' : 'vs last week'}` : ''}
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{isRtl ? 'التفاعل' : 'Engagement'}</span>
              </div>
              <div className={`text-2xl font-black transition-all ${campaignStats.totalEngagement === '—' ? 'text-slate-600' : 'text-white'}`}>
                {campaignStats.totalEngagement}
              </div>
              <div className="text-emerald-400 text-[10px] font-bold mt-1">
                {campaignStats.engagementChange !== '—' ? `${campaignStats.engagementChange} ${isRtl ? 'عن الأسبوع الماضي' : 'vs last week'}` : ''}
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-slate-400">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{isRtl ? 'النقرات' : 'Clicks'}</span>
              </div>
              <div className={`text-2xl font-black transition-all ${campaignStats.totalClicks === '—' ? 'text-slate-600' : 'text-white'}`}>
                {campaignStats.totalClicks}
              </div>
              <div className="text-emerald-400 text-[10px] font-bold mt-1">
                {campaignStats.clicksChange !== '—' ? `${campaignStats.clicksChange} ${isRtl ? 'عن الأسبوع الماضي' : 'vs last week'}` : ''}
              </div>
            </div>
          </div>
          
          {/* Dynamic Chart */}
          <div className="h-48 border-b border-t border-white/5 flex items-end justify-between px-4 pb-4 pt-8 shrink-0 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-50 pointer-events-none" />
            {campaignStats.chartData.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-12 group">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                  className="w-full bg-blue-500/20 hover:bg-blue-500/40 rounded-t-lg transition-colors relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold pointer-events-none">
                    {Math.floor(h * 123)}
                  </div>
                </motion.div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts List — Dynamic */}
        <div className="glass-panel p-8 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <h3 className="text-xl font-black text-white">{isRtl ? 'أحدث المنشورات' : 'Recent Posts'}</h3>
            <button className="text-blue-400 text-xs font-bold hover:text-blue-300 transition-colors uppercase tracking-widest">
              {isRtl ? 'عرض الكل' : 'View All'}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {isSyncing && posts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pb-10">
                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest animate-pulse">
                  {isRtl ? 'جاري جلب المنشورات من المنصات...' : 'Fetching posts from platforms...'}
                </p>
              </div>
            ) : posts.length > 0 ? posts.map((post: any, idx: number) => (
              <motion.div
                key={post.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-white/10 transition-colors group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                      {post.type === 'video' || post.type === 'reel' ? <Smartphone className="w-4 h-4" /> : post.type === 'story' ? <Eye className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
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
              </motion.div>
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
