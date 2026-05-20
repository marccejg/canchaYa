import { useState, useEffect, useCallback } from "react";
 // coment //
// ─── Storage helpers ───────────────────────────────────────────────────────────
const STORAGE_KEY = "auth_user";
 
const persist = (user) =>
  user
    ? localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    : localStorage.removeItem(STORAGE_KEY);
 
const restore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
 

export function useAuth() {
  const init = restore()||{};

    const [user, setUser] = useState(init);
 

  useEffect(() => { persist(user); }, [user]);
 
  const login      = useCallback((userData) => setUser(userData), []);
  const logout     = useCallback(() => setUser(null), []);
  const updateUser = useCallback((partial) => setUser((prev) => ({ ...prev, ...partial })), []);
 
  return { user, isLoggedIn: user !== null, login, logout, updateUser };
}