import React, { createContext, useContext, useState } from 'react';
import { DEMO_USERS, ROLES } from '../utils/constants';

/**
 * AuthContext.js
 * Lightweight in-memory auth store.
 * In production this integrates with JWT / OAuth tokens.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Default to regular USER role on first load
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]);

  /** Switch active demo user by ID */
  const switchUser = (userId) => {
    const found = DEMO_USERS.find((u) => u.id === Number(userId));
    if (found) setCurrentUser(found);
  };

  /** Role-check helpers */
  const isAdmin      = currentUser.role === ROLES.ADMIN;
  const isTechnician = currentUser.role === ROLES.TECHNICIAN;
  const isStaff      = isAdmin || isTechnician;   // can update status

  return (
    <AuthContext.Provider
      value={{ currentUser, switchUser, DEMO_USERS, isAdmin, isTechnician, isStaff }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Convenience hook */
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
