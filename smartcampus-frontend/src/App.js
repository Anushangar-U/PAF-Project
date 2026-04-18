import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MyBookings from './components/Bookings/MyBookings/MyBookings';
import AdminBookings from './components/Bookings/AdminBookings/AdminBookings';
import './App.css';

function App() {
  return (
    <Router>
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
                <NavLink to="/" end>
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
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mybookings" element={<MyBookings />} />
            <Route path="/adminbookings" element={<AdminBookings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
