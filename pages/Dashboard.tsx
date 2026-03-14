import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';

  const navigate = useNavigate();
  const { hasActivePlan } = useSubscription();

  // Check generic user profile role
  const profileRaw = localStorage.getItem('user_profile');
  const userProfile = profileRaw ? JSON.parse(profileRaw) : null;
  const isAdmin = userProfile?.role === 'admin';
  const hasAccess = isAdmin || hasActivePlan;

  // Real Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [pasOutput, setPasOutput] = useState({
    problem: '',
    agitation: '',
    solution: '',
    ai_quick_take: '',
    emotional_score: 88
  });

  // Derived analysis state for UI logic
  const analysisState = analysisComplete ? 'complete' : (isUploading ? 'uploading' : 'idle');

  // Marketing Manager state
  const [mmDescription, setMmDescription] = useState('');
  const [mmAgeMin, setMmAgeMin] = useState(18);
  const [mmAgeMax, setMmAgeMax] = useState(35);
  const [mmMen, setMmMen] = useState(50);
  const [mmPlan, setMmPlan] = useState('');

  // Product Calculator state
  const [pcBase, setPcBase] = useState('');
  const [pcDuty, setPcDuty] = useState('');
  const [pcDutyIsPercent, setPcDutyIsPercent] = useState(true);
  const [pcProfit, setPcProfit] = useState('');
  const [pcMarketing, setPcMarketing] = useState('');

  const pcWomen = 100 - mmMen;

  const calcFinalPrice = () => {
    const base = parseFloat(pcBase) || 0;
    const duty = pcDutyIsPercent ? base * ((parseFloat(pcDuty) || 0) / 100) : (parseFloat(pcDuty) || 0);
    const profit = base * ((parseFloat(pcProfit) || 0) / 100);
    const marketing = parseFloat(pcMarketing) || 0;
    return (base + duty + profit + marketing).toFixed(2);
  };

  const handleGeneratePlan = () => {
    if (!mmDescription.trim()) { alert(t('mm_alert_empty') || 'Please enter a product description first.'); return; }
    setMmPlan(`${t('mm_plan_title')} "${mmDescription}"

${t('mm_target_audience')}
  • ${t('mm_age_range_label')} ${mmAgeMin}–${mmAgeMax} ${t('mm_years')}
  • ${t('mm_gender_split_label')} ${mmMen}% ${t('mm_men')} / ${pcWomen}% ${t('mm_women')}

${t('mm_channels')}
  • ${mmMen > pcWomen ? 'YouTube, Reddit, Gaming' : 'Instagram, Pinterest, TikTok'}
  • ${mmAgeMax < 35 ? t('mm_email_young') : t('mm_email_older')}

${t('mm_content_strategy')}
  • ${mmMen > pcWomen ? t('mm_highlight_male') : t('mm_highlight_female')}
  • ${t('mm_ab_tests')} ${mmAgeMin}–${Math.floor((mmAgeMin + mmAgeMax) / 2)}

${t('mm_budget')}
  • ${t('mm_budget_digital')}
  • ${t('mm_budget_content')}
  • ${t('mm_budget_influencer')}
  • ${t('mm_budget_analytics')}`);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(20);
    setAnalysisComplete(false);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setUploadProgress(45);
      const base64Image = reader.result;
      
      try {
        const { data, error } = await supabase.functions.invoke('analyze-product', {
          body: { imageBase64: base64Image }
        });
        
        setUploadProgress(85);
        if (error) throw error;
        
        setPasOutput({
          problem: data.problem || '',
          agitation: data.agitation || '',
          solution: data.solution || '',
          ai_quick_take: data.ai_quick_take || '',
          emotional_score: data.emotional_score || 88
        });
      } catch (err) {
        console.error("AI Analysis Failed:", err);
        // Fallback gracefully so UI doesn't break if edge function isn't deployed yet
        setPasOutput({
          problem: t('problem_text') || 'Fallback problem text.',
          agitation: t('agitation_text') || 'Fallback agitation text.',
          solution: t('solution_text') || 'Fallback solution text.',
          ai_quick_take: t('quick_take_text') || 'Fallback quick take.',
          emotional_score: 88
        });
      } finally {
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setAnalysisComplete(true);
        }, 800);
      }
    };
  };

  return (
    <div className="app-layout" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ borderInlineEnd: '1px solid var(--border)', ...(isRtl ? { left: 'auto', right: 0, borderLeft: '1px solid var(--border)', borderRight: 'none' } : {}) }}>
        <div className="sidebar-logo flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div style={{ width: '28px', height: '28px', background: '#6c2bd9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            </div>
            {t('app_name')}
          </div>
          <button onClick={toggleLanguage} className="btn" style={{ padding: '4px 8px', fontSize: '10px' }}>
            {isRtl ? 'EN' : 'AR'}
          </button>
        </div>

        <nav className="sidebar-nav mt-4" style={{ flex: 1 }}>
          <Link to="/dashboard" className="nav-item active" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', [isRtl ? 'right' : 'left']: '-24px', top: 0, bottom: 0, width: '4px', background: 'var(--primary)', borderRadius: isRtl ? '4px 0 0 4px' : '0 4px 4px 0' }}></div>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            {t('dashboard')}
          </Link>
          <Link to="/logs" className="nav-item">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            {t('logs')}
          </Link>
          <Link to="/management" className="nav-item">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            {t('admin')}
          </Link>
          <Link to="/admin/payment-settings" className="nav-item">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            {t('paysettings_nav')}
          </Link>
          <Link to="/admin/content" className="nav-item">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            {t('content_manager_nav')}
          </Link>
        </nav>

        <nav className="sidebar-nav mt-auto" style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <Link to="/settings" className="nav-item mb-4">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {t('settings')}
          </Link>
          <div className="flex flex-col gap-3 mt-4" style={{ padding: '0 20px' }}>
            {userProfile ? (
              <div className="flex items-center gap-3">
                <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: '#6c2bd9' }}>
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>{userProfile.name}</div>
                  <div style={{ fontSize: '12px', color: isAdmin ? '#10b981' : 'var(--text-muted)' }}>{isAdmin ? 'Admin' : (hasActivePlan ? t('pro_plan') : 'Free Plan')}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="avatar"><img src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Alex&backgroundColor=b6e3f4" alt="profile" /></div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>Alex Rivers</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('pro_plan')}</div>
                </div>
              </div>
            )}
            
            <button 
              className="btn btn-outline" 
              style={{ padding: '6px 12px', fontSize: '12px', width: 'fit-content' }}
              onClick={() => {
                localStorage.removeItem('user_profile');
                navigate('/login');
              }}
            >
              {t('logout')}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ marginInlineStart: '260px', marginInlineEnd: 0 }}>
        <div style={{ maxWidth: '1000px' }}>

          {/* Header */}
          <div className="flex justify-between items-center mb-6" style={{ paddingBottom: '24px' }}>
            <h1 style={{ fontSize: '24px' }}>{t('pas_analysis_title')}</h1>
            <div className="flex gap-3">
              <button
                className="btn btn-outline"
                style={{ borderRadius: '4px' }}
                onClick={() => {
                  const element = document.getElementById('pas-report-content');
                  if (element) {
                    // @ts-ignore
                    if (window.html2pdf) {
                      const opt = {
                        margin: 10,
                        filename: 'PAS_Analysis_Report.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                      };
                      // @ts-ignore
                      window.html2pdf().set(opt).from(element).save();
                    } else {
                      alert('PDF Export library is loading. Please try again in a moment.');
                    }
                  } else {
                    alert('No analysis available to export. Please analyze an image first.');
                  }
                }}
              >
                {t('export_report')}
              </button>
              <button
                className="btn btn-primary"
                style={{ background: '#6c2bd9', borderRadius: '4px' }}
                onClick={() => alert('Starting a new analysis trace...')}
              >
                {t('run_new_analysis')}
              </button>
            </div>
          </div>

          {/* Subscription Wall Checkout */}
          {!hasAccess ? (
            <div className="card mb-6" style={{ padding: '60px 40px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0', background: 'linear-gradient(to bottom, #ffffff, #f8fafc)' }}>
              <div style={{ width: '64px', height: '64px', background: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6c2bd9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>{isRtl ? 'ميزة مميزة' : 'Premium Feature'}</h2>
              <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '400px', margin: '0 auto 32px', lineHeight: 1.6 }}>
                {isRtl ? 'يرجى الترقية إلى خطة مدفوعة لفتح أدوات تحليل الصور وإنشاء تقارير نموذج PAS.' : 'Please upgrade to a paid plan to unlock image analysis tools and PAS framework generation.'}
              </p>
              <Link to="/pricing" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '16px', fontWeight: 600, borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                {isRtl ? 'اكتشف الخطط هنا' : 'Explore Plans Here'}
              </Link>
            </div>
          ) : (
            <>
          {/* Upload Section */}
          <div className="card mb-6" style={{ padding: '32px', borderRadius: '12px' }}>
            <div 
              style={{ border: isUploading ? '2px solid #6c2bd9' : '2px dashed #cbd5e1', borderRadius: '12px', padding: '48px 20px', textAlign: 'center', backgroundColor: isUploading ? '#fcfaff' : '#f8fafc', transition: 'all 0.2s', cursor: isUploading ? 'default' : 'pointer' }}
              onClick={() => { if (!isUploading && !analysisComplete) document.getElementById('file-upload-mock')?.click(); }}
            >
              {!isUploading && !analysisComplete ? (
                <>
                  <div style={{ width: '48px', height: '48px', background: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <div 
          className="input-group" 
          style={{ border: `2px dashed ${analysisState === 'uploading' ? 'var(--primary)' : 'var(--border)'}`, padding: '40px', textAlign: 'center', borderRadius: '16px', backgroundColor: analysisState === 'uploading' ? '#f3e8ff' : '#ffffff', cursor: analysisState === 'idle' ? 'pointer' : 'default', transition: 'all 0.3s ease' }} 
          onClick={() => { if (analysisState === 'idle') document.getElementById('file-upload-mock')?.click(); }}
        >
          {analysisState === 'idle' && (
            <React.Fragment>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{ margin: '0 auto 16px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>{isRtl ? 'اسحب وأفلت صور المنتج هنا' : 'Drag & drop product images here'}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{isRtl ? 'يدعم JPG, PNG, WEBP حتى 5 ميجابايت' : 'Supports JPG, PNG, WEBP up to 5MB'}</div>
            </React.Fragment>
          )}
          {analysisState === 'uploading' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #e9d5ff', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>{isRtl ? 'جاري تحليل المنتج بتقنية الذكاء الاصطناعي...' : 'AI is analyzing the product...'}</div>
              <div style={{ width: '100%', maxWidth: '300px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.2s linear' }}></div>
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </div>
                  </div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>{t('upload_title')}</h2>
                  <p style={{ marginBottom: '20px', color: '#64748b', fontSize: '14px' }}>{t('upload_desc')}</p>
                  <button
                    className="btn"
                    style={{ background: '#0f172a', color: 'white', fontWeight: 600, padding: '10px 24px', borderRadius: '8px' }}
                  >
                    {t('select_files')}
                  </button>
                  <input type="file" id="file-upload-mock" style={{ display: 'none' }} accept="image/png, image/jpeg, image/webp" onChange={handleUpload} />
                </>
              ) : isUploading ? (
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#6c2bd9' }}>
                    <span>{isRtl ? 'جاري تحليل الصورة بالذكاء الاصطناعي...' : 'Analyzing AI visual points...'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#6c2bd9', transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '12px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', marginBottom: '8px' }}>{isRtl ? 'تم التحليل بنجاح' : 'Analysis Complete'}</h2>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>{isRtl ? 'تم استخراج نقاط PAS بنجاح.' : 'PAS frameworks generated successfully.'}</p>
                  <button onClick={() => { setIsUploading(false); setAnalysisComplete(false); setUploadProgress(0); }} className="btn btn-outline" style={{ fontSize: '13px' }}>
                    {isRtl ? 'تحليل صورة جديدة' : 'Analyze New Image'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ opacity: analysisComplete ? 1 : 0.3, transition: 'opacity 0.5s', pointerEvents: analysisComplete ? 'auto' : 'none' }}>
           {/* Analysis Results Layout - Wrapped for PDF Export */}
           <div id="pas-report-content" style={{ padding: '16px', background: '#fff', borderRadius: '12px' }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px' }}>

            {/* Left Column: Framework Output */}
            <div className="card p-6" style={{ borderRadius: '12px' }}>
              <div className="flex items-center gap-2 mb-6">
                <div style={{ width: '6px', height: '20px', background: '#6c2bd9', borderRadius: '2px' }}></div>
                <h2 style={{ fontSize: '16px' }}>{t('pas_output')}</h2>
              </div>

              <div className="mb-6">
                <span className="badge badge-red mb-3">{t('problem')}</span>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>
                  {pasOutput.problem || t('problem_text')}
                </p>
              </div>

              <div className="mb-6">
                <span className="badge badge-orange mb-3">{t('agitation')}</span>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>
                  {pasOutput.agitation || t('agitation_text')}
                </p>
              </div>

              <div>
                <span className="badge badge-green mb-3">{t('solution')}</span>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>
                  {pasOutput.solution || t('solution_text')}
                </p>
              </div>
            </div>

            {/* Right Column: Stats */}
            <div className="flex flex-col gap-6">

              <div className="card p-6" style={{ borderRadius: '12px' }}>
                <h3 className="mb-4" style={{ color: '#6b7280', fontSize: '12px' }}>{t('emotional_resonance')}</h3>
                <div className="badge badge-purple mb-4" style={{ borderRadius: '20px', fontWeight: 700 }}>{t('score')} {pasOutput.emotional_score || 88}%</div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px', display: 'flex' }}>
                  <div style={{ width: `${pasOutput.emotional_score || 88}%`, height: '100%', background: '#9333ea', borderRadius: '4px' }}></div>
                </div>
                <p style={{ fontSize: '12px' }}>{t('agitation_scores')}</p>
              </div>

              <div className="card p-6" style={{ borderRadius: '12px' }}>
                <h3 className="mb-4" style={{ color: '#6b7280', fontSize: '12px' }}>{t('engagement_pulse')}</h3>
                <div style={{ height: '120px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '16px 20px' }}>
                  <div style={{ width: '30px', height: '40px', background: '#f3e8ff', borderRadius: '4px 4px 0 0' }}></div>
                  <div style={{ width: '30px', height: '60px', background: '#e9d5ff', borderRadius: '4px 4px 0 0' }}></div>
                  <div style={{ width: '30px', height: '100px', background: '#a855f7', borderRadius: '4px 4px 0 0' }}></div>
                  <div style={{ width: '30px', height: '75px', background: '#c084fc', borderRadius: '4px 4px 0 0' }}></div>
                  <div style={{ width: '30px', height: '90px', background: '#9333ea', borderRadius: '4px 4px 0 0' }}></div>
                </div>
                <div className="flex justify-between mt-2" style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                  <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span>
                </div>
              </div>

              <div className="card p-6" style={{ background: '#581c87', color: 'white', borderRadius: '12px', border: 'none' }}>
                <h3 className="mb-4" style={{ color: '#c084fc', fontSize: '12px' }}>{t('ai_quick_take')}</h3>
                <p style={{ fontSize: '13px', color: '#f3e8ff', lineHeight: '1.5' }}>
                  {pasOutput.ai_quick_take || t('quick_take_text')}
                </p>
              </div>

            </div>
             </div>

          {/* ── Marketing Manager Tool ── */}
          <div className="card" style={{ padding: '28px', marginTop: '32px', borderRadius: '12px' }}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6c2bd9, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>{t('mm_title')}</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('mm_desc')}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px', display: 'block' }}>{t('mm_product_desc')}</label>
                <textarea
                  value={mmDescription}
                  onChange={(e) => setMmDescription(e.target.value)}
                  className="input"
                  style={{ width: '100%', minHeight: '80px', resize: 'vertical', padding: '10px 14px', fontFamily: 'inherit' }}
                  placeholder={t('mm_product_placeholder')}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px', display: 'block' }}>
                    {t('mm_age_range')} <strong>{mmAgeMin}–{mmAgeMax}</strong>
                  </label>
                  <div className="flex gap-3 items-center">
                    <span style={{ fontSize: '12px', color: '#64748b', minWidth: '20px' }}>18</span>
                    <input type="range" min="18" max={mmAgeMax} value={mmAgeMin} onChange={(e) => setMmAgeMin(parseInt(e.target.value))} style={{ flex: 1, accentColor: '#6c2bd9' }} />
                    <input type="range" min={mmAgeMin} max="65" value={mmAgeMax} onChange={(e) => setMmAgeMax(parseInt(e.target.value))} style={{ flex: 1, accentColor: '#6c2bd9' }} />
                    <span style={{ fontSize: '12px', color: '#64748b', minWidth: '20px' }}>65</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px', display: 'block' }}>
                    Gender Split: <strong>{mmMen}% Men / {pcWomen}% Women</strong>
                  </label>
                  <div className="flex gap-2 items-center">
                    <span style={{ fontSize: '12px', color: '#6c2bd9', fontWeight: 700 }}>♂</span>
                    <input type="range" min="0" max="100" value={mmMen} onChange={(e) => setMmMen(parseInt(e.target.value))} style={{ flex: 1, accentColor: '#6c2bd9' }} />
                    <span style={{ fontSize: '12px', color: '#ec4899', fontWeight: 700 }}>♀</span>
                  </div>
                  <div style={{ display: 'flex', marginTop: '6px', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ flex: mmMen, background: '#6c2bd9', transition: 'flex 0.3s ease' }}></div>
                    <div style={{ flex: pcWomen, background: '#ec4899', transition: 'flex 0.3s ease' }}></div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGeneratePlan}
                className="btn btn-primary"
                style={{ background: '#6c2bd9', alignSelf: 'flex-start', minWidth: '180px' }}
              >
                {t('mm_generate')}
              </button>

              {mmPlan && (
                <div style={{ background: '#f8f5ff', border: '1px solid #e9d5ff', borderRadius: '10px', padding: '20px', whiteSpace: 'pre-line', fontFamily: 'monospace', fontSize: '13px', color: '#3b0764', lineHeight: '1.8' }}>
                  {mmPlan}
                </div>
              )}
            </div>
          </div>

          {/* ── Product Price Calculator ── */}
          <div className="card" style={{ padding: '28px', marginTop: '24px', marginBottom: '48px', borderRadius: '12px' }}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"></rect><line x1="8" y1="8" x2="16" y2="8"></line><line x1="8" y1="12" x2="16" y2="12"></line><line x1="8" y1="16" x2="12" y2="16"></line></svg>
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>{t('pc_title')}</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('pc_desc')}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px', display: 'block' }}>{t('pc_base_cost')}</label>
                <input type="number" min="0" step="0.01" value={pcBase} onChange={(e) => setPcBase(e.target.value)} className="input" style={{ width: '100%' }} placeholder="e.g. 25.00" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px', display: 'block' }}>
                  {t('pc_duties')}
                  <button
                    onClick={() => setPcDutyIsPercent(p => !p)}
                    className="btn btn-outline"
                    style={{ padding: '2px 8px', fontSize: '11px', borderRadius: '4px', display: 'inline-flex', marginLeft: '6px' }}
                  >
                    {pcDutyIsPercent ? t('pc_duty_percent') : t('pc_duty_fixed')}
                  </button>
                </label>
                <input type="number" min="0" step="0.01" value={pcDuty} onChange={(e) => setPcDuty(e.target.value)} className="input" style={{ width: '100%' }} placeholder={pcDutyIsPercent ? 'e.g. 12 (%)' : 'e.g. 5.00 ($)'} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px', display: 'block' }}>{t('pc_profit_margin')}</label>
                <input type="number" min="0" max="100" step="1" value={pcProfit} onChange={(e) => setPcProfit(e.target.value)} className="input" style={{ width: '100%' }} placeholder="e.g. 35" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px', display: 'block' }}>{t('pc_marketing_budget')}</label>
                <input type="number" min="0" step="0.01" value={pcMarketing} onChange={(e) => setPcMarketing(e.target.value)} className="input" style={{ width: '100%' }} placeholder="e.g. 3.00" />
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6c2bd9 100%)', borderRadius: '12px', padding: '24px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px' }}>{t('pc_final_price')}</div>
                <div style={{ fontSize: '42px', fontWeight: 700, letterSpacing: '-1px' }}>${calcFinalPrice()}</div>
              </div>
              <div style={{ fontSize: '13px', opacity: 0.85, lineHeight: '2' }}>
                <div>{t('pc_base_label')}: ${parseFloat(pcBase || '0').toFixed(2)}</div>
                <div>{t('pc_duties_label')}: +${pcDutyIsPercent ? (parseFloat(pcBase || '0') * (parseFloat(pcDuty || '0') / 100)).toFixed(2) : parseFloat(pcDuty || '0').toFixed(2)}</div>
                <div>{t('pc_profit_label')} ({pcProfit || 0}%): +${(parseFloat(pcBase || '0') * (parseFloat(pcProfit || '0') / 100)).toFixed(2)}</div>
                <div>{t('pc_marketing_label')}: +${parseFloat(pcMarketing || '0').toFixed(2)}</div>
              </div>
            </div>
          </div>
          {/* Close pas-report-content wrapper */}
          </div>
          {/* Close opacity wrapper */}
          </div>
          {/* Close Fragment from upload section */}
          </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
