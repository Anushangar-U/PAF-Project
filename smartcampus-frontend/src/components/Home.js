import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-blue-50 py-24 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-3 py-1 bg-blue-200 text-blue-800 text-xs font-bold uppercase tracking-widest rounded-sm">
                Next-Gen Campus Management
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 tracking-tight leading-tight">
                Empower Your <br/>Academic Journey
              </h1>
              <p className="text-lg text-blue-700 leading-relaxed max-w-xl font-medium">
                CampusSmart provides an all-in-one ecosystem for students and faculty. Instantly book resources, explore academic departments, and manage schedules with zero friction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/faculties" className="bg-blue-800 text-white px-8 py-3.5 rounded text-base font-bold hover:bg-blue-900 transition-colors text-center shadow-[0_4px_0_0_rgba(30,64,175,1)] hover:shadow-none hover:translate-y-1">
                  Explore Faculties
                </Link>
                <Link to="/about" className="bg-white text-blue-900 border-2 border-blue-800 px-8 py-3.5 rounded text-base font-bold hover:bg-blue-50 transition-colors text-center shadow-[0_4px_0_0_rgba(30,64,175,1)] hover:shadow-none hover:translate-y-1">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-4">
              <div className="bg-white border-2 border-blue-800 p-6 rounded shadow-[4px_4px_0_0_rgba(30,64,175,1)] space-y-4 translate-y-8">
                <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center text-2xl border border-blue-200">📅</div>
                <h3 className="font-bold text-blue-900">Resource Booking</h3>
                <p className="text-sm text-blue-700 font-medium">Reserve labs, halls, and equipment instantly.</p>
              </div>
              <div className="bg-white border-2 border-blue-800 p-6 rounded shadow-[4px_4px_0_0_rgba(30,64,175,1)] space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center text-2xl border border-blue-200">🏛️</div>
                <h3 className="font-bold text-blue-900">Faculty Hub</h3>
                <p className="text-sm text-blue-700 font-medium">Browse dynamic faculty dashboards and details.</p>
              </div>
              <div className="bg-blue-800 text-white border-2 border-blue-800 p-6 rounded shadow-[4px_4px_0_0_rgba(191,219,254,1)] space-y-4 translate-y-8">
                <div className="w-12 h-12 bg-blue-700 rounded flex items-center justify-center text-2xl">⚙️</div>
                <h3 className="font-bold">Real-time Sync</h3>
                <p className="text-sm text-blue-300 font-medium">Instant approvals and notifications.</p>
              </div>
              <div className="bg-white border-2 border-blue-800 p-6 rounded shadow-[4px_4px_0_0_rgba(30,64,175,1)] space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center text-2xl border border-blue-200">📊</div>
                <h3 className="font-bold text-blue-900">Admin Control</h3>
                <p className="text-sm text-blue-700 font-medium">Comprehensive approval and tracking system.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-white py-16 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-blue-200">
              <div className="text-center px-4">
                <div className="text-4xl font-black text-blue-900 mb-2">6+</div>
                <div className="text-sm font-bold text-blue-500 uppercase tracking-wide">Academic Faculties</div>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl font-black text-blue-900 mb-2">1,200+</div>
                <div className="text-sm font-bold text-blue-500 uppercase tracking-wide">Daily Bookings</div>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl font-black text-blue-900 mb-2">10k+</div>
                <div className="text-sm font-bold text-blue-500 uppercase tracking-wide">Active Students</div>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl font-black text-blue-900 mb-2">99%</div>
                <div className="text-sm font-bold text-blue-500 uppercase tracking-wide">Uptime SLA</div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-blue-50 py-24 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-blue-200 text-blue-800 text-xs font-bold uppercase tracking-widest rounded-sm mb-4">
                Simple Process
              </div>
              <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight">How It Works</h2>
              <p className="mt-4 text-blue-700 font-medium max-w-xl mx-auto">From login to confirmation in three steps. No paperwork, no waiting in line.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative bg-white border-2 border-blue-800 p-8 rounded shadow-[4px_4px_0_0_rgba(30,64,175,1)]">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-800 text-white font-black text-lg flex items-center justify-center rounded border-2 border-blue-800">1</div>
                <div className="text-3xl mb-4">🔐</div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Log In</h3>
                <p className="text-blue-700 text-sm font-medium">Sign in with your university credentials to access the full platform, for students and staff.</p>
              </div>
              <div className="relative bg-white border-2 border-blue-800 p-8 rounded shadow-[4px_4px_0_0_rgba(30,64,175,1)] md:translate-y-4">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-800 text-white font-black text-lg flex items-center justify-center rounded border-2 border-blue-800">2</div>
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Browse Resources</h3>
                <p className="text-blue-700 text-sm font-medium">Explore available labs, lecture halls, equipment, and meeting rooms across all faculties.</p>
              </div>
              <div className="relative bg-blue-800 text-white border-2 border-blue-800 p-8 rounded shadow-[4px_4px_0_0_rgba(191,219,254,1)]">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-white text-blue-900 font-black text-lg flex items-center justify-center rounded border-2 border-blue-800">3</div>
                <div className="text-3xl mb-4">✅</div>
                <h3 className="text-lg font-bold mb-2">Book & Confirm</h3>
                <p className="text-blue-300 text-sm font-medium">Submit your booking request and receive instant confirmation or admin approval, all tracked in your dashboard.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white py-24 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-blue-200 text-blue-800 text-xs font-bold uppercase tracking-widest rounded-sm mb-4">
                Platform Features
              </div>
              <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight">Everything You Need</h2>
              <p className="mt-4 text-blue-700 font-medium max-w-xl mx-auto">Built for the pace of university life: fast, transparent, and always available.</p>
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
                <div key={title} className="flex gap-5 p-6 border-2 border-blue-200 rounded hover:border-blue-800 hover:shadow-[4px_4px_0_0_rgba(30,64,175,1)] transition-all">
                  <div className="w-12 h-12 shrink-0 bg-blue-100 border border-blue-200 rounded flex items-center justify-center text-2xl">{icon}</div>
                  <div>
                    <h3 className="font-bold text-blue-900 mb-1">{title}</h3>
                    <p className="text-sm text-blue-700 font-medium">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Who Is It For */}
        <div className="bg-blue-50 py-24 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-blue-200 text-blue-800 text-xs font-bold uppercase tracking-widest rounded-sm mb-4">
                For Everyone
              </div>
              <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight">Built for the Whole Campus</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border-2 border-blue-800 p-8 rounded shadow-[4px_4px_0_0_rgba(30,64,175,1)] space-y-4">
                <div className="text-4xl">🎓</div>
                <h3 className="text-xl font-extrabold text-blue-900">Students</h3>
                <ul className="space-y-2 text-sm text-blue-700 font-medium">
                  <li className="flex items-start gap-2"><span className="text-blue-800 font-bold">→</span> Book study rooms and labs</li>
                  <li className="flex items-start gap-2"><span className="text-blue-800 font-bold">→</span> View upcoming bookings</li>
                  <li className="flex items-start gap-2"><span className="text-blue-800 font-bold">→</span> Get real-time approval updates</li>
                  <li className="flex items-start gap-2"><span className="text-blue-800 font-bold">→</span> Browse faculty resources</li>
                </ul>
              </div>
              <div className="bg-blue-800 text-white border-2 border-blue-800 p-8 rounded shadow-[4px_4px_0_0_rgba(191,219,254,1)] space-y-4">
                <div className="text-4xl">👩‍🏫</div>
                <h3 className="text-xl font-extrabold">Lecturers</h3>
                <ul className="space-y-2 text-sm text-blue-300 font-medium">
                  <li className="flex items-start gap-2"><span className="text-white font-bold">→</span> Reserve lecture halls</li>
                  <li className="flex items-start gap-2"><span className="text-white font-bold">→</span> Schedule equipment use</li>
                  <li className="flex items-start gap-2"><span className="text-white font-bold">→</span> Manage class resources</li>
                  <li className="flex items-start gap-2"><span className="text-white font-bold">→</span> Access booking history</li>
                </ul>
              </div>
              <div className="bg-white border-2 border-blue-800 p-8 rounded shadow-[4px_4px_0_0_rgba(30,64,175,1)] space-y-4">
                <div className="text-4xl">🛠️</div>
                <h3 className="text-xl font-extrabold text-blue-900">Admins</h3>
                <ul className="space-y-2 text-sm text-blue-700 font-medium">
                  <li className="flex items-start gap-2"><span className="text-blue-800 font-bold">→</span> Approve or reject requests</li>
                  <li className="flex items-start gap-2"><span className="text-blue-800 font-bold">→</span> Manage all resources</li>
                  <li className="flex items-start gap-2"><span className="text-blue-800 font-bold">→</span> View system-wide activity</li>
                  <li className="flex items-start gap-2"><span className="text-blue-800 font-bold">→</span> Add and edit facilities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-blue-900 py-20">
          <div className="max-w-4xl mx-auto px-8 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Ready to get started?</h2>
            <p className="text-blue-300 text-lg font-medium">Join thousands of students and staff already using CampusSmart to simplify their campus experience.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link to="/faculties" className="bg-white text-blue-900 px-8 py-3.5 rounded text-base font-bold hover:bg-blue-100 transition-colors text-center shadow-[0_4px_0_0_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-y-1">
                Explore Faculties
              </Link>
              <Link to="/mybookings" className="bg-transparent text-white border-2 border-blue-600 px-8 py-3.5 rounded text-base font-bold hover:border-white transition-colors text-center">
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
