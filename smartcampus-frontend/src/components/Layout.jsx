import React from 'react';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="app-container ticket-layout">
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  );
}

export default Layout;
