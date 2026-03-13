import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const Dashboard = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';

  // Marketing Manager state
  const [mmDescription, setMmDescription] = useState('');
  const [mmAgeMin, setMmAgeMin] = useState(18);
  const [mmAgeMax, setMmAgeMax] = useState(45);
  const [mmMen, setMmMen] = useState(50);
  const [mmPlan, setMmPlan] = useState<string | null>(null);

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
    if (!mmDescription.trim()) { alert('Please enter a product description first.'); return; }
    setMmPlan(`📊 Marketing Plan for: "${mmDescription}"

🎯 Target Audience:
  • Age Range: ${mmAgeMin}–${mmAgeMax} years
  • Gender Split: ${mmMen}% Men / ${pcWomen}% Women

📣 Recommended Channels:
  • ${mmMen > pcWomen ? 'YouTube, Reddit, Gaming' : 'Instagram, Pinterest, TikTok'}
  • Email marketing to ${mmAgeMax < 35 ? 'millennials and Gen Z' : 'adults 35+'}

📦 Content Strategy:
  • Highlight product benefits for the ${mmMen > pcWomen ? 'male' : 'female'}-dominant audience
  • Run A/B tests on age group ${mmAgeMin}–${Math.floor((mmAgeMin + mmAgeMax) / 2)}

💡 Budget Allocation:
  • 40% Digital Ads
  • 30% Content Creation
  • 20% Influencer Partnerships
  • 10% Analytics & Tracking`);
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
          <div className="flex items-center gap-3">
            <div className="avatar"><img src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Alex&backgroundColor=b6e3f4" alt="profile" /></div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>Alex Rivers</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('pro_plan')}</div>
            </div>
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
                onClick={() => alert('Exporting Report Data...')}
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

          {/* Upload Section */}
          <div className="card mb-6" style={{ padding: '40px', borderRadius: '12px' }}>
            <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6c2bd9" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <h2 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--text-dark)' }}>{t('upload_title')}</h2>
              <p style={{ marginBottom: '16px' }}>{t('upload_desc')}</p>
              <button
                className="btn"
                style={{ background: '#111827', color: 'white' }}
                onClick={() => document.getElementById('file-upload-mock')?.click()}
              >
                {t('select_files')}
              </button>
              <input type="file" id="file-upload-mock" style={{ display: 'none' }} />
            </div>
          </div>

          {/* Analysis Results Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>

            {/* Left Column: Framework Output */}
            <div className="card p-6" style={{ borderRadius: '12px' }}>
              <div className="flex items-center gap-2 mb-6">
                <div style={{ width: '6px', height: '20px', background: '#6c2bd9', borderRadius: '2px' }}></div>
                <h2 style={{ fontSize: '16px' }}>{t('pas_output')}</h2>
              </div>

              <div className="mb-6">
                <span className="badge badge-red mb-3">{t('problem')}</span>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>
                  {t('problem_text')}
                </p>
              </div>

              <div className="mb-6">
                <span className="badge badge-orange mb-3">{t('agitation')}</span>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>
                  {t('agitation_text')}
                </p>
              </div>

              <div>
                <span className="badge badge-green mb-3">{t('solution')}</span>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>
                  {t('solution_text')}
                </p>
              </div>
            </div>

            {/* Right Column: Stats */}
            <div className="flex flex-col gap-6">

              <div className="card p-6" style={{ borderRadius: '12px' }}>
                <h3 className="mb-4" style={{ color: '#6b7280', fontSize: '12px' }}>{t('emotional_resonance')}</h3>
                <div className="badge badge-purple mb-4" style={{ borderRadius: '20px', fontWeight: 700 }}>{t('score')} 88%</div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px', display: 'flex' }}>
                  <div style={{ width: '88%', height: '100%', background: '#9333ea', borderRadius: '4px' }}></div>
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
                  {t('quick_take_text')}
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
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>Marketing Manager</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Generate a targeted marketing plan based on your product analysis</p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px', display: 'block' }}>Product Description</label>
                <textarea
                  value={mmDescription}
                  onChange={(e) => setMmDescription(e.target.value)}
                  className="input"
                  style={{ width: '100%', minHeight: '80px', resize: 'vertical', padding: '10px 14px', fontFamily: 'inherit' }}
                  placeholder="Describe your product or service..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px', display: 'block' }}>
                    Target Age Range: <strong>{mmAgeMin}–{mmAgeMax}</strong>
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
                📊 Generate Marketing Plan
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
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>Product Price Calculator</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Base cost + Import duties + Profit margin + Marketing = Final price</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px', display: 'block' }}>Base Product Cost ($)</label>
                <input type="number" min="0" step="0.01" value={pcBase} onChange={(e) => setPcBase(e.target.value)} className="input" style={{ width: '100%' }} placeholder="e.g. 25.00" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px', display: 'block' }}>
                  Import Duties &amp; Taxes{' '}
                  <button
                    onClick={() => setPcDutyIsPercent(p => !p)}
                    className="btn btn-outline"
                    style={{ padding: '2px 8px', fontSize: '11px', borderRadius: '4px', display: 'inline-flex', marginLeft: '6px' }}
                  >
                    {pcDutyIsPercent ? '% of base' : 'fixed $'}
                  </button>
                </label>
                <input type="number" min="0" step="0.01" value={pcDuty} onChange={(e) => setPcDuty(e.target.value)} className="input" style={{ width: '100%' }} placeholder={pcDutyIsPercent ? 'e.g. 12 (%)' : 'e.g. 5.00 ($)'} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px', display: 'block' }}>Desired Profit Margin (%)</label>
                <input type="number" min="0" max="100" step="1" value={pcProfit} onChange={(e) => setPcProfit(e.target.value)} className="input" style={{ width: '100%' }} placeholder="e.g. 35" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px', display: 'block' }}>Marketing Budget ($)</label>
                <input type="number" min="0" step="0.01" value={pcMarketing} onChange={(e) => setPcMarketing(e.target.value)} className="input" style={{ width: '100%' }} placeholder="e.g. 3.00" />
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6c2bd9 100%)', borderRadius: '12px', padding: '24px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px' }}>Estimated Final Price</div>
                <div style={{ fontSize: '42px', fontWeight: 700, letterSpacing: '-1px' }}>${calcFinalPrice()}</div>
              </div>
              <div style={{ fontSize: '13px', opacity: 0.85, lineHeight: '2' }}>
                <div>Base Cost: ${parseFloat(pcBase || '0').toFixed(2)}</div>
                <div>Duties: +${pcDutyIsPercent ? (parseFloat(pcBase || '0') * (parseFloat(pcDuty || '0') / 100)).toFixed(2) : parseFloat(pcDuty || '0').toFixed(2)}</div>
                <div>Profit ({pcProfit || 0}%): +${(parseFloat(pcBase || '0') * (parseFloat(pcProfit || '0') / 100)).toFixed(2)}</div>
                <div>Marketing: +${parseFloat(pcMarketing || '0').toFixed(2)}</div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
