import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-blue-300 py-16 px-8 border-t border-blue-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-blue-900 text-sm">
              🏛️
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CampusSmart</span>
          </div>
          <p className="text-sm text-blue-400 leading-relaxed">
            Modernizing campus life. Book resources, explore faculties, and manage your academic journey with ease.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/" className="text-blue-400 hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/about" className="text-blue-400 hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-blue-400 hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/faculties" className="text-blue-400 hover:text-white transition-colors">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Legal</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="#" className="text-blue-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="#" className="text-blue-400 hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="#" className="text-blue-400 hover:text-white transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contact</h3>
          <ul className="space-y-4 text-sm text-blue-400">
            <li className="flex items-start">
              <span className="mr-3">📍</span>
              <span>123 University Avenue, <br/>Campus City, CC 12345</span>
            </li>
            <li className="flex items-center">
              <span className="mr-3">📧</span>
              <span>education@campusmart.edu</span>
            </li>
            <li className="flex items-center">
              <span className="mr-3">📞</span>
              <span>+94 11 234 5678</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-blue-800 text-sm text-blue-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-medium">© {new Date().getFullYear()} CampusSmart. All rights reserved.</p>
        <div className="flex space-x-6 font-medium text-blue-400">
          <span className="cursor-pointer hover:text-white transition-colors">Twitter</span>
          <span className="cursor-pointer hover:text-white transition-colors">Facebook</span>
          <span className="cursor-pointer hover:text-white transition-colors">LinkedIn</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
