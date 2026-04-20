import React, { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import NotificationsPage from './components/NotificationsPage';
import AdminUsersPage from './components/AdminUsersPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState('');

  useEffect(() => {
    fetch('http://localhost:9090/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load user: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCurrentUser(data);
        setUserError('');
      })
      .catch((error) => {
        console.error('Error fetching current user:', error);
        setUserError('Not logged in or failed to load user');
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);

  return (
    <div className="App">
      <div
        style={{
          background: '#eef4ff',
          borderBottom: '1px solid #d6e4ff',
          padding: '12px 20px',
          textAlign: 'left',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {loadingUser ? (
          <p style={{ margin: 0 }}>Loading user...</p>
        ) : currentUser ? (
          <div>
            <strong>Logged in as:</strong> {currentUser.name} ({currentUser.role})<br />
            <span>{currentUser.email}</span>
          </div>
        ) : (
          <div>
            <strong>{userError}</strong><br />
            <a href="http://localhost:9090/oauth2/authorization/google">
              Sign in with Google
            </a>
          </div>
        )}
      </div>

      <Dashboard />
        <NotificationsPage currentUser={currentUser} />
        <AdminUsersPage />
    </div>
  );
}

export default App;