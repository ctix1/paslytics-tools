import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Target, 
  Lightbulb, 
  BarChart3,
  ArrowRight,
  Sparkles,
  Info,
  ChevronRight,
  Package,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCalculator: React.FC = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const [productCost, setProductCost] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [adSpend, setAdSpend] = useState<number>(0);
  const [otherCosts, setOtherCosts] = useState<number>(0);
  const [conversionRate, setConversionRate] = useState<number>(2);
  const [visitors, setVisitors] = useState<number>(1000);

  // Calculations
  const totalCost = productCost + shippingCost + adSpend + otherCosts;
  const grossProfit = sellingPrice - (productCost + shippingCost + otherCosts);
  const netProfit = sellingPrice - totalCost;
  const breakEvenROAS = sellingPrice / grossProfit || 0;
  const marginPercentage = (netProfit / sellingPrice) * 100 || 0;
  const totalRevenue = sellingPrice * (visitors * (conversionRate / 100));
  const totalNetProfit = netProfit * (visitors * (conversionRate / 100));

  const [activeTab, setActiveTab] = useState<'calculator' | 'strategy'>('calculator');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const cardVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 ${isRtl ? 'font-arabic' : ''}`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/10 group overflow-hidden relative">
             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <Calculator className="text-purple-400 w-8 h-8 group-hover:scale-110 transition-transform z-10" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
              {t('product_calculator_title')}
            </h1>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">
              {isRtl ? 'تحسين الربحية وإدارة التكاليف بذكاء' : 'Optimize Profitability & Smart Cost Management'}
            </p>
          </div>
        </div>

        <div className="flex p-1.5 bg-slate-900/60 rounded-[1.5rem] border border-white/5 backdrop-blur-xl">
           {[
             { id: 'calculator', label: t('calculator_tab'), icon: Calculator },
             { id: 'strategy', label: t('strategy_tab'), icon: TrendingUp }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`
                 flex items-center gap-3 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
                 ${activeTab === tab.id 
                   ? 'bg-purple-500 text-white shadow-xl shadow-purple-500/20' 
                   : 'text-slate-400 hover:text-white'}
               `}
             >
               <tab.icon className="w-4 h-4" />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel p-10 bg-slate-900/40 relative group border-white/5 overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12">
               <Package className="w-32 h-32" />
             </div>
             
             <div className="flex items-center gap-3 mb-10">
                <DollarSign className="text-purple-400 w-5 h-5" />
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">{t('cost_details')}</h3>
             </div>

             <div className="space-y-8">
               {[
                 { label: t('product_cost'), value: productCost, setter: setProductCost, icon: Package },
                 { label: t('shipping_cost'), value: shippingCost, setter: setShippingCost, icon: Clock },
                 { label: t('selling_price'), value: sellingPrice, setter: setSellingPrice, icon: Zap },
                 { label: t('ad_spend_unit'), value: adSpend, setter: setAdSpend, icon: Target },
                 { label: t('other_costs'), value: otherCosts, setter: setOtherCosts, icon: Info }
               ].map((field, i) => (
                 <div key={i} className="space-y-3 group/field">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1 flex items-center gap-2">
                       <field.icon className="w-3 h-3" />
                       {field.label}
                    </label>
                    <div className="relative">
                       <input 
                         type="number"
                         value={field.value || ''}
                         onChange={(e) => field.setter(Number(e.target.value))}
                         className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:border-purple-500 outline-none transition-all placeholder:text-slate-800"
                         placeholder="0.00"
                       />
                       <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 uppercase">USD</span>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: t('net_profit_unit'), value: netProfit, color: 'emerald', icon: TrendingUp },
                { label: t('margin_percentage'), value: marginPercentage.toFixed(1) + '%', color: 'purple', icon: BarChart3 },
                { label: t('be_roas'), value: breakEvenROAS.toFixed(2), color: 'amber', icon: Target },
                { label: t('gross_profit'), value: grossProfit, color: 'blue', icon: DollarSign }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  variants={cardVariants}
                  whileHover="hover"
                  className={`p-10 bg-slate-900/60 border border-white/5 rounded-[2.5rem] relative overflow-hidden group shadow-2xl`}
                >
                  <div className={`absolute top-0 right-0 p-8 opacity-5 text-${stat.color}-400 group-hover:rotate-12 transition-transform duration-500`}>
                    <stat.icon className="w-20 h-20" />
                  </div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{stat.label}</h4>
                  <div className={`text-4xl font-black text-white tracking-tighter flex items-end gap-2`}>
                     {typeof stat.value === 'number' && <span className="text-slate-600 text-lg">$</span>}
                     {stat.value}
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                     <div className={`w-2 h-1.5 rounded-full bg-${stat.color}-500 shadow-[0_0_8px_rgba(var(--tw-color-${stat.color}-500),0.5)]`} />
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isRtl ? 'مؤشر أداء حي' : 'Live Performance Indicator'}</span>
                  </div>
                </motion.div>
              ))}
           </div>

           <div className="glass-panel p-10 bg-gradient-to-r from-purple-500/10 to-transparent border-white/5 overflow-hidden group">
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-3">
                       <Sparkles className="text-amber-400 w-5 h-5 animate-pulse" />
                       <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">{t('profit_projections')}</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-12">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('monthly_traffic')}</p>
                          <p className="text-2xl font-black text-white">{visitors.toLocaleString()}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('conv_rate')}</p>
                          <p className="text-2xl font-black text-white">{conversionRate}%</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t('expected_revenue')}</p>
                          <p className="text-2xl font-black text-emerald-400">${totalRevenue.toLocaleString()}</p>
                       </div>
                    </div>
                 </div>

                 <div className="w-full md:w-64 p-8 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{t('net_earnings')}</p>
                    <div className="text-4xl font-black text-white text-center tracking-tighter">
                       ${totalNetProfit.toLocaleString()}
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: marginPercentage > 0 ? `${marginPercentage}%` : 0 }}
                         className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                       />
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-900 border border-white/5 rounded-[2rem] space-y-6 hover:border-amber-500/30 transition-all group">
                 <div className="flex items-center gap-3">
                    <AlertCircle className="text-amber-400 w-5 h-5" />
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">{isRtl ? 'تحليلات الربح' : 'Profit Analysis'}</h4>
                 </div>
                 <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                   {netProfit > 0 
                     ? (isRtl ? `منتجك رابح بقيمة $${netProfit.toFixed(2)} للقطعة الواحدة. استمر في التحسين!` : `Your product is profitable by $${netProfit.toFixed(2)} per unit. Keep optimizing!`)
                     : (isRtl ? 'تنبيه: التكاليف تتجاوز سعر البيع. يرجى مراجعة ميزانية الإعلانات أو سعر البيع.' : 'Warning: Costs exceed selling price. Review ad budget or pricing.')}
                 </p>
              </div>

              <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] space-y-6 group">
                 <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-indigo-400 w-5 h-5" />
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">{isRtl ? 'نصيحة ذكية' : 'Smart Advice'}</h4>
                 </div>
                 <p className="text-slate-300 text-sm font-bold leading-relaxed">
                   {isRtl 
                     ? 'هدفنا هو الحفاظ على هامش ربح أعلى من 20%. يمكنك تقليل تكاليف الشحن من خلال العقود السنوية.' 
                     : 'Aim for a margin above 20%. You can reduce shipping costs via annual contracts.'}
                 </p>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCalculator;
