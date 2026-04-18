import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const NAV = '#0b1628';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  const inputClass = "w-full border-2 border-slate-200 focus:outline-none rounded px-4 py-3 text-sm font-medium bg-white placeholder:text-slate-400 transition-colors";
  const inputStyle = { color: NAV };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-white py-24 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-8 text-center space-y-6">
            <div className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm"
              style={{ background: '#0b162814', color: NAV }}>
              Get In Touch
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight" style={{ color: NAV }}>Contact Us</h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
              Have a question, suggestion, or issue? We'd love to hear from you. Our team typically responds within 24 hours.
            </p>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="bg-slate-50 py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-extrabold mb-8" style={{ color: NAV }}>Send a Message</h2>
              {submitted ? (
                <div className="bg-white border-2 p-8 rounded text-center space-y-3"
                  style={{ borderColor: NAV, boxShadow: '4px 4px 0 0 rgba(11,22,40,0.12)' }}>
                  <div className="text-4xl">✅</div>
                  <h3 className="text-xl font-bold" style={{ color: NAV }}>Message Sent!</h3>
                  <p className="text-slate-500 font-medium">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="mt-2 text-sm font-bold underline hover:opacity-70 transition-opacity"
                    style={{ color: NAV }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: NAV }}>Full Name</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required
                        placeholder="Your name" className={inputClass} style={inputStyle}
                        onFocus={e => e.target.style.borderColor = NAV}
                        onBlur={e => e.target.style.borderColor = ''} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: NAV }}>Email Address</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required
                        placeholder="you@university.edu" className={inputClass} style={inputStyle}
                        onFocus={e => e.target.style.borderColor = NAV}
                        onBlur={e => e.target.style.borderColor = ''} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: NAV }}>Subject</label>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange} required
                      placeholder="What is this regarding?" className={inputClass} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = NAV}
                      onBlur={e => e.target.style.borderColor = ''} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: NAV }}>Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={6}
                      placeholder="Tell us how we can help..." className={`${inputClass} resize-none`} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = NAV}
                      onBlur={e => e.target.style.borderColor = ''} />
                  </div>
                  <button type="submit"
                    className="w-full text-white py-3.5 rounded font-bold text-sm transition-colors shadow-[0_4px_0_0_rgba(11,22,40,0.3)] hover:shadow-none hover:translate-y-1"
                    style={{ background: NAV }}>
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-extrabold" style={{ color: NAV }}>Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: '📍', label: 'Address', value: '123 University Avenue,\nCampus City, CC 12345' },
                  { icon: '📧', label: 'Email', value: 'support@campusmart.edu' },
                  { icon: '📞', label: 'Phone', value: '+94 11 234 5678' },
                  { icon: '🕐', label: 'Office Hours', value: 'Mon – Fri: 8:00 AM – 5:00 PM' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex gap-4 p-5 bg-white border-2 border-slate-100 rounded hover:border-[#0b1628] transition-all">
                    <div className="w-10 h-10 shrink-0 rounded flex items-center justify-center text-xl"
                      style={{ background: '#0b162810' }}>{icon}</div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-1 text-slate-400">{label}</p>
                      <p className="text-sm font-medium whitespace-pre-line" style={{ color: NAV }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-2 p-6 rounded space-y-3 text-white"
                style={{ background: NAV, borderColor: NAV, boxShadow: '4px 4px 0 0 rgba(11,22,40,0.15)' }}>
                <h3 className="font-bold">Need immediate help?</h3>
                <p className="text-sm text-white/60 font-medium">For urgent booking issues, contact your faculty administrator directly or visit the campus IT help desk.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white py-24">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm mb-4"
                style={{ background: '#0b162814', color: NAV }}>
                FAQ
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: NAV }}>Common Questions</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: 'How do I create an account?', a: 'Accounts are provisioned by your university. Contact your faculty administrator to get access credentials.' },
                { q: 'Can I cancel a booking?', a: 'Yes, you can cancel any pending or approved booking from your My Bookings dashboard before the booking start time.' },
                { q: 'How long does approval take?', a: 'Most requests are reviewed within a few hours. You will receive a notification as soon as the admin takes action.' },
                { q: 'What if a resource is unavailable?', a: 'The calendar view shows real-time availability. Unavailable slots are greyed out and cannot be selected.' },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white border-2 border-slate-100 p-6 rounded hover:border-[#0b1628] transition-all">
                  <h3 className="font-bold mb-2" style={{ color: NAV }}>{q}</h3>
                  <p className="text-sm text-slate-500 font-medium">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
