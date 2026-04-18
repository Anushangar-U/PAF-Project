import { Link } from 'react-router-dom';

const NAV = '#0b1628';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center z-10 relative">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded flex items-center justify-center text-white text-xl"
          style={{ background: NAV }}>
          🏛️
        </div>
        <span className="text-2xl font-extrabold tracking-tight" style={{ color: NAV }}>CampusSmart</span>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="font-semibold text-sm transition-colors hover:opacity-70"
          style={{ color: NAV }}>HOME</Link>
        <Link to="/about" className="font-semibold text-sm transition-colors hover:opacity-70"
          style={{ color: NAV, opacity: 0.6 }}
          onMouseEnter={e => e.target.style.opacity = 1}
          onMouseLeave={e => e.target.style.opacity = 0.6}>ABOUT US</Link>
        <Link to="/contact" className="font-semibold text-sm transition-colors hover:opacity-70"
          style={{ color: NAV, opacity: 0.6 }}
          onMouseEnter={e => e.target.style.opacity = 1}
          onMouseLeave={e => e.target.style.opacity = 0.6}>CONTACT US</Link>
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/faculties" className="font-medium text-sm hidden sm:block transition-colors hover:opacity-70"
          style={{ color: NAV }}>
          Dashboard
        </Link>
        <Link to="/faculties" className="text-white px-6 py-2.5 rounded text-sm font-semibold transition-colors hover:opacity-90"
          style={{ background: NAV }}>
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
