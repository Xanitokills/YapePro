 
import { useState, useEffect } from 'react';
import { supabase } from 'lib/supabase';
import { User } from 'types';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, session: null, loading: true });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user
        ? { id: session.user.id, email: session.user.email, role: session.user.user_metadata?.role, store_id: session.user.user_metadata?.store_id, tenant_id: session.user.user_metadata?.tenant_id } as User
        : null;
      setAuthState({ user, session, loading: false });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user
        ? { id: session.user.id, email: session.user.email, role: session.user.user_metadata?.role, store_id: session.user.user_metadata?.store_id, tenant_id: session.user.user_metadata?.tenant_id } as User
        : null;
      setAuthState({ user, session, loading: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { ...authState, signIn, signOut };
};