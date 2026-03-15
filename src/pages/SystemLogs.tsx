import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

type LogStatus = 'completed' | 'processing' | 'failed';

interface LogEntry {
  id: string;
  name: string;
  sku: string;
  image: string;
  date: string;
  score: number | null;
  status: LogStatus;
}

const initialLogs: LogEntry[] = [
  { id: '1', name: 'Ergonomic Office Chair', sku: 'SKU-88291', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=40&q=80', date: 'Oct 24, 2023 14:22', score: 84, status: 'completed' },
  { id: '2', name: 'Minimalist Desk Lamp', sku: 'SKU-44023', image: 'https://images.unsplash.com/photo-1543922596-b3bbaba80649?auto=format&fit=crop&w=40&q=80', date: 'Oct 23, 2023 09:15', score: 62, status: 'completed' },
  { id: '3', name: 'Mechanical Keyboard v2', sku: 'SKU-99012', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=40&q=80', date: 'Oct 23, 2023 08:00', score: null, status: 'processing' },
  { id: '4', name: 'Noise-Cancelling Headphones', sku: 'SKU-11203', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=40&q=80', date: 'Oct 22, 2023 17:44', score: 91, status: 'completed' },
  { id: '5', name: 'Portable Standing Desk', sku: 'SKU-55678', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=40&q=80', date: 'Oct 21, 2023 11:10', score: null, status: 'processing' },
];

const SystemLogs = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';

  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

  const handleDelete = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  return (
    <div className="p-8" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '1200px' }}>

          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>{t('analysis_logs')}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{t('logs_desc')}</p>
            </div>
            <button className="btn btn-primary" style={{ background: '#6c2bd9' }} onClick={() => alert('Starting new analysis...')}>{t('new_analysis')}</button>
          </div>

          {/* Filters & Table */}
          <div className="card mb-8">
            <div className="flex gap-4 p-4" style={{ borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: 'absolute', insetInlineStart: '12px', top: '11px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" className="input" placeholder={t('search_products')} style={{ paddingInlineStart: '38px', textAlign: isRtl ? 'right' : 'left', width: '100%' }} />
              </div>
              <div className="select-wrapper">
                <select style={{ minWidth: '130px' }} defaultValue="all">
                  <option value="all">{t('status_all')}</option>
                  <option value="completed">{t('completed')}</option>
                  <option value="processing">{t('processing')}</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline" onClick={() => alert('Exporting Data...')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginInlineEnd: '6px' }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  {t('export')}
                </button>
                <button className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#dc2626' }} onClick={() => alert('Exporting to PDF...')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginInlineEnd: '6px' }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  {t('export_pdf')}
                </button>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{ textAlign: isRtl ? 'right' : 'left' }}>{t('product')}</th>
                    <th style={{ textAlign: isRtl ? 'right' : 'left' }}>{t('date_analyzed')}</th>
                    <th style={{ textAlign: isRtl ? 'right' : 'left' }}>{t('pas_score')}</th>
                    <th style={{ textAlign: isRtl ? 'right' : 'left' }}>{t('status')}</th>
                    <th style={{ textAlign: isRtl ? 'left' : 'right' }}>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No logs available.</td></tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <img src={log.image} alt={log.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--text-dark)' }}>{log.name}</div>
                              <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>{log.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '13px' }}>{log.date}</td>
                        <td>
                          {log.score !== null ? (
                            <><span style={{ fontWeight: 700, color: log.score > 70 ? '#16a34a' : log.score > 50 ? '#d97706' : '#dc2626', fontSize: '14px' }}>{log.score}</span>{' '}<span style={{ fontSize: '12px', color: '#94a3b8' }}>/ 100</span></>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>-</span>
                          )}
                        </td>
                        <td>
                          {log.status === 'completed'
                            ? <span className="badge badge-outline-green">{t('completed')}</span>
                            : <span style={{ background: '#f3e8ff', color: '#6c2bd9', border: '1px solid #e9d5ff', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>{t('processing')}</span>
                          }
                        </td>
                        <td style={{ textAlign: isRtl ? 'left' : 'right' }}>
                          <div className="flex items-center gap-3" style={{ justifyContent: isRtl ? 'flex-start' : 'flex-end' }}>
                            <Link to="#" style={{ color: log.status === 'completed' ? '#6c2bd9' : '#94a3b8', fontWeight: 500, fontSize: '13px', textDecoration: 'none' }}>
                              {log.status === 'completed' ? t('view_report') : t('cancel')}
                            </Link>
                            <button onClick={() => handleDelete(log.id)} className="btn" style={{ padding: '4px 8px', color: '#dc2626', fontSize: '13px', fontWeight: 500 }}>
                              {t('delete')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Showing 1 to {logs.length} of {logs.length} results</p>
              <div className="flex gap-2">
                <button className="btn btn-outline" onClick={() => alert('Previous Page')} style={{ minWidth: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={isRtl ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'}></path></svg>
                </button>
                <button className="btn btn-primary" onClick={() => alert('Page 1')} style={{ background: '#6c2bd9', minWidth: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</button>
                <button className="btn btn-outline" onClick={() => alert('Page 2')} style={{ minWidth: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</button>
                <button className="btn btn-outline" onClick={() => alert('Next Page')} style={{ minWidth: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={isRtl ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}></path></svg>
                </button>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', marginTop: '40px' }}>
            © {new Date().getFullYear()} PASlytics Analysis Platform. {t('all_rights_reserved')}
          </div>
        </div>
    </div>
  );
};

export default SystemLogs;
