import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-blue-800 py-24 border-b border-blue-700">
          <div className="max-w-4xl mx-auto px-8 text-center space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-700 text-blue-200 text-xs font-bold uppercase tracking-widest rounded-sm">
              About Us
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
              Built for Campus. <br/>Built for You.
            </h1>
            <p className="text-blue-300 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              CampusSmart was created to eliminate the friction of campus resource management, replacing slow manual processes with a fast, transparent digital platform.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-white py-24 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-blue-200 text-blue-800 text-xs font-bold uppercase tracking-widest rounded-sm">
                Our Mission
              </div>
              <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight">Simplify. Connect. Empower.</h2>
              <p className="text-blue-700 font-medium leading-relaxed">
                Our mission is to give every student, lecturer, and admin a seamless experience when it comes to managing campus resources. No more long queues, lost forms, or conflicting schedules.
              </p>
              <p className="text-blue-700 font-medium leading-relaxed">
                We believe that technology should remove barriers, not create them. CampusSmart is designed to be intuitive for everyone, from first-year students to senior administrators.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🎯', label: 'Purpose-Built', desc: 'Designed specifically for university environments and workflows.' },
                { icon: '⚡', label: 'Fast & Reliable', desc: '99% uptime with instant booking confirmations.' },
                { icon: '🔒', label: 'Secure', desc: 'Role-based access keeps data safe for every user type.' },
                { icon: '🌐', label: 'Always Available', desc: 'Access from any device, anywhere on or off campus.' },
              ].map(({ icon, label, desc }) => (
                <div key={label} className="bg-blue-50 border-2 border-blue-200 p-5 rounded space-y-2 hover:border-blue-800 hover:shadow-[4px_4px_0_0_rgba(30,64,175,1)] transition-all">
                  <div className="text-2xl">{icon}</div>
                  <h4 className="font-bold text-blue-900 text-sm">{label}</h4>
                  <p className="text-xs text-blue-700 font-medium">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-blue-50 py-24 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-blue-200 text-blue-800 text-xs font-bold uppercase tracking-widest rounded-sm mb-4">
                The Team
              </div>
              <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight">Who Built This?</h2>
              <p className="mt-4 text-blue-700 font-medium max-w-xl mx-auto">A group of university students passionate about solving real problems with technology.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { name: 'Najla', role: 'Frontend Developer', emoji: '👩‍💻' },
                { name: 'Anushangar', role: 'Backend Developer', emoji: '👨‍💻' },
              ].map(({ name, role, emoji }) => (
                <div key={name} className="bg-white border-2 border-blue-800 p-8 rounded shadow-[4px_4px_0_0_rgba(30,64,175,1)] text-center space-y-3">
                  <div className="text-5xl">{emoji}</div>
                  <h3 className="text-xl font-extrabold text-blue-900">{name}</h3>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white py-24 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-blue-200 text-blue-800 text-xs font-bold uppercase tracking-widest rounded-sm mb-4">
                What We Stand For
              </div>
              <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-800 text-white border-2 border-blue-800 p-8 rounded shadow-[4px_4px_0_0_rgba(191,219,254,1)] space-y-4">
                <div className="text-3xl">🤝</div>
                <h3 className="text-xl font-bold">Transparency</h3>
                <p className="text-blue-300 text-sm font-medium">Every booking, approval, and rejection is tracked and visible. No hidden processes.</p>
              </div>
              <div className="bg-white border-2 border-blue-800 p-8 rounded shadow-[4px_4px_0_0_rgba(30,64,175,1)] space-y-4 md:translate-y-4">
                <div className="text-3xl">💡</div>
                <h3 className="text-xl font-bold text-blue-900">Innovation</h3>
                <p className="text-blue-700 text-sm font-medium">Continuously improving based on feedback from real students and faculty.</p>
              </div>
              <div className="bg-white border-2 border-blue-800 p-8 rounded shadow-[4px_4px_0_0_rgba(30,64,175,1)] space-y-4">
                <div className="text-3xl">♿</div>
                <h3 className="text-xl font-bold text-blue-900">Accessibility</h3>
                <p className="text-blue-700 text-sm font-medium">Designed to be usable by everyone regardless of technical background.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-900 py-20">
          <div className="max-w-3xl mx-auto px-8 text-center space-y-6">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Want to get in touch?</h2>
            <p className="text-blue-300 text-lg font-medium">Reach out to us with questions, feedback, or partnership inquiries.</p>
            <Link to="/contact" className="inline-block bg-white text-blue-900 px-8 py-3.5 rounded text-base font-bold hover:bg-blue-100 transition-colors shadow-[0_4px_0_0_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-y-1">
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
