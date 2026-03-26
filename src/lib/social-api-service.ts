/**
 * Social Media API Service
 * Simulates real API calls to fetch data from connected social media platforms.
 * Each platform has its own data templates and realistic content generation.
 */

// ---------- Types ----------
export interface PlatformProfile {
  followers: string;
  following: string;
  engagement: string;
  postsCount: number;
  impressions: string;
  reach: string;
}

export interface PlatformPost {
  id: number;
  type: 'video' | 'post' | 'story' | 'reel';
  platform: string;
  status: 'published' | 'scheduled';
  date: string;
  content: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
}

export interface CampaignStats {
  totalViews: string;
  viewsChange: string;
  totalEngagement: string;
  engagementChange: string;
  totalClicks: string;
  clicksChange: string;
  chartData: number[];
}

// ---------- Helpers ----------
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max));
const formatK = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toString();
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const randomDate = (daysBack: number) => {
  const d = new Date();
  d.setDate(d.getDate() - randInt(0, daysBack));
  return d.toISOString().split('T')[0];
};

// ---------- Platform-Specific Content Templates ----------
const PLATFORM_CONTENT: Record<string, { types: ('video' | 'post' | 'story' | 'reel')[], posts: string[] }> = {
  instagram: {
    types: ['reel', 'post', 'story'],
    posts: [
      '✨ جربت المنتج هذا وكان الفرق واضح من أول استخدام! شاركوني تجاربكم 💬 #تجربتي #منتجات',
      '🎬 ريل جديد! كيف تبدأ يومك بطاقة إيجابية 🌅 الروتين الصباحي اللي غيّر حياتي #morningroutine',
      '📸 لقطة من وراء الكواليس.. التصوير اليوم كان شي ثاني 🔥 #behindthescenes #محتوى',
      '💡 نصيحة اليوم: لا تستخدم الفلاتر الزائدة.. خلك طبيعي والناس تحبك 🫶 #نصائح_محتوى',
      '🛍️ وصلتني شحنة جديدة من المنتجات.. افتحوها معي! 📦 #unboxing #تسوق',
    ]
  },
  twitter: {
    types: ['post', 'post', 'video'],
    posts: [
      '🔥 ثريد: أهم 5 أدوات لصناعة المحتوى في 2026.. خلوا اللايك وتابعوا 🧵👇',
      'الكونتنت اللي يطلع من القلب.. يوصل للقلب ❤️ بسيطة كذا',
      '📊 نتائج الحملة الأخيرة: +340% تفاعل.. السر؟ الأصالة مو الكمال ✨',
      'يا جماعة اللي يبي يبدأ صناعة محتوى.. ابدأ بجوالك، لا تنتظر الكاميرا الغالية 📱',
      'RT لو توافقني: المحتوى العربي يستاهل أكثر من اللي يحصله حالياً 🌍🇸🇦',
    ]
  },
  tiktok: {
    types: ['video', 'video', 'video'],
    posts: [
      '🎵 تيك توك فايرل! كيف سويت الترنزيشن هذا بثانيتين بس 🤯 #fyp #ترند',
      '😂 لما تحاول تشرح لأهلك إنك صانع محتوى مو قاعد "تلعب بجوالك" 📱 #relatable',
      '🏆 تحدي الأسبوع! جربوا هالحركة وتاقوني 👇 #تحدي #challenge',
      '💰 كيف كسبت أول مبلغ من صناعة المحتوى.. القصة كاملة ⬇️ #storytime',
      '🎥 POV: أول يوم لك كصانع محتوى VS بعد سنة 😅➡️😎 #محتوى #تطور',
    ]
  },
  snapchat: {
    types: ['story', 'video', 'story'],
    posts: [
      '👻 سناب حصري: يومي الكامل من الصبح للليل.. كل شي بالتفصيل 📍',
      '🔥 ستوري جديدة: وش اللي ممكن تسويه بـ 10 ريال بس؟ النتيجة صدمتني!',
      '📍 سبوت لايت: أحلى كافيهات الرياض اللي لازم تزورها هالويكند ☕',
      '🎁 مسابقة على السناب! صورو سنابكم وأحسن واحد يفوز بجائزة 🏅',
      '😱 كواليس التصوير اللي ما يشوفها أحد.. الجانب اللي ما نعرضه عادة 🎬',
    ]
  }
};

// ---------- API Functions ----------

/**
 * Fetch profile data for a specific platform
 * Simulates a real API call with network delay
 */
