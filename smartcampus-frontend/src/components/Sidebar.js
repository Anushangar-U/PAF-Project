import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  Home,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';

const mainNav = [
  { to: '/faculties', icon: LayoutDashboard, label: 'Faculties' },
  { to: '/mybookings', icon: BookOpen, label: 'My Bookings', badge: '3' },
  { to: '/adminbookings', icon: ShieldCheck, label: 'Admin Bookings' },
];

const NavItem = ({ to, icon: Icon, label, badge, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-white/60 hover:text-white hover:bg-white/[0.07]'
      )
    }
  >
    {({ isActive }) => (
      <>
        <span className="flex items-center gap-3">
          <Icon
            size={16}
            className={cn('shrink-0', isActive ? 'text-white' : 'text-white/50 group-hover:text-white')}
          />
          {label}
        </span>
        {badge && (
          <span
            className={cn(
              'text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none',
              isActive ? 'bg-white/20 text-white' : 'bg-blue-500/30 text-blue-300'
            )}
          >
            {badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

const SidebarContent = ({ onNavClick }) => (
  <>
    {/* Brand */}
    <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.07] shrink-0">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/40">
        <span className="text-base">🏛️</span>
      </div>
      <div className="min-w-0">
        <p className="text-white font-bold text-sm leading-tight truncate">CampusSmart</p>
        <p className="text-white/35 text-[11px] leading-tight mt-0.5">Campus Management</p>
      </div>
    </div>

    {/* Main Nav */}
    <div className="flex-1 px-3 py-5 space-y-6">
      <div>
        <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Main</p>
        <div className="space-y-0.5">
          {mainNav.map((item) => (
            <NavItem key={item.to} {...item} onClick={onNavClick} />
          ))}
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="px-3 py-3 border-t border-white/[0.07] shrink-0">
      <Link
        to="/"
        onClick={onNavClick}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/40 hover:text-white hover:bg-white/[0.07] transition-colors"
      >
        <Home size={15} />
        Back to Home
      </Link>
    </div>
  </>
);

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#0b1628] text-white rounded-lg shadow-lg border border-white/10"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar (slide-in drawer) */}
      <aside
        className={cn(
          'md:hidden fixed top-0 left-0 z-50 flex flex-col w-60 h-screen bg-[#0b1628] border-r border-white/[0.07] transition-transform duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          className="absolute top-4 right-3 p-1 text-white/40 hover:text-white transition-colors"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
        <SidebarContent onNavClick={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 h-screen sticky top-0 bg-[#0b1628] border-r border-white/[0.07] shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
