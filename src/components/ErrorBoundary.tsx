import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const isArabic = document.documentElement.dir === 'rtl' || window.location.pathname.includes('/ar');
      
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full glass-panel p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500" />
            
            <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>

            <h1 className="text-2xl font-black text-white mb-4 tracking-tight">
              {isArabic ? 'عذراً، حدث خطأ ما' : 'Oops, something went wrong'}
            </h1>
            
            <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
              {isArabic 
                ? 'لقد واجهنا مشكلة غير متوقعة. يرجى محاولة إعادة تحميل الصفحة أو العودة للرئيسية.' 
                : 'We encountered an unexpected error. Please try refreshing the page or return to the home screen.'}
            </p>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="btn-premium py-4 flex items-center justify-center gap-2 group"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-black uppercase tracking-widest text-xs">
                  {isArabic ? 'إعادة تحميل' : 'Reload Page'}
                </span>
              </button>
              
              <a 
                href="/"
                className="text-xs font-black text-slate-500 uppercase tracking-widest no-underline hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-3 h-3" />
                {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
              </a>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 pt-8 border-t border-white/5 text-left overflow-auto max-h-32">
                <p className="text-[10px] font-mono text-red-400 opacity-50">{this.state.error?.message}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
