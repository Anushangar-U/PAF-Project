import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEMO_USERS, ROLES } from '../utils/constants';

/**
 * AuthContext.js
 * Lightweight in-memory auth store.
 * In production this integrates with JWT / OAuth tokens.
 */
const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'user';
const TOKEN_STORAGE_KEY = 'token';
const DEFAULT_TOKEN = 'mock-user-token';

function safeParseUser(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function isAdminUser(user) {
  return (
    user?.role === ROLES.ADMIN ||
    user?.roles?.includes(ROLES.ADMIN) ||
    user?.authorities?.includes('ROLE_ADMIN')
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = safeParseUser(localStorage.getItem(USER_STORAGE_KEY));
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const currentUser = user || DEMO_USERS[0];

  const loginAsDemoUser = (role = ROLES.USER) => {
    const found = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setUser(found);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(found));
    localStorage.setItem(TOKEN_STORAGE_KEY, DEFAULT_TOKEN);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem('dev_isAdmin');
  };

  /** Switch active demo user by ID */
  const switchUser = (userId) => {
    const found = DEMO_USERS.find((u) => u.id === Number(userId));
    if (found) {
      setUser(found);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(found));
      localStorage.setItem(TOKEN_STORAGE_KEY, DEFAULT_TOKEN);
    }
  };

  /** Role-check helpers */
  const isAdmin      = isAdminUser(currentUser);
  const isTechnician = currentUser?.role === ROLES.TECHNICIAN;
  const isStaff      = isAdmin || isTechnician;

  const value = useMemo(
    () => ({
      user,
      currentUser,
      switchUser,
      loginAsDemoUser,
      logout,
      DEMO_USERS,
      isAdmin,
      isTechnician,
      isStaff,
      isLoading,
      isLoggedIn: !!user,
    }),
    [user, currentUser, isAdmin, isTechnician, isStaff, isLoading]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Convenience hook */
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
