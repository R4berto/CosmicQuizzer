import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthCtx = {
  user: { id: string; email?: string | null } | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  token: string | null;
};

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthCtx["user"]>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange(async (_e, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      setToken(session?.access_token ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      setUser(s?.user ? { id: s.user.id, email: s.user.email } : null);
      setToken(s?.access_token ?? null);
    });
    return () => sub.data.subscription.unsubscribe();
  }, []);

  const api = useMemo(
    () => ({
      user,
      token,
      signInWithEmail: async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [user, token]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);


