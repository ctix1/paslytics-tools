import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { css } from '../../styled-system/css';

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
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

  const handleDelete = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  return (
    <div className={css({ maxWidth: '1200px', margin: '0 auto' })}>
      {/* Page Header */}
      <div className={css({ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      })}>
        <div>
          <h1 className={css({ fontSize: '24px', fontWeight: 600, marginBottom: '4px', color: 'slate.900' })}>{t('analysis_logs')}</h1>
          <p className={css({ color: 'slate.500', fontSize: '14px' })}>{t('logs_desc')}</p>
        </div>
        <button 
          className={css({
            paddingY: '10px',
            paddingX: '20px',
            borderRadius: 'xl',
            backgroundColor: 'brand.primary',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all',
            _hover: { backgroundColor: 'brand.secondary' }
          })}
          onClick={() => alert('Starting new analysis...')}
        >
          {t('new_analysis')}
        </button>
      </div>

      {/* Filters & Table */}
      <div className={css({
        backgroundColor: 'white',
        borderRadius: '2xl',
        border: '1px solid',
        borderColor: 'slate.100',
        boxShadow: 'sm',
        marginBottom: '32px'
      })}>
        <div className={css({ 
          display: 'flex', 
          gap: '16px', 
          padding: '16px', 
          borderBottom: '1px solid',
          borderColor: 'slate.100',
          flexWrap: 'wrap' 
        })}>
          <div className={css({ flex: 1, minWidth: '180px', position: 'relative' })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className={css({ position: 'absolute', insetInlineStart: '12px', top: '11px' })}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              className={css({
                width: '100%',
                padding: '10px',
                paddingInlineStart: '40px',
                borderRadius: 'lg',
                border: '1px solid',
                borderColor: 'slate.200',
                fontSize: '14px',
                _focus: { borderColor: 'brand.primary', outline: 'none' }
              })} 
              placeholder={t('search_products')} 
            />
          </div>
          <div className={css({ minWidth: '130px' })}>
            <select 
              className={css({
                width: '100%',
                padding: '10px',
                borderRadius: 'lg',
                border: '1px solid',
                borderColor: 'slate.200',
                fontSize: '14px',
                backgroundColor: 'white',
                _focus: { borderColor: 'brand.primary', outline: 'none' }
              })}
              defaultValue="all"
            >
              <option value="all">{t('status_all')}</option>
              <option value="completed">{t('completed')}</option>
              <option value="processing">{t('processing')}</option>
            </select>
          </div>
          <div className={css({ display: 'flex', gap: '8px' })}>
            <button 
              className={css({
                paddingY: '8px',
                paddingX: '16px',
                borderRadius: 'lg',
                border: '1px solid',
                borderColor: 'slate.200',
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                _hover: { backgroundColor: 'slate.50' }
              })}
              onClick={() => alert('Exporting Data...')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              {t('export')}
            </button>
            <button 
              className={css({
                paddingY: '8px',
                paddingX: '16px',
                borderRadius: 'lg',
                border: '1px solid',
                borderColor: 'red.200',
                color: 'red.600',
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                _hover: { backgroundColor: 'red.50' }
              })}
              onClick={() => alert('Exporting to PDF...')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              {t('export_pdf')}
            </button>
          </div>
        </div>

        <div className={css({ overflowX: 'auto' })}>
          <table className={css({ width: '100%', borderCollapse: 'collapse' })}>
            <thead>
              <tr className={css({ borderBottom: '1px solid', borderColor: 'slate.100', textAlign: isRtl ? 'right' : 'left' })}>
                <th className={css({ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: 'slate.400', textTransform: 'uppercase' })}>{t('product')}</th>
                <th className={css({ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: 'slate.400', textTransform: 'uppercase' })}>{t('date_analyzed')}</th>
                <th className={css({ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: 'slate.400', textTransform: 'uppercase' })}>{t('pas_score')}</th>
                <th className={css({ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: 'slate.400', textTransform: 'uppercase' })}>{t('status')}</th>
                <th className={css({ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: 'slate.400', textTransform: 'uppercase', textAlign: isRtl ? 'left' : 'right' })}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={5} className={css({ textAlign: 'center', padding: '48px', color: 'slate.400' })}>No logs available.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className={css({ borderBottom: '1px solid', borderColor: 'slate.50', _hover: { backgroundColor: 'slate.50' } })}>
                    <td className={css({ padding: '16px' })}>
                      <div className={css({ display: 'flex', alignItems: 'center', gap: '12px' })}>
                        <img src={log.image} alt={log.name} className={css({ width: '40px', height: '40px', borderRadius: 'lg', objectFit: 'cover' })} />
                        <div>
                          <div className={css({ fontWeight: 'bold', fontSize: '14px', color: 'slate.900' })}>{log.name}</div>
                          <div className={css({ fontSize: '12px', color: 'slate.400' })}>{log.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className={css({ padding: '16px', color: 'slate.500', fontSize: '13px' })}>{log.date}</td>
                    <td className={css({ padding: '16px' })}>
                      {log.score !== null ? (
                        <div className={css({ display: 'flex', alignItems: 'baseline', gap: '4px' })}>
                          <span className={css({ 
                            fontWeight: 'bold', 
                            fontSize: '14px', 
                            color: log.score > 70 ? 'green.600' : log.score > 50 ? 'orange.600' : 'red.600' 
                          })}>{log.score}</span>
                          <span className={css({ fontSize: '12px', color: 'slate.400' })}>/ 100</span>
                        </div>
                      ) : (
                        <span className={css({ color: 'slate.300', fontSize: '14px' })}>-</span>
                      )}
                    </td>
                    <td className={css({ padding: '16px' })}>
                      {log.status === 'completed'
                        ? <span className={css({
                            paddingY: '4px',
                            paddingX: '10px',
                            backgroundColor: 'green.50',
                            color: 'green.700',
                            borderRadius: 'full',
                            fontSize: '11px',
                            fontWeight: 'bold'
                          })}>{t('completed')}</span>
                        : <span className={css({
                            paddingY: '4px',
                            paddingX: '10px',
                            backgroundColor: 'violet.50',
                            color: 'brand.primary',
                            borderRadius: 'full',
                            fontSize: '11px',
                            fontWeight: 'bold'
                          })}>{t('processing')}</span>
                      }
                    </td>
                    <td className={css({ padding: '16px', textAlign: isRtl ? 'left' : 'right' })}>
                      <div className={css({ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: isRtl ? 'flex-start' : 'flex-end' })}>
                        <Link to="#" className={css({ 
                          color: log.status === 'completed' ? 'brand.primary' : 'slate.400', 
                          fontWeight: 'bold', 
                          fontSize: '13px', 
                          textDecoration: 'none',
                          _hover: { textDecoration: log.status === 'completed' ? 'underline' : 'none' }
                        })}>
                          {log.status === 'completed' ? t('view_report') : t('cancel')}
                        </Link>
                        <button 
                          onClick={() => handleDelete(log.id)} 
                          className={css({ 
                            color: 'red.600', 
                            fontSize: '13px', 
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            padding: '4px',
                            _hover: { backgroundColor: 'red.50', borderRadius: 'md' }
                          })}
                        >
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

        <div className={css({ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '16px 24px', 
          borderTop: '1px solid',
          borderColor: 'slate.100'
        })}>
          <p className={css({ fontSize: '13px', color: 'slate.500' })}>Showing 1 to {logs.length} of {logs.length} results</p>
          <div className={css({ display: 'flex', gap: '8px' })}>
            <button className={css({ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'lg', border: '1px solid', borderColor: 'slate.200', color: 'slate.600', cursor: 'pointer', _hover: { backgroundColor: 'slate.50' } })}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={isRtl ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'}></path></svg>
            </button>
            <button className={css({ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'lg', backgroundColor: 'brand.primary', color: 'white', fontWeight: 'bold', cursor: 'pointer' })}>1</button>
            <button className={css({ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'lg', border: '1px solid', borderColor: 'slate.200', color: 'slate.600', cursor: 'pointer', _hover: { backgroundColor: 'slate.50' } })}>2</button>
            <button className={css({ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'lg', border: '1px solid', borderColor: 'slate.200', color: 'slate.600', cursor: 'pointer', _hover: { backgroundColor: 'slate.50' } })}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={isRtl ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}></path></svg>
            </button>
          </div>
        </div>
      </div>

      <div className={css({ textAlign: 'center', color: 'slate.400', fontSize: '12px', marginTop: '48px' })}>
        © {new Date().getFullYear()} PASlytics Analysis Platform. {t('all_rights_reserved')}
      </div>
    </div>
  );
};

export default SystemLogs;
