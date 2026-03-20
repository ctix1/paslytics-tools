import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar_url?: string;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check initial session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      handleSession(session);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  
  // 1. أهم خطوة: فعّل الـ Loading فوراً لمنع الـ Router من إظهار 404
  setLoading(true); 

  if (session) {
    const user = session.user;
    const email = (user.email || user.user_metadata?.email || '').trim().toLowerCase();

    // منطق التحقق من الأدمن (تأكد من وجود هذه الأسطر)
    const isHardcodedAdmin = email === 'koo111333@gmail.com';
    const meta = user.user_metadata || {};
    const appMeta = user.app_metadata || {};
    const isMetaAdmin = meta.is_admin === true || meta.role === 'admin' || appMeta.role === 'admin';
    const isAdmin = isHardcodedAdmin || isMetaAdmin;

    const name = meta.full_name || meta.name || meta.display_name || email.split('@')[0] || 'User';
    const avatar = meta.avatar_url || meta.picture || '';

    const newProfile: UserProfile = {
      email,
      name: name.trim(),
      role: isAdmin ? 'admin' : 'user',
      avatar_url: avatar
    };

    // 2. تحديث الحالة
    setUser(user);
    setProfile(newProfile);
    localStorage.setItem('user_profile', JSON.stringify(newProfile));
  } else {
    // 3. تنظيف البيانات القديمة عند تسجيل الخروج
    setUser(null);
    setProfile(null);
    localStorage.removeItem('user_profile');
  }

  // 4. أخيراً: أغلق الـ Loading بعد التأكد من أن كل البيانات أصبحت جاهزة
  setLoading(false); 
};

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, name: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user_profile');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
