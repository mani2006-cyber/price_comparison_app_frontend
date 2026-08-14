import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { API_BASE } from "../lib/apiBase";
import { decodeJwtExpMs } from "../lib/jwt";

// Refresh this many ms before the access token's real expiry - early enough
// that an in-flight request started right before the deadline doesn't lose
// the race, but not so early it refreshes needlessly often.
const REFRESH_SKEW_MS = 60_000;

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

  // The access token is short-lived (15m server-side) and otherwise would
  // just sit in memory unrefreshed for the rest of the tab's life - every
  // request past that point would 401 with "Invalid or expired access
  // token" and never recover short of a full page reload. This schedules a
  // silent refresh ahead of the token's own `exp` claim (not a guessed
  // interval, so it stays correct even if the server-side TTL changes) and
  // reschedules itself every time a new token comes in - covering login,
  // signup, and this refresh itself.
  useEffect(() => {
    if (!accessToken) return undefined;

    const expiresAt = decodeJwtExpMs(accessToken);
    if (!expiresAt) return undefined;

    const delay = Math.max(0, expiresAt - Date.now() - REFRESH_SKEW_MS);
    const timer = setTimeout(async () => {
      const token = await refreshRequest();
      if (token) {
        setAccessToken(token);
      } else {
        // Refresh token itself expired/revoked - reflect logged-out state
        // locally rather than keep firing requests with a dead token.
        setUser(null);
        setAccessToken(null);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [accessToken]);

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