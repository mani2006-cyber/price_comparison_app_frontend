import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { API_BASE } from "../lib/apiBase";

const AuthContext = createContext(null);

async function refreshRequest() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // sends the httpOnly refreshToken cookie
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data || data.success === false) return null;
    return data.accessToken || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On first load, try to silently exchange the refreshToken cookie for a
  // fresh accessToken so a page reload doesn't drop the session.
  useEffect(() => {
    let cancelled = false;
    refreshRequest().then((token) => {
      if (cancelled) return;
      if (token) setAccessToken(token);
      setInitializing(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Called after a successful /api/auth/signup or /api/auth/login response.
  const setSession = useCallback(({ user, accessToken }) => {
    setUser(user || null);
    setAccessToken(accessToken || null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Even if the network call fails, clear local state so the UI
      // reflects a logged-out session.
    }
    setUser(null);
    setAccessToken(null);
  }, []);

  const isAuthenticated = Boolean(accessToken);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isAuthenticated, initializing, setSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}