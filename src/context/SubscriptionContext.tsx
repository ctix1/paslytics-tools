import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PlanType = 'none' | 'starter' | 'monthly' | 'annual';

interface Subscription {
  plan: PlanType;
  activatedAt: string | null;   // ISO date string
  renewsAt: string | null;       // ISO date string
}

interface SubscriptionContextType {
  subscription: Subscription;
  hasActivePlan: boolean;
  subscribe: (plan: 'starter' | 'monthly' | 'annual') => void;
  cancel: () => void;
  getTimeRemaining: () => number; // seconds
}

const defaultSubscription: Subscription = { plan: 'none', activatedAt: null, renewsAt: null };
const STORAGE_KEY = 'paslytics_subscription';

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<Subscription>(() => {
    if (typeof window === 'undefined') return defaultSubscription;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return defaultSubscription;
      
      const parsed = JSON.parse(stored);
      // Automatic cancellation logic on load
      if (parsed.renewsAt && new Date(parsed.renewsAt) < new Date()) {
        localStorage.removeItem(STORAGE_KEY);
        return defaultSubscription;
      }
      return parsed;
    } catch {
      return defaultSubscription;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
    
    // Timer to handle expiration in real-time
    if (subscription.renewsAt) {
      const expirationDate = new Date(subscription.renewsAt).getTime();
      const checkExpiry = () => {
        if (Date.now() >= expirationDate) {
          setSubscription(defaultSubscription);
          localStorage.removeItem(STORAGE_KEY);
        }
      };
      
      const interval = setInterval(checkExpiry, 1000);
      return () => clearInterval(interval);
    }
  }, [subscription]);

  const subscribe = (plan: 'starter' | 'monthly' | 'annual') => {
    const now = new Date();
    const renewsAt = new Date(now);
    
    if (plan === 'starter') {
      renewsAt.setDate(renewsAt.getDate() + 5);
    } else if (plan === 'monthly') {
      renewsAt.setMonth(renewsAt.getMonth() + 1);
    } else if (plan === 'annual') {
      renewsAt.setFullYear(renewsAt.getFullYear() + 1);
    }

    setSubscription({
      plan,
      activatedAt: now.toISOString(),
      renewsAt: renewsAt.toISOString(),
    });
  };

  const cancel = () => {
    setSubscription(defaultSubscription);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getTimeRemaining = () => {
    if (!subscription.renewsAt) return 0;
    const diff = new Date(subscription.renewsAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  };

  const hasActivePlan = subscription.plan !== 'none';

  return (
    <SubscriptionContext.Provider value={{ subscription, hasActivePlan, subscribe, cancel, getTimeRemaining }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider');
  return ctx;
};
