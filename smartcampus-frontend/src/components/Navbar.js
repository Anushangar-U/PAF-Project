// src/components/Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaBell, FaUsersCog } from 'react-icons/fa';

const NAV = '#0b1628';

const Navbar = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  
  const isLoggedIn = !isLoading && !!user;

  const handleLogout = async () => {
    await logout();
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center z-10 relative">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded flex items-center justify-center text-white text-xl"
            style={{ background: NAV }}>
            🏛️
          </div>
          <span className="text-2xl font-extrabold tracking-tight" style={{ color: NAV }}>CampusSmart</span>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="font-semibold text-sm transition-colors hover:opacity-70"
          style={{ color: NAV }}>HOME</Link>
        <Link to="/about" className="font-semibold text-sm transition-colors hover:opacity-70"
          style={{ color: NAV }}>ABOUT</Link>
        <Link to="/faculties" className="font-semibold text-sm transition-colors hover:opacity-70"
          style={{ color: NAV }}>FACULTIES</Link>
        <Link to="/contact" className="font-semibold text-sm transition-colors hover:opacity-70"
          style={{ color: NAV }}>CONTACT</Link>
        
        {/* My Bookings - Only for logged in USERS (not admin) */}
        {isLoggedIn && !isAdmin && (
          <>
            <Link to="/mybookings" className="font-semibold text-sm transition-colors hover:opacity-70"
              style={{ color: NAV }}>MY BOOKINGS</Link>
            <Link to="/notifications" className="font-semibold text-sm transition-colors hover:opacity-70"
              style={{ color: NAV }}>
              <FaBell className="inline mr-1" /> NOTIFICATIONS
            </Link>
          </>
        )}
        
        {/* Admin Links - Only for admin */}
        {isLoggedIn && isAdmin && (
          <>
            <Link to="/admin" className="font-semibold text-sm transition-colors hover:opacity-70"
              style={{ color: '#dc2626' }}>ADMIN DASHBOARD</Link>
            <Link to="/admin-users" className="font-semibold text-sm transition-colors hover:opacity-70"
              style={{ color: NAV }}>
              <FaUsersCog className="inline mr-1" /> MANAGE USERS
            </Link>
            <Link to="/notifications" className="font-semibold text-sm transition-colors hover:opacity-70"
              style={{ color: NAV }}>
              <FaBell className="inline mr-1" /> NOTIFICATIONS
            </Link>
          </>
        )}
      </div>

      {/* Auth Actions */}
      <div className="flex items-center space-x-4">
        {isLoading ? (
          <div className="text-sm text-slate-400">Loading...</div>
        ) : isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              👤 {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold transition-colors hover:opacity-70"
              style={{ color: NAV }}
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="text-sm font-semibold transition-colors hover:opacity-70"
            style={{ color: NAV }}
          >
            SIGN IN
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;