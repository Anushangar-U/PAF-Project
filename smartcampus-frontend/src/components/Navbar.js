import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-blue-200 px-8 py-5 flex justify-between items-center z-10 relative">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-800 rounded flex items-center justify-center text-white text-xl">
          🏛️
        </div>
        <span className="text-2xl font-extrabold text-blue-900 tracking-tight">CampusSmart</span>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-blue-900 font-semibold text-sm hover:text-blue-600 transition-colors">HOME</Link>
        <Link to="/about" className="text-blue-500 font-semibold text-sm hover:text-blue-900 transition-colors">ABOUT US</Link>
        <Link to="/contact" className="text-blue-500 font-semibold text-sm hover:text-blue-900 transition-colors">CONTACT US</Link>
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/faculties" className="text-blue-600 font-medium text-sm hover:text-blue-900 transition-colors hidden sm:block">
          Dashboard
        </Link>
        <Link to="/faculties" className="bg-blue-800 text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-blue-900 transition-colors">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
