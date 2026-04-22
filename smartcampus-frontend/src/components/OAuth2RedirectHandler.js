// src/components/OAuth2RedirectHandler.js
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing (React StrictMode causes double render)
    if (hasProcessed.current) {
      console.log('Already processed, skipping...');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    console.log('OAuth2 Redirect - Token:', !!token, 'User:', !!userStr);

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        console.log('User data:', user);
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Mark as processed
        hasProcessed.current = true;
        
        // Dispatch storage event for other tabs/components
        window.dispatchEvent(new Event('storage'));
        
        // Redirect based on role
        if (user.role === 'ADMIN' || user.roles?.includes('ADMIN')) {
          console.log('Redirecting to admin dashboard...');
          navigate('/admin', { replace: true });
        } else {
          console.log('Redirecting to home...');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        hasProcessed.current = true;
        navigate('/login?error=parse', { replace: true });
      }
    } else {
      console.error('Missing token or user data in redirect');
      hasProcessed.current = true;
      navigate('/login?error=missing', { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: 'Arial, sans-serif',
      background: '#f8fafc'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #0f2345',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <div style={{ color: '#64748b', fontSize: '16px', fontWeight: '500' }}>
        Completing login...
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OAuth2RedirectHandler;