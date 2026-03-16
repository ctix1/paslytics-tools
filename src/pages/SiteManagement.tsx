import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { css } from '../../styled-system/css';

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
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';

  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleRemoveUser = (id: string) => {
    const userToRemove = users.find(u => u.id === id);
    if (!userToRemove) return;
    if (window.confirm(`Are you sure you want to remove ${userToRemove.name} from the team?`)) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user));
  };

  return (
    <div className={css({ maxWidth: '1200px', margin: '0 auto' })}>
      {/* Header */}
      <div className={css({ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px' 
      })}>
        <div>
          <h1 className={css({ fontSize: '24px', fontWeight: 'bold', color: 'slate.900', marginBottom: '4px' })}>{t('user_management')}</h1>
          <p className={css({ color: 'slate.500', fontSize: '14px' })}>{t('manage_team')}</p>
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
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all',
            _hover: { backgroundColor: 'brand.secondary' }
          })}
          onClick={() => alert('Add User Dialog Opened')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14"></path></svg>
          {t('add_user')}
        </button>
      </div>

      {/* Stats */}
      <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' })}>
        <div className={css({ backgroundColor: 'white', borderRadius: '2xl', padding: '24px', border: '1px solid', borderColor: 'slate.100', boxShadow: 'sm' })}>
          <div className={css({ fontSize: '13px', color: 'slate.500', fontWeight: 'bold', marginBottom: '8px' })}>{t('total_users')}</div>
          <div className={css({ fontSize: '32px', fontWeight: 'bold', color: 'slate.900' })}>{users.length + 21}</div>
        </div>
        <div className={css({ backgroundColor: 'white', borderRadius: '2xl', padding: '24px', border: '1px solid', borderColor: 'slate.100', boxShadow: 'sm' })}>
          <div className={css({ fontSize: '13px', color: 'slate.500', fontWeight: 'bold', marginBottom: '8px' })}>{t('active_analysts')}</div>
          <div className={css({ fontSize: '32px', fontWeight: 'bold', color: 'brand.primary' })}>12</div>
        </div>
        <div className={css({ backgroundColor: 'white', borderRadius: '2xl', padding: '24px', border: '1px solid', borderColor: 'slate.100', boxShadow: 'sm' })}>
          <div className={css({ fontSize: '13px', color: 'slate.500', fontWeight: 'bold', marginBottom: '8px' })}>{t('pending_invites')}</div>
          <div className={css({ fontSize: '32px', fontWeight: 'bold', color: 'slate.900' })}>3</div>
        </div>
      </div>

      {/* User Table */}
      <div className={css({
        backgroundColor: 'white',
        borderRadius: '2xl',
        border: '1px solid',
        borderColor: 'slate.100',
        boxShadow: 'sm',
        overflow: 'hidden'
      })}>
        <div className={css({ overflowX: 'auto' })}>
          <table className={css({ width: '100%', borderCollapse: 'collapse' })}>
            <thead>
              <tr className={css({ backgroundColor: 'slate.50', textAlign: isRtl ? 'right' : 'left' })}>
                <th className={css({ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: 'slate.500', textTransform: 'uppercase' })}>{t('name')}</th>
                <th className={css({ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: 'slate.500', textTransform: 'uppercase' })}>{t('email')}</th>
                <th className={css({ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: 'slate.500', textTransform: 'uppercase' })}>{t('permissions')}</th>
                <th className={css({ padding: '16px' })}></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={4} className={css({ textAlign: 'center', padding: '48px', color: 'slate.400' })}>No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className={css({ borderBottom: '1px solid', borderColor: 'slate.50', _hover: { backgroundColor: 'slate.50' } })}>
                    <td className={css({ padding: '16px' })}>
                      <div className={css({ display: 'flex', alignItems: 'center', gap: '12px' })}>
                        <img 
                          className={css({ width: '36px', height: '36px', borderRadius: 'full' })} 
                          src={`https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${user.avatarSeed}&backgroundColor=${user.avatarColor}`} 
                          alt={user.name} 
                        />
                        <span className={css({ fontSize: '14px', fontWeight: 'bold', color: 'slate.900' })}>{user.name}</span>
                      </div>
                    </td>
                    <td className={css({ padding: '16px', color: 'slate.500', fontSize: '14px' })}>{user.email}</td>
                    <td className={css({ padding: '16px' })}>
                      <select
                        className={css({
                          padding: '8px',
                          borderRadius: 'lg',
                          border: '1px solid',
                          borderColor: 'slate.200',
                          fontSize: '13px',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          _focus: { borderColor: 'brand.primary', outline: 'none' }
                        })}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      >
                        <option value="Admin">{t('admin_role')}</option>
                        <option value="Analyst">{t('analyst_role')}</option>
                        <option value="Informed Member">{t('informed_member')}</option>
                      </select>
                    </td>
                    <td className={css({ padding: '16px', textAlign: isRtl ? 'left' : 'right' })}>
                      <button
                        className={css({ 
                          color: 'red.600', 
                          fontSize: '13px', 
                          fontWeight: 'bold', 
                          padding: '6px 12px',
                          cursor: 'pointer',
                          borderRadius: 'lg',
                          _hover: { backgroundColor: 'red.50' }
                        })}
                        onClick={() => handleRemoveUser(user.id)}
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

        <div className={css({ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '16px 24px', 
          borderTop: '1px solid',
          borderColor: 'slate.100'
        })}>
          <p className={css({ fontSize: '13px', color: 'slate.500' })}>Showing 1 to {users.length} of {users.length + 21} users</p>
          <div className={css({ display: 'flex', gap: '8px' })}>
            <button className={css({ paddingY: '8px', paddingX: '12px', borderRadius: 'lg', border: '1px solid', borderColor: 'slate.200', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', _hover: { backgroundColor: 'slate.50' } })} onClick={() => alert('Previous Page')}>Previous</button>
            <button className={css({ paddingY: '8px', paddingX: '12px', borderRadius: 'lg', border: '1px solid', borderColor: 'slate.200', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', _hover: { backgroundColor: 'slate.50' } })} onClick={() => alert('Next Page')}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteManagement;
