import React from 'react';

function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:9091/oauth2/authorization/google';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f8fafc',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '18px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        textAlign: 'center',
        maxWidth: '420px',
        width: '100%'
      }}>
        <h1 style={{ marginBottom: '12px', color: '#0f2345' }}>Smart Campus Login</h1>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          Sign in with your Google account to access notifications and role-based features.
        </p>

        <button
          onClick={handleGoogleLogin}
          style={{
            background: '#0f2345',
            color: '#fff',
            border: 'none',
            padding: '14px 22px',
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
