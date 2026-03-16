import { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  AlertTriangle, 
  DollarSign, 
  ShieldCheck, 
  BarChart3, 
  Lightbulb, 
  ChevronRight,
  Zap
} from 'lucide-react';

const ProductCalculatorPage = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const [baseCost, setBaseCost] = useState<string>('');
  const [duties, setDuties] = useState<string>('5');
  const [profitMargin, setProfitMargin] = useState<string>('30');
  const [marketingBudget, setMarketingBudget] = useState<string>('');
  const [competitionLevel, setCompetitionLevel] = useState<'low' | 'medium' | 'high'>('medium');

  const calculations = useMemo(() => {
    const base = parseFloat(baseCost) || 0;
    const dutyPercent = parseFloat(duties) || 0;
    const profitPercent = parseFloat(profitMargin) || 0;
    const marketing = parseFloat(marketingBudget) || 0;

    const dutyAmount = base * (dutyPercent / 100);
    const landedCost = base + dutyAmount;
    const profitAmount = landedCost * (profitPercent / 100);
    const finalPrice = landedCost + profitAmount + marketing;

    // Risk Assessment Logic
    let riskLevel: 'Safe' | 'Moderate' | 'High' = 'Moderate';
    let riskScore = 0;

    if (profitPercent < 15) riskScore += 30;
    if (competitionLevel === 'high') riskScore += 40;
    if (competitionLevel === 'medium') riskScore += 20;
    if (marketing < base * 0.1) riskScore += 10;

    if (riskScore < 30) riskLevel = 'Safe';
    else if (riskScore < 60) riskLevel = 'Moderate';
    else riskLevel = 'High';

    return {
      landedCost,
      profitAmount,
      finalPrice,
      riskLevel,
      riskScore
    };
  }, [baseCost, duties, profitMargin, marketingBudget, competitionLevel]);

  const suggestions = useMemo(() => {
    const s = [];
    if (parseFloat(profitMargin) < 20) {
      s.push(isRtl ? 'هامش الربح منخفض جداً. حاول تقليل تكاليف الاستيراد أو زيادة سعر البيع.' : 'Profit margin is too low. Try reducing import costs or increasing selling price.');
    }
    if (competitionLevel === 'high') {
      s.push(isRtl ? 'المنافسة عالية. ركز على التميز في الجودة وخدمة العملاء بدلاً من السعر فقط.' : 'Competition is high. Focus on quality and customer service differentiation rather than just price.');
    }
    if (parseFloat(marketingBudget) < (parseFloat(baseCost) || 0) * 0.1) {
      s.push(isRtl ? 'ميزانية التسويق قد لا تكفي لاختراق السوق. خصص 15-20% على الأقل للاطلاق.' : 'Marketing budget might be insufficient. Allocate at least 15-20% for the launch phase.');
    }
    if (s.length === 0) {
      s.push(isRtl ? 'استراتيجية التسعير تبدو متوازنة. راقب ردود فعل السوق بعد الاطلاق.' : 'Pricing strategy looks balanced. Monitor market feedback after launch.');
    }
    return s;
  }, [profitMargin, competitionLevel, marketingBudget, baseCost, isRtl]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 max-w-7xl mx-auto min-h-screen ${isRtl ? 'font-arabic' : ''}`}
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
            <Calculator className="text-blue-400 w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            {t('product_calculator')}
          </h1>
        </div>
        <p className="text-slate-400 text-lg">
          {isRtl ? 'حلل تكاليفك، وحقق أرباحك، وواجه مخاطر السوق بذكاء.' : 'Analyze your costs, secure your profits, and navigate market risks intelligently.'}
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left: Input Panel */}
        <div className="xl:col-span-1 space-y-6">
          <div className="glass-panel p-8 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <DollarSign className="w-3 h-3" />
                {t('pc_base_cost')}
              </label>
              <div className="relative group">
                <input 
                  type="number" 
                  value={baseCost} 
                  onChange={(e) => setBaseCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-xl text-white font-mono focus:border-blue-500/50 outline-none transition-all shadow-inner"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 font-bold">$</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('pc_duties')} (%)</label>
                <input 
                  type="number" 
                  value={duties} 
                  onChange={(e) => setDuties(e.target.value)}
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-white font-mono focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('pc_profit_margin')} (%)</label>
                <input 
                  type="number" 
                  value={profitMargin} 
                  onChange={(e) => setProfitMargin(e.target.value)}
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-white font-mono focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">{t('marketing')} ($)</label>
              <input 
                type="number" 
                value={marketingBudget} 
                onChange={(e) => setMarketingBudget(e.target.value)}
                placeholder="0.00"
                className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-white font-mono focus:border-blue-500/50 outline-none transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                {isRtl ? 'مستوى منافسة السوق' : 'Market Competition Level'}
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setCompetitionLevel(level)}
                    className={`
                      flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                      ${competitionLevel === level 
                        ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                        : 'bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10'}
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 bg-blue-500/5 border-blue-500/20">
             <div className="flex items-center gap-3 text-blue-400 mb-4">
               <ShieldCheck className="w-5 h-5" />
               <h4 className="font-black uppercase tracking-widest text-xs">Premium Insights</h4>
             </div>
             <p className="text-slate-400 text-sm leading-relaxed">
               {isRtl ? 'تعتمد هذه الحاسبة على نموذج تسعير PAS المتقدم لضمان تغطية جميع التكاليف الخفية.' : 'This calculator is based on the advanced PAS pricing model to ensure all hidden costs are covered.'}
             </p>
          </div>
        </div>

        {/* Center/Right: Results & Analysis */}
        <div className="xl:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Price Result */}
            <div className="glass-panel p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t('pc_final_price')}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-white tracking-tighter">${calculations.finalPrice.toFixed(2)}</span>
                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">/ {isRtl ? 'وحدة' : 'Unit'}</span>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{isRtl ? 'تكلفة الهبوط' : 'Landed Cost'}</div>
                  <div className="text-white font-bold font-mono">${calculations.landedCost.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{isRtl ? 'هامش الربح' : 'Profit Margin'}</div>
                  <div className="text-green-400 font-bold font-mono">${calculations.profitAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="glass-panel p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {isRtl ? 'تقييم مخاطر المنافسة' : 'Competition Risk Assessment'}
                  </div>
                  <AlertTriangle className={`w-5 h-5 ${
                    calculations.riskLevel === 'Safe' ? 'text-emerald-500' :
                    calculations.riskLevel === 'Moderate' ? 'text-amber-500' : 'text-rose-500'
                  }`} />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`
                    px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                    ${calculations.riskLevel === 'Safe' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' :
                      calculations.riskLevel === 'Moderate' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 
                      'bg-rose-500/10 border-rose-500/50 text-rose-400'}
                  `}>
                    {calculations.riskLevel} Risk
                  </div>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                   {isRtl 
                     ? `بناءً على السوق، تم تقييم مشروعك بدرجة مخاطرة ${calculations.riskScore}/100.`
                     : `Based on current market signals, your project is rated at ${calculations.riskScore}/100 risk.`
                   }
                </p>
              </div>
              
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-6">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${calculations.riskScore}%` }}
                  className={`h-full ${
                    calculations.riskLevel === 'Safe' ? 'bg-emerald-500' :
                    calculations.riskLevel === 'Moderate' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="glass-panel p-10 border-none bg-gradient-to-br from-white/5 to-white/[0.01]">
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <Lightbulb className="text-amber-400 w-6 h-6" />
              {isRtl ? 'حلول ومقترحات عملية' : 'Practical Solutions & Suggestions'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {suggestions.map((suggestion, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-slate-950/40 border border-white/5 rounded-2xl flex gap-4 hover:border-blue-500/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-slate-300 font-medium leading-relaxed m-0 text-sm">
                    {suggestion}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Future Growth Card (Bento style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 glass-panel p-8 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-all overflow-hidden relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500/50" />
              <div>
                <h4 className="text-white font-black uppercase tracking-widest text-xs mb-1">{isRtl ? 'تقرير المنافسة الكامل' : 'Full Competition Report'}</h4>
                <p className="text-slate-500 text-sm m-0">{isRtl ? 'احصل على تحليل شامل للمنافسين في سوقك.' : 'Get a comprehensive analysis of competitors in your market.'}</p>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
            </div>
            
            <div className="glass-panel p-8 bg-brand-primary flex flex-col justify-center items-center text-center group transition-transform hover:scale-[1.02]">
               <BarChart3 className="text-white w-10 h-10 mb-4" />
               <h4 className="text-white font-black text-lg mb-0">{isRtl ? 'محاكاة الأرباح' : 'Profit Simulation'}</h4>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default ProductCalculatorPage;
