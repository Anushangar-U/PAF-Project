import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const NavItem = ({ to, icon: Icon, label, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        )
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );

  const SidebarContent = ({ onNavClick }) => (
    <div className="flex flex-col h-full">
      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <NavItem to="/faculties" icon={LayoutDashboard} label="Faculties" onClick={onNavClick} />
        
        {isAdmin && (
          <NavItem to="/admin" icon={ShieldCheck} label="Admin Panel" onClick={onNavClick} />
        )}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <Link
          to="/"
          onClick={onNavClick}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <Menu size={18} />
          <span>Back to Home</span>
        </Link>
        
        <button
          onClick={() => {
            handleLogout();
            if (onNavClick) onNavClick();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900 text-white rounded-xl shadow-lg border border-white/10"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar (slide-in drawer) */}
      <aside
        className={cn(
          'md:hidden fixed top-0 left-0 z-50 flex flex-col w-64 h-screen bg-slate-900 border-r border-white/5 transition-transform duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
        <SidebarContent onNavClick={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-slate-900 border-r border-white/5 shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;