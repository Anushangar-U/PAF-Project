// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      console.log('Auth check - Token:', !!token, 'User:', !!storedUser);
      
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('Parsed user:', parsedUser);
          
          setUser(parsedUser);
          setIsAdmin(
            parsedUser.role === 'ADMIN' || 
            parsedUser.roles?.includes('ADMIN') ||
            parsedUser.authorities?.includes('ROLE_ADMIN')
          );
          
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
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
    
    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call backend logout
      await axios.post('http://localhost:9091/logout', {}, { 
        withCredentials: true 
      });
      
      // Open Google logout in background
      const googleLogoutWindow = window.open('https://accounts.google.com/Logout', '_blank');
      setTimeout(() => {
        if (googleLogoutWindow) googleLogoutWindow.close();
      }, 1000);
      
    } catch (error) {
      console.error('Backend logout error:', error);
    } finally {
      // Clear frontend state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('dev_isAdmin');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAdmin(false);
      
      // Redirect to home
      window.location.href = '/';
    }
  }, []);

  return { user, isAdmin, isLoading, logout };
};