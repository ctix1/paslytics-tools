import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

type UserRole = 'Admin' | 'Analyst' | 'Informed Member';

interface User {
  id: string;
  name: string;
  email: string;
  avatarSeed: string;
  avatarColor: string;
  role: UserRole;
}

const initialUsers: User[] = [
  { id: '1', name: 'Jane Doe', email: 'jane.doe@example.com', avatarSeed: 'Jane', avatarColor: 'cbd5e1', role: 'Admin' },
  { id: '2', name: 'Mark Smith', email: 'm.smith@product-tool.io', avatarSeed: 'Mark', avatarColor: 'e2e8f0', role: 'Analyst' },
  { id: '3', name: 'Alice Lundberg', email: 'alice.l@example.com', avatarSeed: 'Alice', avatarColor: 'f1f5f9', role: 'Informed Member' },
];

const SiteManagement = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';

  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleRemoveUser = (id: string) => {
    const userToRemove = users.find(u => u.id === id);
    if (!userToRemove) return;
    if (window.confirm(t('remove_user_confirm').replace('{name}', userToRemove.name))) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user));
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
            PASlytics
          </div>
          <button onClick={toggleLanguage} className="btn" style={{ padding: '4px 8px', fontSize: '10px' }}>
            {isRtl ? 'EN' : 'AR'}
          </button>
        </div>

        <nav className="sidebar-nav mt-4" style={{ flex: 1 }}>
          <Link to="/dashboard" className="nav-item">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            {t('dashboard')}
          </Link>
          <Link to="/logs" className="nav-item">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            {t('logs')}
          </Link>
          <Link to="/management" className="nav-item active" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', [isRtl ? 'right' : 'left']: '-24px', top: 0, bottom: 0, width: '4px', background: 'var(--primary)', borderRadius: isRtl ? '4px 0 0 4px' : '0 4px 4px 0' }}></div>
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
          <Link to="/login" className="nav-item" style={{ color: '#ef4444' }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            {t('logout') || 'Log Out'}
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ marginInlineStart: '260px', marginInlineEnd: 0 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>{t('user_management')}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{t('manage_team')}</p>
            </div>
            <button className="btn btn-primary" style={{ background: '#6c2bd9' }} onClick={() => alert('Add User Dialog Opened')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14"></path></svg>
              <span style={{ marginInlineStart: '6px' }}>{t('add_user')}</span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-8" style={{ flexWrap: 'wrap' }}>
            <div className="card" style={{ flex: 1, minWidth: '140px', padding: '24px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '8px' }}>{t('total_users')}</div>
              <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-dark)' }}>{users.length + 21}</div>
            </div>
            <div className="card" style={{ flex: 1, minWidth: '140px', padding: '24px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '8px' }}>{t('active_analysts')}</div>
              <div style={{ fontSize: '32px', fontWeight: 600, color: '#6c2bd9' }}>12</div>
            </div>
            <div className="card" style={{ flex: 1, minWidth: '140px', padding: '24px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '8px' }}>{t('pending_invites')}</div>
              <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-dark)' }}>3</div>
            </div>
          </div>

          {/* User Table */}
          <div className="card" style={{ borderRadius: '12px' }}>
            <div className="table-container">
              <table style={{ width: '100%', textAlign: isRtl ? 'right' : 'left' }}>
                <thead style={{ background: '#f1f5f9' }}>
                  <tr>
                    <th style={{ textAlign: isRtl ? 'right' : 'left' }}>{t('name')}</th>
                    <th style={{ textAlign: isRtl ? 'right' : 'left' }}>{t('email')}</th>
                    <th style={{ textAlign: isRtl ? 'right' : 'left' }}>{t('permissions')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>{t('no_users')}</td></tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar" style={{ width: '36px', height: '36px' }}>
                              <img src={`https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${user.avatarSeed}&backgroundColor=${user.avatarColor}`} alt={user.name} />
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-dark)' }}>{user.name}</span>
                          </div>
                        </td>
                        <td style={{ color: '#64748b' }}>{user.email}</td>
                        <td>
                          <div className="select-wrapper">
                            <select
                              style={{ width: '100%' }}
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            >
                              <option value="Admin">{t('admin_role')}</option>
                              <option value="Analyst">{t('analyst_role')}</option>
                              <option value="Informed Member">{t('informed_member')}</option>
                            </select>
                          </div>
                        </td>
                        <td style={{ textAlign: isRtl ? 'left' : 'right' }}>
                          <button
                            className="btn"
                            onClick={() => handleRemoveUser(user.id)}
                            style={{ color: '#dc2626', fontSize: '13px', fontWeight: 600, padding: '6px 12px' }}
                          >
                            {t('remove')}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                {t('showing')} 1 {t('to')} {users.length} {t('of')} {users.length + 21} {t('users_label')}
              </p>
              <div className="flex gap-2" style={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <button className="btn btn-outline" onClick={() => alert('Previous Page')} style={{ padding: '6px 12px', fontSize: '13px' }}>{t('previous')}</button>
                <button className="btn btn-outline" onClick={() => alert('Next Page')} style={{ padding: '6px 12px', fontSize: '13px' }}>{t('next')}</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SiteManagement;
