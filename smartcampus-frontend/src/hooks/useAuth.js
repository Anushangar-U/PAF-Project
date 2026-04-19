import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const defaultState = {
  user: null,
  currentUser: null,
  isAdmin: false,
  isTechnician: false,
  isStaff: false,
  isLoading: true,
  isLoggedIn: false,
  loginAsDemoUser: () => {},
  logout: () => {},
  switchUser: () => {},
};

function computeFallbackState() {
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!storedUser || !token) {
    return {
      ...defaultState,
      isLoading: false,
    };
  }

  try {
    const parsedUser = JSON.parse(storedUser);
    const isAdmin =
      parsedUser.role === 'ADMIN' ||
      parsedUser.roles?.includes('ADMIN') ||
      parsedUser.authorities?.includes('ROLE_ADMIN');

    const isTechnician = parsedUser.role === 'TECHNICIAN';

    return {
      ...defaultState,
      user: parsedUser,
      currentUser: parsedUser,
      isAdmin,
      isTechnician,
      isStaff: isAdmin || isTechnician,
      isLoading: false,
      isLoggedIn: true,
    };
  } catch {
    return {
      ...defaultState,
      isLoading: false,
    };
  }
}

export const useAuth = () => {
  const contextValue = useContext(AuthContext);
  const [fallbackState, setFallbackState] = useState(defaultState);

  useEffect(() => {
    if (!contextValue) {
      setFallbackState(computeFallbackState());
    }
  }, [contextValue]);

  return contextValue || fallbackState;
};