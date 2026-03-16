import { Link } from 'react-router-dom';
import { Globe, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 glass-panel border-x-0 border-t-0 rounded-none shadow-none" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Logo Section */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(109,40,217,0.3)] transition-all"
          >
            <Sparkles className="text-white w-5 h-5" />
          </motion.div>
          <span className="text-lg font-black text-white tracking-widest uppercase">
            PAS<span className="text-purple-400">lytics</span>
          </span>
        </Link>
      </div>
      
      {/* Centered Links Section */}
      <div className="hidden lg:flex flex-1 justify-center items-center gap-12">
        <Link to="/" className="text-xs font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em] no-underline relative group">
          {t('home')}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
        </Link>
        <Link to="/plan" className="text-xs font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em] no-underline relative group">
          {t('plan')}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
        </Link>
        <Link to="/about" className="text-xs font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em] no-underline relative group">
          {t('about')}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
        </Link>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={toggleLanguage} 
          className="flex items-center gap-2 px-4 py-2 text-xs font-black text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer border-none"
        >
          <Globe className="w-4 h-4" />
          {language === 'ar' ? 'EN' : 'AR'}
        </button>
        
        <Link to="/login" className="hidden sm:block text-xs font-black text-slate-400 hover:text-white no-underline transition-colors">
          {t('login')}
        </Link>
        
        <Link to="/login" className="btn-premium flex items-center gap-2 group !rounded-xl !px-6 !py-2.5 !text-xs">
          {t('get_started')}
          <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
