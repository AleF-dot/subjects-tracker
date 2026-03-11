import React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({ session: null, isFreshLogin: false, loading: true });

export function AuthProvider({ children }) {
  const [session,      setSession]      = useState(null);
  const [isFreshLogin, setIsFreshLogin] = useState(false);
  const [loading,      setLoading]      = useState(true);
  const prevUserId = useRef(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUserId = session?.user?.id ?? null;
      // isFreshLogin = true solo cuando el user pasa de no-logueado a logueado
      const fresh = prevUserId.current === null && newUserId !== null && event === "SIGNED_IN";
      prevUserId.current = newUserId;
      setIsFreshLogin(fresh);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isFreshLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
