import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-blue-800 py-24 border-b border-blue-700">
          <div className="max-w-4xl mx-auto px-8 text-center space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-700 text-blue-200 text-xs font-bold uppercase tracking-widest rounded-sm">
              Get In Touch
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight">Contact Us</h1>
            <p className="text-blue-300 text-lg font-medium max-w-2xl mx-auto">
              Have a question, suggestion, or issue? We'd love to hear from you. Our team typically responds within 24 hours.
            </p>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="bg-white py-24 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-extrabold text-blue-900 mb-8">Send a Message</h2>
              {submitted ? (
                <div className="bg-blue-50 border-2 border-blue-800 p-8 rounded shadow-[4px_4px_0_0_rgba(30,64,175,1)] text-center space-y-3">
                  <div className="text-4xl">✅</div>
                  <h3 className="text-xl font-bold text-blue-900">Message Sent!</h3>
                  <p className="text-blue-700 font-medium">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="mt-2 text-sm font-bold text-blue-800 underline hover:text-blue-600 transition-colors">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-blue-900 mb-2">Full Name</label>
                      <input
                        type="text" name="name" value={form.name} onChange={handleChange} required
                        placeholder="Your name"
                        className="w-full border-2 border-blue-200 focus:border-blue-800 rounded px-4 py-3 text-sm text-blue-900 font-medium outline-none transition-colors bg-blue-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-blue-900 mb-2">Email Address</label>
                      <input
                        type="email" name="email" value={form.email} onChange={handleChange} required
                        placeholder="you@university.edu"
                        className="w-full border-2 border-blue-200 focus:border-blue-800 rounded px-4 py-3 text-sm text-blue-900 font-medium outline-none transition-colors bg-blue-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-blue-900 mb-2">Subject</label>
                    <input
                      type="text" name="subject" value={form.subject} onChange={handleChange} required
                      placeholder="What is this regarding?"
                      className="w-full border-2 border-blue-200 focus:border-blue-800 rounded px-4 py-3 text-sm text-blue-900 font-medium outline-none transition-colors bg-blue-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-blue-900 mb-2">Message</label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange} required rows={6}
                      placeholder="Tell us how we can help..."
                      className="w-full border-2 border-blue-200 focus:border-blue-800 rounded px-4 py-3 text-sm text-blue-900 font-medium outline-none transition-colors bg-blue-50 resize-none"
                    />
                  </div>
                  <button type="submit"
                    className="w-full bg-blue-800 text-white py-3.5 rounded font-bold text-sm hover:bg-blue-900 transition-colors shadow-[0_4px_0_0_rgba(30,58,138,1)] hover:shadow-none hover:translate-y-1">
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-extrabold text-blue-900">Contact Information</h2>
              <div className="space-y-5">
                {[
                  { icon: '📍', label: 'Address', value: '123 University Avenue,\nCampus City, CC 12345' },
                  { icon: '📧', label: 'Email', value: 'support@campusmart.edu' },
                  { icon: '📞', label: 'Phone', value: '+94 11 234 5678' },
                  { icon: '🕐', label: 'Office Hours', value: 'Mon – Fri: 8:00 AM – 5:00 PM' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex gap-4 p-5 border-2 border-blue-200 rounded hover:border-blue-800 hover:shadow-[4px_4px_0_0_rgba(30,64,175,1)] transition-all">
                    <div className="w-10 h-10 shrink-0 bg-blue-100 border border-blue-200 rounded flex items-center justify-center text-xl">{icon}</div>
                    <div>
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-1">{label}</p>
                      <p className="text-sm font-medium text-blue-900 whitespace-pre-line">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-800 border-2 border-blue-800 p-6 rounded shadow-[4px_4px_0_0_rgba(191,219,254,1)] space-y-3">
                <h3 className="font-bold text-white">Need immediate help?</h3>
                <p className="text-sm text-blue-300 font-medium">For urgent booking issues, contact your faculty administrator directly or visit the campus IT help desk.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-blue-50 py-24">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-blue-200 text-blue-800 text-xs font-bold uppercase tracking-widest rounded-sm mb-4">
                FAQ
              </div>
              <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight">Common Questions</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: 'How do I create an account?', a: 'Accounts are provisioned by your university. Contact your faculty administrator to get access credentials.' },
                { q: 'Can I cancel a booking?', a: 'Yes, you can cancel any pending or approved booking from your My Bookings dashboard before the booking start time.' },
                { q: 'How long does approval take?', a: 'Most requests are reviewed within a few hours. You will receive a notification as soon as the admin takes action.' },
                { q: 'What if a resource is unavailable?', a: 'The calendar view shows real-time availability. Unavailable slots are greyed out and cannot be selected.' },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white border-2 border-blue-200 p-6 rounded hover:border-blue-800 transition-all">
                  <h3 className="font-bold text-blue-900 mb-2">{q}</h3>
                  <p className="text-sm text-blue-700 font-medium">{a}</p>
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
