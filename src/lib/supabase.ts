const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Guard for window to prevent crashes during Vite build/SSR transformation
export const supabase = (typeof window !== 'undefined' && (window as any).supabase)
  ? (window as any).supabase.createClient(supabaseUrl, supabaseAnonKey)
  : { 
      auth: { 
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: { session: null, user: null }, error: null }),
        signOut: async () => {}
      },
      functions: {
        invoke: async () => ({ data: {}, error: null })
      }
    } as any;
