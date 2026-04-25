// src/components/OAuth2RedirectHandler.js
import { useEffect, useRef } from 'react';

const OAuth2RedirectHandler = () => {
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    console.log('OAuth Redirect - token:', token);
    console.log('OAuth Redirect - userStr:', userStr);

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        console.log('OAuth Redirect - parsed user:', user);
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        hasProcessed.current = true;
        
        // FULL PAGE RELOAD to trigger AuthContext
        window.location.href = user.role === 'ADMIN' ? '/admin' : '/';
      } catch (error) {
        console.error('OAuth parse error:', error);
        window.location.href = '/login?error=parse';
      }
    } else {
      console.error('Missing token or user');
      window.location.href = '/login?error=missing';
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f8fafc',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div className="loading-spinner"></div>
      <p>Completing login...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;