"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Toast } from "@/components/ui/Toast";

const AuthGateContext = createContext(null);

export function AuthGateProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [promptState, setPromptState] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setSessionChecked(true);
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data?.session?.user || null);
      setSessionChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user || null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const openAuthPrompt = useCallback(
    ({
      title = "Join MOUAU Connect",
      message = "Join MOUAU Connect to interact, connect with others and unlock more opportunities.",
      nextUrl = "/",
    } = {}) => {
      setPromptState({ title, message, nextUrl });
    },
    []
  );

  const closeAuthPrompt = useCallback(() => {
    setPromptState(null);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setToast("You have signed out.");
  }, []);

  return (
    <AuthGateContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        sessionChecked,
        promptState,
        openAuthPrompt,
        closeAuthPrompt,
        showToast,
        signOut,
      }}
    >
      {children}
      <Toast message={toast} />
    </AuthGateContext.Provider>
  );
}

export function useAuthGate() {
  const ctx = useContext(AuthGateContext);
  if (!ctx) {
    throw new Error("useAuthGate must be used inside AuthGateProvider");
  }
  return ctx;
}
