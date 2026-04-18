import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MyBookings from './components/Bookings/MyBookings/MyBookings';
import AdminBookings from './components/Bookings/AdminBookings/AdminBookings';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import './App.css';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isPublicRoute = ['/', '/about', '/contact'].includes(location.pathname);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">🏛️</span>
          <span className="sidebar-title">CampusSmart</span>
          <span className="sidebar-subtitle">faculties • resources</span>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="/faculties">
                <span role="img" aria-label="faculties">🔎</span> Faculties
              </NavLink>
            </li>
            <li>
              <NavLink to="/mybookings">
                <span role="img" aria-label="my bookings">📖</span> My Bookings
              </NavLink>
            </li>
            <li>
              <NavLink to="/adminbookings">
                <span role="img" aria-label="admin bookings">👤</span> Admin Bookings
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faculties" element={<Dashboard />} />
          <Route path="/mybookings" element={<MyBookings />} />
          <Route path="/adminbookings" element={<AdminBookings />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
