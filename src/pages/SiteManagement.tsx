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
    <div className="p-8" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '1000px' }}>
        <div className="flex justify-between items-center mb-6">
          <h1 style={{ fontSize: '24px', fontWeight: 600 }}>{t('site_management')}</h1>
          <button className="btn btn-primary" style={{ background: '#6c2bd9' }}>{t('add_user')}</button>
        </div>

        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: isRtl ? 'right' : 'left' }}>{t('user')}</th>
                  <th style={{ textAlign: isRtl ? 'right' : 'left' }}>{t('role')}</th>
                  <th style={{ textAlign: isRtl ? 'left' : 'right' }}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `#${user.avatarColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, color: '#475569' }}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-dark)' }}>{user.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="input"
                        style={{ padding: '4px 8px', fontSize: '13px', width: 'auto' }}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Analyst">Analyst</option>
                        <option value="Informed Member">Informed Member</option>
                      </select>
                    </td>
                    <td style={{ textAlign: isRtl ? 'left' : 'right' }}>
                      <button onClick={() => handleRemoveUser(user.id)} className="btn" style={{ color: '#dc2626', fontSize: '13px' }}>
                        {t('remove')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteManagement;
