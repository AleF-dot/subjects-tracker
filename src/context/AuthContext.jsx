import React from 'react';
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Fix: eliminado isFreshLogin — nunca se usaba para cambiar ningún comportamiento
const AuthContext = createContext({ session: null, passwordRecovery: false, loading: true });

export function AuthProvider({ children }) {
  const [session,          setSession]          = useState(null);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [loading,          setLoading]          = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setPasswordRecovery(event === "PASSWORD_RECOVERY");
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, passwordRecovery, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
