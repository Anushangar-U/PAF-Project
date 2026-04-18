import { Link } from 'react-router-dom';

const NAV = '#0b1628';

const Footer = () => {
  return (
    <footer className="text-white py-16 px-8" style={{ background: NAV }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-sm">
              🏛️
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CampusSmart</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Modernizing campus life. Book resources, explore faculties, and manage your academic journey with ease.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-4 text-sm font-medium">
            {[
              { to: '/', label: 'Home' },
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact Us' },
              { to: '/faculties', label: 'Dashboard' },
            ].map(({ to, label }) => (
              <li key={label}>
                <Link to={to} className="transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Legal</h3>
          <ul className="space-y-4 text-sm font-medium">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <li key={item}>
                <Link to="#" className="transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.5)' }}>{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contact</h3>
          <ul className="space-y-4 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <li className="flex items-start gap-3">
              <span>📍</span>
              <span>123 University Avenue,<br />Campus City, CC 12345</span>
            </li>
            <li className="flex items-center gap-3">
              <span>📧</span>
              <span>education@campusmart.edu</span>
            </li>
            <li className="flex items-center gap-3">
              <span>📞</span>
              <span>+94 11 234 5678</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t text-sm flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
        <p className="font-medium">© {new Date().getFullYear()} CampusSmart. All rights reserved.</p>
        <div className="flex space-x-6 font-medium">
          {['Twitter', 'Facebook', 'LinkedIn'].map(s => (
            <span key={s} className="cursor-pointer transition-colors hover:text-white">{s}</span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
