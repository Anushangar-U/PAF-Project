import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const NAV = '#0b1628';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-slate-50 py-24 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm"
                style={{ background: '#0b162814', color: NAV }}>
                Next-Gen Campus Management
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
                style={{ color: NAV }}>
                Empower Your <br/>Academic Journey
              </h1>
              <p className="text-lg leading-relaxed max-w-xl font-medium text-slate-500">
                CampusSmart provides an all-in-one ecosystem for students and faculty. Instantly book resources, explore academic departments, and manage schedules with zero friction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/faculties"
                  className="text-white px-8 py-3.5 rounded text-base font-bold transition-colors text-center shadow-[0_4px_0_0_rgba(11,22,40,0.3)] hover:shadow-none hover:translate-y-1"
                  style={{ background: NAV }}>
                  Explore Faculties
                </Link>
                <Link to="/about"
                  className="px-8 py-3.5 rounded text-base font-bold border-2 transition-colors text-center hover:bg-slate-50"
                  style={{ color: NAV, borderColor: NAV }}>
                  Learn More
                </Link>
              </div>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-4">
              {[
                { emoji: '📅', title: 'Resource Booking', desc: 'Reserve labs, halls, and equipment instantly.', offset: true },
                { emoji: '🏛️', title: 'Faculty Hub', desc: 'Browse dynamic faculty dashboards and details.', offset: false },
                { emoji: '⚙️', title: 'Real-time Sync', desc: 'Instant approvals and notifications.', offset: true, accent: true },
                { emoji: '📊', title: 'Admin Control', desc: 'Comprehensive approval and tracking system.', offset: false },
              ].map(({ emoji, title, desc, offset, accent }) => (
                <div key={title}
                  className={`p-6 rounded border-2 space-y-4${offset ? ' translate-y-8' : ''}`}
                  style={accent
                    ? { background: NAV, borderColor: NAV, boxShadow: '4px 4px 0 0 rgba(11,22,40,0.15)' }
                    : { background: 'white', borderColor: NAV, boxShadow: '4px 4px 0 0 rgba(11,22,40,0.12)' }}>
                  <div className="w-12 h-12 rounded flex items-center justify-center text-2xl"
                    style={{ background: accent ? 'rgba(255,255,255,0.12)' : '#0b162810' }}>{emoji}</div>
                  <h3 className="font-bold" style={{ color: accent ? 'white' : NAV }}>{title}</h3>
                  <p className="text-sm font-medium" style={{ color: accent ? 'rgba(255,255,255,0.6)' : '#64748b' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-slate-100 py-16 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200">
              {[
                { value: '6+', label: 'Academic Faculties' },
                { value: '1,200+', label: 'Daily Bookings' },
                { value: '10k+', label: 'Active Students' },
                { value: '99%', label: 'Uptime SLA' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center px-4">
                  <div className="text-4xl font-black mb-2" style={{ color: NAV }}>{value}</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-slate-50 py-24 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm mb-4"
                style={{ background: '#0b162814', color: NAV }}>
                Simple Process
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: NAV }}>How It Works</h2>
              <p className="mt-4 text-slate-500 font-medium max-w-xl mx-auto">From login to confirmation in three steps. No paperwork, no waiting in line.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { n: '1', emoji: '🔐', title: 'Log In', desc: 'Sign in with your university credentials to access the full platform, for students and staff.', accent: false, offset: false },
                { n: '2', emoji: '🔍', title: 'Browse Resources', desc: 'Explore available labs, lecture halls, equipment, and meeting rooms across all faculties.', accent: false, offset: true },
                { n: '3', emoji: '✅', title: 'Book & Confirm', desc: 'Submit your booking request and receive instant confirmation or admin approval, all tracked in your dashboard.', accent: true, offset: false },
              ].map(({ n, emoji, title, desc, accent, offset }) => (
                <div key={n} className={`relative border-2 p-8 rounded${offset ? ' md:translate-y-4' : ''}`}
                  style={accent
                    ? { background: NAV, borderColor: NAV, boxShadow: '4px 4px 0 0 rgba(11,22,40,0.15)' }
                    : { background: 'white', borderColor: NAV, boxShadow: '4px 4px 0 0 rgba(11,22,40,0.12)' }}>
                  <div className="absolute -top-4 -left-4 w-10 h-10 font-black text-lg flex items-center justify-center rounded border-2"
                    style={accent
                      ? { background: 'white', color: NAV, borderColor: 'white' }
                      : { background: NAV, color: 'white', borderColor: NAV }}>
                    {n}
                  </div>
                  <div className="text-3xl mb-4">{emoji}</div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: accent ? 'white' : NAV }}>{title}</h3>
                  <p className="text-sm font-medium" style={{ color: accent ? 'rgba(255,255,255,0.6)' : '#64748b' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-100 py-24 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm mb-4"
                style={{ background: '#0b162814', color: NAV }}>
                Platform Features
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: NAV }}>Everything You Need</h2>
              <p className="mt-4 text-slate-500 font-medium max-w-xl mx-auto">Built for the pace of university life: fast, transparent, and always available.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: '🗓️', title: 'Smart Scheduling', desc: 'Conflict-free time slot selection with real-time availability updates across all resources.' },
                { icon: '🔔', title: 'Instant Notifications', desc: 'Get notified the moment your booking is approved, rejected, or modified by an admin.' },
                { icon: '🏫', title: 'Multi-Faculty Support', desc: 'Manage resources across all faculties from one unified interface, no switching apps.' },
                { icon: '📋', title: 'Booking History', desc: 'View past and upcoming bookings at a glance. Export records for personal or admin use.' },
                { icon: '🛡️', title: 'Role-Based Access', desc: 'Students, lecturers, and admins each get a tailored experience with the right permissions.' },
                { icon: '📱', title: 'Fully Responsive', desc: 'Works seamlessly on desktop, tablet, and mobile. Book from anywhere on campus.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-5 p-6 bg-white border-2 border-slate-100 rounded hover:border-[#0b1628] transition-all"
                  style={{ ':hover': { boxShadow: '4px 4px 0 0 rgba(11,22,40,0.12)' } }}>
                  <div className="w-12 h-12 shrink-0 rounded flex items-center justify-center text-2xl"
                    style={{ background: '#0b162810' }}>{icon}</div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: NAV }}>{title}</h3>
                    <p className="text-sm text-slate-500 font-medium">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Who Is It For */}
        <div className="bg-slate-50 py-24 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm mb-4"
                style={{ background: '#0b162814', color: NAV }}>
                For Everyone
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: NAV }}>Built for the Whole Campus</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { emoji: '🎓', title: 'Students', items: ['Book study rooms and labs', 'View upcoming bookings', 'Get real-time approval updates', 'Browse faculty resources'], accent: false },
                { emoji: '👩‍🏫', title: 'Lecturers', items: ['Reserve lecture halls', 'Schedule equipment use', 'Manage class resources', 'Access booking history'], accent: true },
                { emoji: '🛠️', title: 'Admins', items: ['Approve or reject requests', 'Manage all resources', 'View system-wide activity', 'Add and edit facilities'], accent: false },
              ].map(({ emoji, title, items, accent }) => (
                <div key={title} className="border-2 p-8 rounded space-y-4"
                  style={accent
                    ? { background: NAV, borderColor: NAV, boxShadow: '4px 4px 0 0 rgba(11,22,40,0.15)' }
                    : { background: 'white', borderColor: NAV, boxShadow: '4px 4px 0 0 rgba(11,22,40,0.12)' }}>
                  <div className="text-4xl">{emoji}</div>
                  <h3 className="text-xl font-extrabold" style={{ color: accent ? 'white' : NAV }}>{title}</h3>
                  <ul className="space-y-2 text-sm font-medium">
                    {items.map(item => (
                      <li key={item} className="flex items-start gap-2"
                        style={{ color: accent ? 'rgba(255,255,255,0.65)' : '#64748b' }}>
                        <span className="font-bold" style={{ color: accent ? 'white' : NAV }}>→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="py-20" style={{ background: NAV }}>
          <div className="max-w-4xl mx-auto px-8 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Ready to get started?</h2>
            <p className="text-white/50 text-lg font-medium">Join thousands of students and staff already using CampusSmart to simplify their campus experience.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link to="/faculties" className="bg-white px-8 py-3.5 rounded text-base font-bold hover:bg-slate-100 transition-colors text-center shadow-[0_4px_0_0_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-y-1"
                style={{ color: NAV }}>
                Explore Faculties
              </Link>
              <Link to="/mybookings" className="text-white border border-white/30 px-8 py-3.5 rounded text-base font-bold hover:bg-white/10 transition-colors text-center">
                View My Bookings
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
