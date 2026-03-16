import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PlanType = 'none' | 'monthly' | 'annual';

interface Subscription {
  plan: PlanType;
  activatedAt: string | null;   // ISO date string
  renewsAt: string | null;       // ISO date string
}

interface SubscriptionContextType {
  subscription: Subscription;
  hasActivePlan: boolean;
  subscribe: (plan: 'monthly' | 'annual') => void;
  cancel: () => void;
}

const defaultSubscription: Subscription = { plan: 'none', activatedAt: null, renewsAt: null };
const STORAGE_KEY = 'paslytics_subscription';

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<Subscription>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultSubscription;
    } catch {
      return defaultSubscription;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
  }, [subscription]);

  const subscribe = (plan: 'monthly' | 'annual') => {
    const now = new Date();
    const renewsAt = new Date(now);
    if (plan === 'monthly') {
      renewsAt.setMonth(renewsAt.getMonth() + 1);
    } else {
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

  const hasActivePlan = subscription.plan !== 'none';

  return (
    <SubscriptionContext.Provider value={{ subscription, hasActivePlan, subscribe, cancel }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider');
  return ctx;
};
