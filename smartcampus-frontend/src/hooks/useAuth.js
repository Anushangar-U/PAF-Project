import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAdmin(
            parsedUser.role === 'ADMIN' || 
            parsedUser.roles?.includes('ADMIN') ||
            parsedUser.authorities?.includes('ROLE_ADMIN')
          );
        } catch (error) {
          console.error('Failed to parse user data:', error);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return { user, isAdmin, isLoading };
};