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
    </div>
  );
};

export default SiteManagement;
