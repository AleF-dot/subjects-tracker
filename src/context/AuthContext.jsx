import React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({ session: null, isFreshLogin: false, passwordRecovery: false, loading: true });

export function AuthProvider({ children }) {
  const [session,          setSession]          = useState(null);
  const [isFreshLogin,     setIsFreshLogin]     = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [loading,          setLoading]          = useState(true);
  const prevUserId = useRef(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUserId = session?.user?.id ?? null;
      const fresh = prevUserId.current === null && newUserId !== null && event === "SIGNED_IN";
      prevUserId.current = newUserId;
      setIsFreshLogin(fresh);
      setPasswordRecovery(event === "PASSWORD_RECOVERY");
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isFreshLogin, passwordRecovery, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
