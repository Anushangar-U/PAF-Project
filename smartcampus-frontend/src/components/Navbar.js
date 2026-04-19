import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NAV = '#0b1628';

const Navbar = () => {
  const { user, isAdmin, loginAsDemoUser, logout } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSignIn = () => {
    loginAsDemoUser();
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
        <Link to="/tickets" className="font-semibold text-sm transition-colors hover:opacity-70"
          style={{ color: NAV }}>TICKETS</Link>
        <Link to="/contact" className="font-semibold text-sm transition-colors hover:opacity-70"
          style={{ color: NAV }}>CONTACT</Link>
        
        {/* My Bookings - Only for logged in USERS (not admin) */}
        {isLoggedIn && !isAdmin && (
          <Link to="/mybookings" className="font-semibold text-sm transition-colors hover:opacity-70"
            style={{ color: NAV }}>MY BOOKINGS</Link>
        )}
        
        {/* Admin Panel - Only for admin */}
        {isAdmin && (
          <Link to="/admin" className="font-semibold text-sm transition-colors hover:opacity-70"
            style={{ color: '#dc2626' }}>ADMIN</Link>
        )}
      </div>

      {/* Auth Actions */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-sm font-semibold transition-colors hover:opacity-70"
            style={{ color: NAV }}
          >
            LOGOUT
          </button>
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