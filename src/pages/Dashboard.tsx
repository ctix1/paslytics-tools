import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { css } from '../../styled-system/css';
import { 
  Upload, 
  FileText,
  CheckCircle2,
  BrainCircuit,
  Zap,
  ArrowRight,
  Calculator,
  Megaphone,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const { hasActivePlan } = useSubscription();
  const { profile } = useAuth();

  // Check generic user profile role
  const isAdmin = profile?.role === 'admin';
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

  // Marketing Manager state
  const [mmDescription, setMmDescription] = useState('');
  const [mmAgeMin] = useState(18);
  const [mmAgeMax] = useState(35);
  const [mmMen] = useState(50);

  // Product Calculator state
  const [pcBase, setPcBase] = useState('');
  const [pcDuty] = useState('0');
  const [pcDutyIsPercent] = useState(true);
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
    const planText = `${t('mm_plan_title')} "${mmDescription}"

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
    
    // For now, let's just alert the plan or we could log it
    alert(planText);
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
          console.error("Supabase Error:", error);
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
        alert(`Analysis Error: ${err.message || "Unknown error"}\n\nPlease check your OpenAI credits or Edge Function logs if this persists.`);
        
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
    <div className={css({ 
      padding: '32px', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      minHeight: '100vh',
      direction: isRtl ? 'rtl' : 'ltr'
    })}>
      {/* Header Section */}
      <header className={css({ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '40px'
      })}>
        <div>
          <h1 className={css({ 
            fontSize: '32px', 
            fontWeight: 'black', 
            color: 'slate.900',
            letterSpacing: 'tight',
            marginBottom: '8px'
          })}>
            {t('pas_analysis_title')}
          </h1>
          <p className={css({ color: 'slate.500', fontSize: '16px' })}>
            {isRtl ? 'حول ميزات منتجك إلى فوائد عاطفية مقنعة.' : 'Transform your product features into compelling emotional benefits.'}
          </p>
        </div>
        
        <div className={css({ display: 'flex', gap: '12px' })}>
          <button 
            onClick={() => alert('Exporting Report...')}
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingY: '10px',
              paddingX: '18px',
              borderRadius: 'xl',
              border: '1px solid',
              borderColor: 'slate.200',
              backgroundColor: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'slate.600',
              cursor: 'pointer',
              transition: 'all',
              _hover: { backgroundColor: 'slate.50', borderColor: 'slate.300', color: 'slate.900' }
            })}
          >
            <FileText className={css({ width: '18px', height: '18px' })} />
            {t('export_report')}
          </button>
          
          <button 
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingY: '10px',
              paddingX: '18px',
              borderRadius: 'xl',
              backgroundColor: 'brand.primary',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'white',
              cursor: 'pointer',
              transition: 'all',
              boxShadow: '0 10px 15px -3px rgba(109, 40, 217, 0.2)',
              _hover: { backgroundColor: 'brand.secondary', transform: 'translateY(-1px)' },
              _active: { transform: 'translateY(0)' }
            })}
          >
            <Plus className={css({ width: '18px', height: '18px' })} />
            {t('run_new_analysis')}
          </button>
        </div>
      </header>

      {/* Subscription Wall */}
      {!hasAccess && (
        <div className={css({
          backgroundColor: 'white',
          borderRadius: '3xl',
          padding: '64px',
          textAlign: 'center',
          border: '1px solid',
          borderColor: 'slate.100',
          boxShadow: '2xl',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden'
        })}>
          <div className={css({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(to right, brand.primary, brand.secondary)'
          })} />
          
          <div className={css({
            width: '80px',
            height: '80px',
            backgroundColor: 'violet.50',
            borderRadius: '2xl',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'brand.primary'
          })}>
            <Zap className={css({ width: '40px', height: '40px' })} />
          </div>
          
          <h2 className={css({ fontSize: '28px', fontWeight: 'black', color: 'slate.900', marginBottom: '12px' })}>
            {isRtl ? 'هذه الميزة متاحة للمشتركين فقط' : 'Premium Feature Access'}
          </h2>
          <p className={css({ color: 'slate.500', fontSize: '18px', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 'relaxed' })}>
            {isRtl ? 'يرجى الترقية إلى خطة مدفوعة لفتح أدوات تحليل الصور وإنشاء تقارير نموذج PAS.' : 'Please upgrade to a paid plan to unlock image analysis tools and PAS framework generation.'}
          </p>
          
          <Link to="/plan" className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            paddingY: '16px',
            paddingX: '32px',
            borderRadius: '2xl',
            backgroundColor: 'brand.primary',
            fontSize: '16px',
            fontWeight: 'black',
            color: 'white',
            textDecoration: 'none',
            transition: 'all',
            boxShadow: 'lg',
            _hover: { backgroundColor: 'brand.secondary', transform: 'scale(1.02)' }
          })}>
            {isRtl ? 'اكتشف الخطط هنا' : 'Explore Plans Here'}
            <ArrowRight className={css({ width: '20px', height: '20px' })} />
          </Link>
        </div>
      )}

      {hasAccess && (
        <div className={css({ display: 'grid', gap: '32px' })}>
          {/* Upload Section */}
          <section className={css({
            backgroundColor: isUploading ? 'violet.50' : 'white',
            borderRadius: '3xl',
            padding: '40px',
            border: '2px dashed',
            borderColor: isUploading ? 'brand.primary' : 'slate.200',
            transition: 'all',
            textAlign: 'center'
          })}>
            <input 
              type="file" 
              id="dashboard-upload" 
              className={css({ display: 'none' })} 
              accept="image/*"
              onChange={handleUpload}
            />
            
            {!isUploading && !analysisComplete && (
              <div onClick={() => document.getElementById('dashboard-upload')?.click()} className={css({ cursor: 'pointer' })}>
                <div className={css({
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'violet.50',
                  borderRadius: '2xl',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'brand.primary'
                })}>
                  <Upload className={css({ width: '32px', height: '32px' })} />
                </div>
                <h2 className={css({ fontSize: '20px', fontWeight: 'black', color: 'slate.900', marginBottom: '8px' })}>
                  {t('upload_title')}
                </h2>
                <p className={css({ color: 'slate.500', marginBottom: '24px' })}>
                  {t('upload_desc')}
                </p>
                <button className={css({
                  paddingY: '12px',
                  paddingX: '24px',
                  borderRadius: 'xl',
                  backgroundColor: 'slate.900',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer'
                })}>
                  {t('select_files')}
                </button>
              </div>
            )}

            {isUploading && (
              <div className={css({ maxWidth: '400px', margin: '0 auto' })}>
                <div className={css({ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' })}>
                  <span className={css({ fontWeight: 'bold', color: 'brand.primary' })}>
                    {isRtl ? 'جاري التحليل بالذكاء الاصطناعي...' : 'AI Analysis in progress...'}
                  </span>
                  <span className={css({ fontWeight: 'bold', color: 'slate.900' })}>{uploadProgress}%</span>
                </div>
                <div className={css({ width: '100%', height: '10px', backgroundColor: 'slate.100', borderRadius: 'full', overflow: 'hidden' })}>
                  <div className={css({ 
                    width: `${uploadProgress}%`, 
                    height: '100%', 
                    backgroundColor: 'brand.primary',
                    transition: 'width 0.3s ease'
                  })} />
                </div>
              </div>
            )}

            {analysisComplete && (
              <div>
                <div className={css({
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'green.50',
                  borderRadius: '2xl',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'green.600'
                })}>
                  <CheckCircle2 className={css({ width: '32px', height: '32px' })} />
                </div>
                <h2 className={css({ fontSize: '20px', fontWeight: 'black', color: 'green.700', marginBottom: '4px' })}>
                  {isRtl ? 'تم التحليل بنجاح' : 'Analysis Complete'}
                </h2>
                <p className={css({ color: 'slate.500', marginBottom: '20px' })}>
                  {isRtl ? 'تم استخراج نقاط PAS بنجاح.' : 'PAS frameworks generated successfully.'}
                </p>
                <button 
                  onClick={() => { setAnalysisComplete(false); setPasOutput({ problem: '', agitation: '', solution: '', ai_quick_take: '', emotional_score: 88 }); }}
                  className={css({
                    paddingY: '10px',
                    paddingX: '20px',
                    borderRadius: 'lg',
                    border: '1px solid',
                    borderColor: 'slate.200',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer'
                  })}
                >
                  {isRtl ? 'تحليل صورة جديدة' : 'Analyze New Image'}
                </button>
              </div>
            )}
          </section>

          {/* Analysis Content */}
          <div className={css({
            opacity: analysisComplete ? 1 : 0.3,
            pointerEvents: analysisComplete ? 'auto' : 'none',
            transition: 'opacity 0.5s',
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: '1.5fr 1fr' },
            gap: '32px'
          })}>
            {/* Framework Column */}
            <div className={css({
              backgroundColor: 'white',
              borderRadius: '3xl',
              padding: '40px',
              border: '1px solid',
              borderColor: 'slate.100',
              boxShadow: 'xl'
            })}>
              <div className={css({ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' })}>
                <div className={css({ width: '4px', height: '24px', backgroundColor: 'brand.primary', borderRadius: 'full' })} />
                <h2 className={css({ fontSize: '20px', fontWeight: 'black', color: 'slate.900' })}>{t('pas_output')}</h2>
              </div>

              <div className={css({ display: 'grid', gap: '32px' })}>
                <div className={css({
                  padding: '24px',
                  backgroundColor: 'red.50',
                  borderRadius: '2xl',
                  border: '1px solid',
                  borderColor: 'red.100'
                })}>
                  <div className={css({
                    display: 'inline-flex',
                    padding: '4px 12px',
                    backgroundColor: 'red.600',
                    color: 'white',
                    borderRadius: 'full',
                    fontSize: '11px',
                    fontWeight: 'black',
                    textTransform: 'uppercase',
                    letterSpacing: 'wider',
                    marginBottom: '16px'
                  })}>{t('problem')}</div>
                  <p className={css({ color: 'slate.800', lineHeight: 'relaxed', fontWeight: 'medium' })}>
                    {pasOutput.problem || t('problem_text')}
                  </p>
                </div>

                <div className={css({
                  padding: '24px',
                  backgroundColor: 'orange.50',
                  borderRadius: '2xl',
                  border: '1px solid',
                  borderColor: 'orange.100'
                })}>
                  <div className={css({
                    display: 'inline-flex',
                    padding: '4px 12px',
                    backgroundColor: 'orange.500',
                    color: 'white',
                    borderRadius: 'full',
                    fontSize: '11px',
                    fontWeight: 'black',
                    textTransform: 'uppercase',
                    letterSpacing: 'wider',
                    marginBottom: '16px'
                  })}>{t('agitation')}</div>
                  <p className={css({ color: 'slate.800', lineHeight: 'relaxed', fontWeight: 'medium' })}>
                    {pasOutput.agitation || t('agitation_text')}
                  </p>
                </div>

                <div className={css({
                  padding: '24px',
                  backgroundColor: 'green.50',
                  borderRadius: '2xl',
                  border: '1px solid',
                  borderColor: 'green.100'
                })}>
                  <div className={css({
                    display: 'inline-flex',
                    padding: '4px 12px',
                    backgroundColor: 'green.600',
                    color: 'white',
                    borderRadius: 'full',
                    fontSize: '11px',
                    fontWeight: 'black',
                    textTransform: 'uppercase',
                    letterSpacing: 'wider',
                    marginBottom: '16px'
                  })}>{t('solution')}</div>
                  <p className={css({ color: 'slate.800', lineHeight: 'relaxed', fontWeight: 'medium' })}>
                    {pasOutput.solution || t('solution_text')}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Column */}
            <div className={css({ display: 'grid', gap: '32px', alignContent: 'start' })}>
              <div className={css({
                backgroundColor: 'white',
                borderRadius: '3xl',
                padding: '32px',
                border: '1px solid',
                borderColor: 'slate.100',
                boxShadow: 'lg'
              })}>
                <h3 className={css({ fontSize: '13px', fontWeight: 'bold', color: 'slate.500', marginBottom: '20px', textTransform: 'uppercase' })}>
                  {t('emotional_resonance')}
                </h3>
                <div className={css({ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: 'violet.100',
                  color: 'violet.700',
                  borderRadius: 'xl',
                  fontWeight: 'black',
                  marginBottom: '20px'
                })}>
                  <BrainCircuit className={css({ width: '18px', height: '18px' })} />
                  {t('score')} {pasOutput.emotional_score}%
                </div>
                <div className={css({ width: '100%', height: '12px', backgroundColor: 'slate.100', borderRadius: 'full', overflow: 'hidden', marginBottom: '16px' })}>
                  <div className={css({ 
                    width: `${pasOutput.emotional_score}%`, 
                    height: '100%', 
                    background: 'linear-gradient(to right, brand.primary, brand.secondary)',
                    borderRadius: 'full'
                  })} />
                </div>
                <p className={css({ fontSize: '13px', color: 'slate.500', lineHeight: 'relaxed' })}>
                  {t('agitation_scores')}
                </p>
              </div>

              <div className={css({
                padding: '32px',
                backgroundColor: 'slate.900',
                borderRadius: '3xl',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              })}>
                <div className={css({
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  backgroundColor: 'white',
                  opacity: 0.05,
                  borderRadius: 'full'
                })} />
                <h3 className={css({ fontSize: '13px', fontWeight: 'bold', color: 'slate.400', marginBottom: '16px', textTransform: 'uppercase' })}>
                  {t('ai_quick_take')}
                </h3>
                <p className={css({ fontSize: '15px', color: 'slate.200', lineHeight: 'relaxed', position: 'relative' })}>
                  {pasOutput.ai_quick_take || t('quick_take_text')}
                </p>
              </div>

              {/* Marketing Manager Tool */}
              <div className={css({
                backgroundColor: 'white',
                borderRadius: '3xl',
                padding: '32px',
                border: '1px solid',
                borderColor: 'slate.100',
                boxShadow: 'lg'
              })}>
                <div className={css({ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' })}>
                  <div className={css({ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: 'amber.50', 
                    color: 'amber.600',
                    borderRadius: 'xl',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  })}>
                    <Megaphone className={css({ width: '20px', height: '20px' })} />
                  </div>
                  <h3 className={css({ fontSize: '18px', fontWeight: 'black', color: 'slate.900' })}>{t('mm_title')}</h3>
                </div>
                
                <div className={css({ display: 'grid', gap: '16px' })}>
                  <textarea 
                    value={mmDescription}
                    onChange={(e) => setMmDescription(e.target.value)}
                    placeholder={t('mm_product_placeholder')}
                    className={css({
                      width: '100%',
                      minHeight: '100px',
                      padding: '16px',
                      borderRadius: 'xl',
                      border: '1px solid',
                      borderColor: 'slate.200',
                      fontSize: '14px',
                      _focus: { borderColor: 'brand.primary', outline: 'none' }
                    })}
                  />
                  <div className={css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' })}>
                    <div className={css({
                      padding: '12px',
                      backgroundColor: 'slate.50',
                      borderRadius: 'lg',
                      textAlign: 'center'
                    })}>
                      <span className={css({ fontSize: '10px', color: 'slate.400', fontWeight: 'bold', textTransform: 'uppercase' })}>{t('gender_target')}</span>
                      <div className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700' })}>
                        {mmMen}% M / {pcWomen}% W
                      </div>
                    </div>
                    <div className={css({
                      padding: '12px',
                      backgroundColor: 'slate.50',
                      borderRadius: 'lg',
                      textAlign: 'center'
                    })}>
                      <span className={css({ fontSize: '10px', color: 'slate.400', fontWeight: 'bold', textTransform: 'uppercase' })}>{t('age_target')}</span>
                      <div className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700' })}>
                        {mmAgeMin}-{mmAgeMax}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleGeneratePlan}
                    className={css({
                      paddingY: '12px',
                      borderRadius: 'xl',
                      backgroundColor: 'brand.primary',
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      width: '100%',
                      _hover: { backgroundColor: 'brand.secondary' }
                    })}
                  >
                    {t('mm_generate')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Calculator */}
          <section className={css({
            backgroundColor: 'white',
            borderRadius: '3xl',
            padding: '40px',
            border: '1px solid',
            borderColor: 'slate.100',
            boxShadow: 'xl',
            marginTop: '16px'
          })}>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' })}>
              <div className={css({ 
                width: '48px', 
                height: '48px', 
                backgroundColor: 'blue.50', 
                color: 'blue.600',
                borderRadius: '2xl',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              })}>
                <Calculator className={css({ width: '24px', height: '24px' })} />
              </div>
              <div>
                <h2 className={css({ fontSize: '22px', fontWeight: 'black', color: 'slate.900' })}>{t('pc_title')}</h2>
                <p className={css({ color: 'slate.500', fontSize: '14px' })}>{t('pc_desc')}</p>
              </div>
            </div>

            <div className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' }, gap: '40px', alignItems: 'start' })}>
              <div className={css({ display: 'grid', gap: '20px' })}>
                <div className={css({ display: 'grid', gap: '8px' })}>
                  <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700' })}>{t('pc_base_cost')}</label>
                  <input 
                    type="number" 
                    value={pcBase}
                    onChange={(e) => setPcBase(e.target.value)}
                    placeholder="25.00"
                    className={css({ width: '100%', padding: '14px', borderRadius: 'xl', border: '1px solid', borderColor: 'slate.200' })}
                  />
                </div>
                
                <div className={css({ display: 'grid', gap: '8px' })}>
                  <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700' })}>{t('pc_profit_margin')} (%)</label>
                  <input 
                    type="number" 
                    value={pcProfit}
                    onChange={(e) => setPcProfit(e.target.value)}
                    placeholder="35"
                    className={css({ width: '100%', padding: '14px', borderRadius: 'xl', border: '1px solid', borderColor: 'slate.200' })}
                  />
                </div>

                <div className={css({ display: 'grid', gap: '8px' })}>
                  <label className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.700' })}>{t('pc_marketing_budget')}</label>
                  <input 
                    type="number" 
                    value={pcMarketing}
                    onChange={(e) => setPcMarketing(e.target.value)}
                    placeholder="5.00"
                    className={css({ width: '100%', padding: '14px', borderRadius: 'xl', border: '1px solid', borderColor: 'slate.200' })}
                  />
                </div>
              </div>

              <div className={css({
                padding: '40px',
                backgroundColor: 'slate.50',
                borderRadius: '3xl',
                border: '1px solid',
                borderColor: 'slate.100',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              })}>
                <div>
                  <span className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.400', textTransform: 'uppercase' })}>{t('pc_final_price')}</span>
                  <div className={css({ fontSize: '48px', fontWeight: 'black', color: 'brand.primary', letterSpacing: 'tighter' })}>
                    ${calcFinalPrice()}
                  </div>
                </div>
                
                <div className={css({ 
                  fontSize: '13px', 
                  lineHeight: '2', 
                  color: 'slate.600',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                })}>
                  <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
                    <span className={css({ color: 'slate.500' })}>{t('pc_base_label')}:</span>
                    <span className={css({ fontWeight: 'bold' })}>${parseFloat(pcBase || '0').toFixed(2)}</span>
                  </div>
                  <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
                    <span className={css({ color: 'slate.500' })}>{t('pc_profit_label')} ({pcProfit || 0}%):</span>
                    <span className={css({ fontWeight: 'bold' })}>+${(parseFloat(pcBase || '0') * (parseFloat(pcProfit || '0') / 100)).toFixed(2)}</span>
                  </div>
                  <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
                    <span className={css({ color: 'slate.500' })}>{t('pc_marketing_label')}:</span>
                    <span className={css({ fontWeight: 'bold' })}>+${parseFloat(pcMarketing || '0').toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
