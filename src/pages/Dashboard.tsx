import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { supabase } from '../lib/supabase';
import { css, cx } from '../../styled-system/css';

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
        if (error) {
          console.error("Supabase Function Error Details:", error);
          throw new Error(error.message || "Failed to connect to analysis service.");
        }
        
        setPasOutput({
          problem: data.problem || '',
          agitation: data.agitation || '',
          solution: data.solution || '',
          ai_quick_take: data.ai_quick_take || '',
          emotional_score: data.emotional_score || 88
        });
      } catch (err: any) {
        console.error("AI Analysis Failed:", err);
        // Show the real error message to the user for debugging
        alert(`Analysis Error: ${err.message || "Unknown error"}\n\nPlease check your OpenAI credits or Edge Function logs if this persists.`);
        
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
    <div className={css({ direction: isRtl ? 'rtl' : 'ltr', maxWidth: '1000px', margin: '0 auto' })}>
      {/* Main Content Area */}
      <div className={css({ width: '100%' })}>
        <div style={{ maxWidth: '1000px' }}>

          {/* Header */}
          <div className={css({ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px',
            paddingBottom: '24px'
          })}>
            <h1 className={css({ fontSize: '24px', fontWeight: 'bold', color: 'slate.900' })}>{t('pas_analysis_title')}</h1>
            <div className={css({ display: 'flex', gap: '12px' })}>
              <button
                className={css({
                  paddingX: '20px',
                  paddingY: '10px',
                  borderRadius: 'lg',
                  fontSize: '14px',
                  fontWeight: 'semibold',
                  backgroundColor: 'white',
                  border: '1px solid',
                  borderColor: 'slate.200',
                  cursor: 'pointer',
                  transition: 'all',
                  _hover: { backgroundColor: 'slate.50', borderColor: 'slate.300' }
                })}
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
                className={css({
                  paddingX: '20px',
                  paddingY: '10px',
                  borderRadius: 'lg',
                  fontSize: '14px',
                  fontWeight: 'semibold',
                  backgroundColor: 'brand.primary',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all',
                  _hover: { backgroundColor: 'brand.secondary' }
                })}
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
          <div className={css({ 
            backgroundColor: 'white', 
            padding: '32px', 
            borderRadius: '16px', 
            boxShadow: 'sm',
            border: '1px solid',
            borderColor: 'slate.100',
            marginBottom: '24px'
          })}>
            <div 
              className={css({ 
                border: isUploading ? '2px solid' : '2px dashed', 
                borderColor: isUploading ? 'brand.primary' : 'slate.200',
                borderRadius: '16px', 
                padding: '48px 20px', 
                textAlign: 'center', 
                backgroundColor: isUploading ? 'rgba(108, 43, 217, 0.05)' : 'slate.50', 
                transition: 'all', 
                cursor: isUploading ? 'default' : 'pointer',
                _hover: { backgroundColor: !isUploading ? 'slate.100' : 'none' }
              })}
              onClick={() => { if (!isUploading && !analysisComplete) document.getElementById('file-upload-mock')?.click(); }}
            >
              {!isUploading && !analysisComplete ? (
                <>
                  <div className={css({ 
                    width: '64px', 
                    height: '64px', 
                    backgroundColor: 'violet.50', 
                    borderRadius: 'full', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 24px' 
                  })}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  <h2 className={css({ fontSize: '20px', fontWeight: 'bold', color: 'slate.900', marginBottom: '8px' })}>{t('upload_title')}</h2>
                  <p className={css({ fontSize: '14px', color: 'slate.500', marginBottom: '24px' })}>{t('upload_desc')}</p>
                  <button
                    className={css({
                      paddingX: '32px',
                      paddingY: '12px',
                      borderRadius: 'lg',
                      fontSize: '15px',
                      fontWeight: 'bold',
                      backgroundColor: 'slate.900',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all',
                      _hover: { opacity: 0.9 }
                    })}
                  >
                    {t('select_files')}
                  </button>
                  <input type="file" id="file-upload-mock" className={css({ display: 'none' })} accept="image/png, image/jpeg, image/webp" onChange={handleUpload} />
                </>
              ) : isUploading ? (
                <div className={css({ padding: '20px' })}>
                  <div className={css({ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '12px', 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    color: 'brand.primary' 
                  })}>
                    <span>{isRtl ? 'جاري تحليل الصورة بالذكاء الاصطناعي...' : 'Analyzing AI visual points...'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className={css({ width: '100%', height: '10px', backgroundColor: 'slate.200', borderRadius: 'full', overflow: 'hidden' })}>
                    <div className={css({ 
                      width: `${uploadProgress}%`, 
                      height: '100%', 
                      backgroundColor: 'brand.primary', 
                      transition: 'width 0.3s ease' 
                    })}></div>
                  </div>
                </div>
              ) : (
                <div className={css({ padding: '12px' })}>
                  <div className={css({ 
                    width: '64px', 
                    height: '64px', 
                    backgroundColor: 'green.50', 
                    borderRadius: 'full', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 24px' 
                  })}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h2 className={css({ fontSize: '20px', fontWeight: 'bold', color: 'green.600', marginBottom: '8px' })}>{isRtl ? 'تم التحليل بنجاح' : 'Analysis Complete'}</h2>
                  <p className={css({ fontSize: '14px', color: 'slate.500', marginBottom: '24px' })}>{isRtl ? 'تم استخراج نقاط PAS بنجاح.' : 'PAS frameworks generated successfully.'}</p>
                  <button 
                    onClick={() => { setIsUploading(false); setAnalysisComplete(false); setUploadProgress(0); }} 
                    className={css({
                      paddingX: '24px',
                      paddingY: '10px',
                      borderRadius: 'lg',
                      fontSize: '14px',
                      fontWeight: 'semibold',
                      backgroundColor: 'white',
                      border: '1px solid',
                      borderColor: 'slate.200',
                      cursor: 'pointer',
                      transition: 'all',
                      _hover: { backgroundColor: 'slate.50' }
                    })}
                  >
                    {isRtl ? 'تحليل صورة جديدة' : 'Analyze New Image'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={css({ opacity: analysisComplete ? 1 : 0.3, transition: 'opacity 0.5s', pointerEvents: analysisComplete ? 'auto' : 'none' })}>
           {/* Analysis Results Layout - Wrapped for PDF Export */}
           <div id="pas-report-content" className={css({ padding: '16px', backgroundColor: 'white', borderRadius: '16px' })}>
             <div className={css({ 
               display: 'grid', 
               gridTemplateColumns: { base: '1', lg: '1.4fr 1fr' }, 
               gap: '24px' 
             })}>

            {/* Left Column: Framework Output */}
            <div className={css({ 
              backgroundColor: 'white', 
              padding: '24px', 
              borderRadius: '16px', 
              border: '1px solid', 
              borderColor: 'slate.100',
              boxShadow: 'sm'
            })}>
              <div className={css({ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' })}>
                <div className={css({ width: '6px', height: '24px', backgroundColor: 'brand.primary', borderRadius: 'full' })}></div>
                <h2 className={css({ fontSize: '18px', fontWeight: 'bold', color: 'slate.900' })}>{t('pas_output')}</h2>
              </div>

              <div className={css({ marginBottom: '24px' })}>
                <span className={css({ 
                  display: 'inline-block', 
                  backgroundColor: 'red.50', 
                  color: 'red.600', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  padding: '4px 12px', 
                  borderRadius: 'full', 
                  marginBottom: '12px' 
                })}>{t('problem')}</span>
                <p className={css({ color: 'slate.600', lineHeight: '1.6', fontSize: '15px' })}>
                  {pasOutput.problem || t('problem_text')}
                </p>
              </div>

              <div className={css({ marginBottom: '24px' })}>
                <span className={css({ 
                  display: 'inline-block', 
                  backgroundColor: 'orange.50', 
                  color: 'orange.600', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  padding: '4px 12px', 
                  borderRadius: 'full', 
                  marginBottom: '12px' 
                })}>{t('agitation')}</span>
                <p className={css({ color: 'slate.600', lineHeight: '1.6', fontSize: '15px' })}>
                  {pasOutput.agitation || t('agitation_text')}
                </p>
              </div>

              <div>
                <span className={css({ 
                  display: 'inline-block', 
                  backgroundColor: 'green.50', 
                  color: 'green.600', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  padding: '4px 12px', 
                  borderRadius: 'full', 
                  marginBottom: '12px' 
                })}>{t('solution')}</span>
                <p className={css({ color: 'slate.600', lineHeight: '1.6', fontSize: '15px' })}>
                  {pasOutput.solution || t('solution_text')}
                </p>
              </div>
            </div>

            {/* Right Column: Stats */}
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '24px' })}>

              <div className={css({ 
                backgroundColor: 'white', 
                padding: '24px', 
                borderRadius: '16px', 
                border: '1px solid', 
                borderColor: 'slate.100',
                boxShadow: 'sm'
              })}>
                <h3 className={css({ color: 'slate.500', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' })}>{t('emotional_resonance')}</h3>
                <div className={css({ 
                  display: 'inline-block', 
                  backgroundColor: 'violet.50', 
                  color: 'brand.primary', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  padding: '6px 16px', 
                  borderRadius: 'full', 
                  marginBottom: '16px' 
                })}>{t('score')} {pasOutput.emotional_score || 88}%</div>
                <div className={css({ width: '100%', height: '10px', backgroundColor: 'slate.100', borderRadius: 'full', marginBottom: '16px', overflow: 'hidden' })}>
                  <div className={css({ 
                    width: `${pasOutput.emotional_score || 88}%`, 
                    height: '100%', 
                    backgroundColor: 'brand.primary', 
                    borderRadius: 'full' 
                  })}></div>
                </div>
                <p className={css({ fontSize: '13px', color: 'slate.500' })}>{t('agitation_scores')}</p>
              </div>

              <div className={css({ 
                backgroundColor: 'white', 
                padding: '24px', 
                borderRadius: '16px', 
                border: '1px solid', 
                borderColor: 'slate.100',
                boxShadow: 'sm'
              })}>
                <h3 className={css({ color: 'slate.500', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' })}>{t('engagement_pulse')}</h3>
                <div className={css({ 
                  height: '120px', 
                  backgroundColor: 'slate.50', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'flex-end', 
                  justifyContent: 'space-between', 
                  padding: '16px 20px' 
                })}>
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

              <div className={css({ 
                backgroundColor: 'purple.900', 
                color: 'white', 
                padding: '24px', 
                borderRadius: '16px', 
                border: 'none',
                boxShadow: 'sm'
              })}>
                <h3 className={css({ color: 'violet.300', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '16px' })}>{t('ai_quick_take')}</h3>
                <p className={css({ fontSize: '14px', color: 'violet.50', lineHeight: '1.6' })}>
                  {pasOutput.ai_quick_take || t('quick_take_text')}
                </p>
              </div>

            </div>
             </div>

          {/* Marketing Manager Tool */}
          <div className={css({ 
            backgroundColor: 'white', 
            padding: '32px', 
            marginTop: '32px', 
            borderRadius: '16px', 
            border: '1px solid', 
            borderColor: 'slate.100',
            boxShadow: 'sm'
          })}>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' })}>
              <div className={css({ 
                width: '40px', 
                height: '40px', 
                background: 'gradient.primary', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white' 
              })}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>
              <div>
                <h2 className={css({ fontSize: '20px', fontWeight: 'bold', color: 'slate.900' })}>{t('mm_title')}</h2>
                <p className={css({ fontSize: '14px', color: 'slate.500' })}>{t('mm_desc')}</p>
              </div>
            </div>

            <div className={css({ display: 'grid', gap: '24px' })}>
              <div>
                <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700', marginBottom: '8px', display: 'block' })}>{t('mm_product_desc')}</label>
                <textarea
                  value={mmDescription}
                  onChange={(e) => setMmDescription(e.target.value)}
                  className={css({ 
                    width: '100%', 
                    minHeight: '100px', 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    border: '1px solid', 
                    borderColor: 'slate.200', 
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all',
                    _focus: { borderColor: 'brand.primary', ring: '2px', ringColor: 'violet.100' }
                  })}
                  placeholder={t('mm_product_placeholder')}
                />
              </div>

              <div className={css({ display: 'grid', gridTemplateColumns: { base: '1', md: 'repeat(auto-fit, minmax(240px, 1fr))' }, gap: '24px' })}>
                <div>
                  <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700', marginBottom: '12px', display: 'block' })}>
                    {t('mm_age_range')} <span className={css({ color: 'brand.primary' })}>{mmAgeMin}—{mmAgeMax}</span>
                  </label>
                  <div className={css({ display: 'flex', gap: '16px', alignItems: 'center' })}>
                    <span className={css({ fontSize: '12px', color: 'slate.400', minWidth: '20px' })}>18</span>
                    <input type="range" min="18" max={mmAgeMax} value={mmAgeMin} onChange={(e) => setMmAgeMin(parseInt(e.target.value))} className={css({ flex: 1, accentColor: 'brand.primary' })} />
                    <input type="range" min={mmAgeMin} max="65" value={mmAgeMax} onChange={(e) => setMmAgeMax(parseInt(e.target.value))} className={css({ flex: 1, accentColor: 'brand.primary' })} />
                    <span className={css({ fontSize: '12px', color: 'slate.400', minWidth: '20px' })}>65</span>
                  </div>
                </div>
                <div>
                  <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700', marginBottom: '12px', display: 'block' })}>
                    Gender Split: <span className={css({ color: 'brand.primary' })}>{mmMen}% Men</span> / <span className={css({ color: 'pink.500' })}>{pcWomen}% Women</span>
                  </label>
                  <div className={css({ display: 'flex', gap: '12px', alignItems: 'center' })}>
                    <span className={css({ fontSize: '14px', color: 'violet.600', fontWeight: 'bold' })}>♂</span>
                    <input type="range" min="0" max="100" value={mmMen} onChange={(e) => setMmMen(parseInt(e.target.value))} className={css({ flex: 1, accentColor: 'brand.primary' })} />
                    <span className={css({ fontSize: '14px', color: 'pink.500', fontWeight: 'bold' })}>♀</span>
                  </div>
                  <div className={css({ display: 'flex', marginTop: '8px', height: '8px', borderRadius: 'full', overflow: 'hidden', backgroundColor: 'slate.100' })}>
                    <div className={css({ backgroundColor: 'brand.primary', transition: 'width 0.3s ease' })} style={{ width: `${mmMen}%` }}></div>
                    <div className={css({ backgroundColor: 'pink.400', transition: 'width 0.3s ease' })} style={{ width: `${pcWomen}%` }}></div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGeneratePlan}
                className={css({ 
                  alignSelf: 'flex-start', 
                  minWidth: '200px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  backgroundColor: 'brand.primary',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all',
                  border: 'none',
                  _hover: { opacity: 0.9, transform: 'translateY(-1px)' },
                  _active: { transform: 'translateY(0)' }
                })}
              >
                {t('mm_generate')}
              </button>

              {mmPlan && (
                <div className={css({ 
                  backgroundColor: 'violet.50', 
                  border: '1px solid', 
                  borderColor: 'violet.100', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  whiteSpace: 'pre-line', 
                  fontSize: '14px', 
                  color: 'slate.700', 
                  lineHeight: '1.8',
                  boxShadow: 'inner'
                })}>
                  {mmPlan}
                </div>
              )}
            </div>
          </div>

          {/* Product Price Calculator */}
          <div className={css({ 
            backgroundColor: 'white', 
            padding: '32px', 
            marginTop: '32px', 
            marginBottom: '48px', 
            borderRadius: '16px', 
            border: '1px solid', 
            borderColor: 'slate.100',
            boxShadow: 'sm'
          })}>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' })}>
              <div className={css({ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white' 
              })}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"></rect><line x1="8" y1="8" x2="16" y2="8"></line><line x1="8" y1="12" x2="16" y2="12"></line><line x1="8" y1="16" x2="12" y2="16"></line></svg>
              </div>
              <div>
                <h2 className={css({ fontSize: '20px', fontWeight: 'bold', color: 'slate.900' })}>{t('pc_title')}</h2>
                <p className={css({ fontSize: '14px', color: 'slate.500' })}>{t('pc_desc')}</p>
              </div>
            </div>

            <div className={css({ 
              display: 'grid', 
              gridTemplateColumns: { base: '1', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, 
              gap: '20px', 
              marginBottom: '32px' 
            })}>
              <div>
                <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700', marginBottom: '8px', display: 'block' })}>{t('pc_base_cost')}</label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={pcBase} 
                  onChange={(e) => setPcBase(e.target.value)} 
                  className={css({
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: 'slate.200',
                    fontSize: '14px',
                    outline: 'none',
                    _focus: { borderColor: 'blue.400', ring: '2px', ringColor: 'blue.50' }
                  })} 
                  placeholder="e.g. 25.00" 
                />
              </div>
              <div>
                <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
                  {t('pc_duties')}
                  <button
                    onClick={() => setPcDutyIsPercent(p => !p)}
                    className={css({ 
                      padding: '2px 8px', 
                      fontSize: '11px', 
                      borderRadius: '6px', 
                      backgroundColor: 'slate.100', 
                      border: 'none',
                      color: 'slate.600',
                      cursor: 'pointer',
                      _hover: { backgroundColor: 'slate.200' }
                    })}
                  >
                    {pcDutyIsPercent ? t('pc_duty_percent') : t('pc_duty_fixed')}
                  </button>
                </label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={pcDuty} 
                  onChange={(e) => setPcDuty(e.target.value)} 
                  className={css({
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: 'slate.200',
                    fontSize: '14px',
                    outline: 'none',
                    _focus: { borderColor: 'blue.400', ring: '2px', ringColor: 'blue.50' }
                  })} 
                  placeholder={pcDutyIsPercent ? 'e.g. 12 (%)' : 'e.g. 5.00 ($)'} 
                />
              </div>
              <div>
                <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700', marginBottom: '8px', display: 'block' })}>{t('pc_profit_margin')}</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  step="1" 
                  value={pcProfit} 
                  onChange={(e) => setPcProfit(e.target.value)} 
                  className={css({
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: 'slate.200',
                    fontSize: '14px',
                    outline: 'none',
                    _focus: { borderColor: 'blue.400', ring: '2px', ringColor: 'blue.50' }
                  })} 
                  placeholder="e.g. 35" 
                />
              </div>
              <div>
                <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700', marginBottom: '8px', display: 'block' })}>{t('pc_marketing_budget')}</label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={pcMarketing} 
                  onChange={(e) => setPcMarketing(e.target.value)} 
                  className={css({
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: 'slate.200',
                    fontSize: '14px',
                    outline: 'none',
                    _focus: { borderColor: 'blue.400', ring: '2px', ringColor: 'blue.50' }
                  })} 
                  placeholder="e.g. 3.00" 
                />
              </div>
            </div>

            <div className={css({ 
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6c2bd9 100%)', 
              borderRadius: '20px', 
              padding: '32px', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              flexWrap: 'wrap', 
              gap: '24px',
              boxShadow: 'lg'
            })}>
              <div>
                <div className={css({ fontSize: '14px', fontWeight: 'medium', opacity: 0.9, marginBottom: '4px' })}>{t('pc_final_price')}</div>
                <div className={css({ fontSize: '48px', fontWeight: '800', letterSpacing: 'tight' })}>${calcFinalPrice()}</div>
              </div>
              <div className={css({ 
                fontSize: '13px', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(8px)', 
                padding: '20px', 
                borderRadius: '16px', 
                border: '1px solid', 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                lineHeight: '2',
                minWidth: '220px'
              })}>
                <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
                  <span>{t('pc_base_label')}:</span>
                  <span className={css({ fontWeight: 'bold' })}>${parseFloat(pcBase || '0').toFixed(2)}</span>
                </div>
                <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
                  <span>{t('pc_duties_label')}:</span>
                  <span className={css({ fontWeight: 'bold' })}>+${pcDutyIsPercent ? (parseFloat(pcBase || '0') * (parseFloat(pcDuty || '0') / 100)).toFixed(2) : parseFloat(pcDuty || '0').toFixed(2)}</span>
                </div>
                <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
                  <span>{t('pc_profit_label')} ({pcProfit || 0}%):</span>
                  <span className={css({ fontWeight: 'bold' })}>+${(parseFloat(pcBase || '0') * (parseFloat(pcProfit || '0') / 100)).toFixed(2)}</span>
                </div>
                <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
                  <span>{t('pc_marketing_label')}:</span>
                  <span className={css({ fontWeight: 'bold' })}>+${parseFloat(pcMarketing || '0').toFixed(2)}</span>
                </div>
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
