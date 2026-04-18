import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MyBookings from './components/Bookings/MyBookings/MyBookings';
import AdminBookings from './components/Bookings/AdminBookings/AdminBookings';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Sidebar from './components/Sidebar';
import './App.css';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isPublicRoute = ['/', '/about', '/contact'].includes(location.pathname);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout">
      <Sidebar />
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