export const fetchPlatformProfile = async (platformId: string): Promise<PlatformProfile> => {
  await delay(randInt(800, 1500));

  // Check for cached data (to maintain consistency between syncs)
  const cacheKey = `paslytics_social_${platformId}_profile`;
  const cached = localStorage.getItem(cacheKey);
  let baseFollowers: number;
  let baseEngagement: number;

  if (cached) {
    const prev = JSON.parse(cached);
    // Grow slightly from previous values (simulating real growth)
    baseFollowers = parseFloat(prev.rawFollowers) + rand(50, 500);
    baseEngagement = Math.min(15, parseFloat(prev.rawEngagement) + rand(-0.3, 0.5));
  } else {
    // First sync: generate realistic starting values per platform
    const platformDefaults: Record<string, { followers: [number, number], engagement: [number, number] }> = {
      instagram: { followers: [8000, 45000], engagement: [3.5, 8.2] },
      twitter: { followers: [5000, 30000], engagement: [1.8, 5.5] },
      tiktok: { followers: [15000, 120000], engagement: [5.0, 15.0] },
      snapchat: { followers: [3000, 25000], engagement: [4.0, 9.0] },
    };
    const defaults = platformDefaults[platformId] || { followers: [5000, 30000], engagement: [2, 6] };
    baseFollowers = rand(defaults.followers[0], defaults.followers[1]);
    baseEngagement = rand(defaults.engagement[0], defaults.engagement[1]);
  }

  const profile: PlatformProfile = {
    followers: formatK(Math.floor(baseFollowers)),
    following: formatK(randInt(200, 2000)),
    engagement: '+' + baseEngagement.toFixed(1) + '%',
    postsCount: randInt(50, 500),
    impressions: formatK(Math.floor(baseFollowers * rand(2, 5))),
    reach: formatK(Math.floor(baseFollowers * rand(1.2, 3)))
  };

  // Cache raw values for next sync
  localStorage.setItem(cacheKey, JSON.stringify({
    rawFollowers: baseFollowers,
    rawEngagement: baseEngagement,
    timestamp: Date.now()
  }));

  return profile;
};

/**
 * Fetch recent posts for a specific platform
 * Returns platform-specific content
 */
export const fetchPlatformPosts = async (platformId: string, platformName: string): Promise<PlatformPost[]> => {
  await delay(randInt(600, 1200));

  const templates = PLATFORM_CONTENT[platformId] || PLATFORM_CONTENT.instagram;

  // Generate 2-4 recent posts per platform
  const postCount = randInt(2, 5);
  const posts: PlatformPost[] = [];

  for (let i = 0; i < postCount; i++) {
    const contentIndex = randInt(0, templates.posts.length);
    posts.push({
      id: Date.now() + i + Math.random() * 1000,
      type: templates.types[i % templates.types.length],
      platform: platformName,
      status: Math.random() > 0.2 ? 'published' : 'scheduled',
      date: randomDate(14),
      content: templates.posts[contentIndex],
      views: formatK(randInt(500, 150000)),
      likes: formatK(randInt(100, 30000)),
      comments: formatK(randInt(10, 5000)),
      shares: formatK(randInt(5, 2000))
    });
  }

  return posts;
};

/**
 * Fetch aggregated campaign stats across all connected platforms
 */
export const fetchCampaignStats = async (connectedPlatformIds: string[]): Promise<CampaignStats> => {
  await delay(randInt(500, 1000));

  const platformCount = Math.max(1, connectedPlatformIds.length);

  // Generate realistic aggregate stats based on number of connected platforms
  const baseViews = randInt(50000, 200000) * platformCount;
  const baseEngagement = randInt(8000, 40000) * platformCount;
  const baseClicks = randInt(1500, 8000) * platformCount;

  // Generate chart data (7 days)
  const chartData = Array.from({ length: 7 }, () => randInt(25, 95));

  return {
    totalViews: formatK(baseViews),
    viewsChange: '+' + rand(5, 25).toFixed(1) + '%',
    totalEngagement: formatK(baseEngagement),
    engagementChange: '+' + rand(3, 15).toFixed(1) + '%',
    totalClicks: new Intl.NumberFormat().format(baseClicks),
    clicksChange: '+' + rand(5, 20).toFixed(1) + '%',
    chartData
  };
};

/**
 * Full sync: Fetch all data for all connected platforms
 * Calls onProgress callback for each platform as it completes
 */
export const syncAllPlatforms = async (
  connectedPlatforms: { id: string; name: string }[],
  onPlatformStart: (id: string) => void,
  onPlatformComplete: (id: string, profile: PlatformProfile, posts: PlatformPost[]) => void,
  onError: (id: string, error: string) => void
): Promise<{ posts: PlatformPost[]; campaignStats: CampaignStats }> => {
  const allPosts: PlatformPost[] = [];

  // Fetch each platform sequentially for visual feedback
  for (const platform of connectedPlatforms) {
    onPlatformStart(platform.id);
    try {
      const [profile, posts] = await Promise.all([
        fetchPlatformProfile(platform.id),
        fetchPlatformPosts(platform.id, platform.name)
      ]);
      allPosts.push(...posts);
      onPlatformComplete(platform.id, profile, posts);
    } catch (err) {
      onError(platform.id, String(err));
    }
  }

  // Fetch aggregated campaign stats
  const campaignStats = await fetchCampaignStats(connectedPlatforms.map(p => p.id));

  // Sort posts by date (most recent first)
  allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Persist to localStorage (merge with any Content Creator published posts)
  const existingPublished = JSON.parse(localStorage.getItem('paslytics_published_posts') || '[]');
  const mergedPosts = [...allPosts, ...existingPublished].slice(0, 20);
  localStorage.setItem('paslytics_published_posts', JSON.stringify(mergedPosts));

  return { posts: mergedPosts, campaignStats };
};
