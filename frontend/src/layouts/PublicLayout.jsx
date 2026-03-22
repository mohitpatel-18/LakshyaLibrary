import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, GraduationCap, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F6] dark:bg-gray-900 flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#1B1B1B] dark:bg-gray-950 text-white mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#66BB6A] to-[#A5D6A7] bg-clip-text text-transparent">
                  LakshyaLibrary
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Modern library management system providing quality study spaces and seamless online services for dedicated learners.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-[#66BB6A] transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-[#66BB6A] transition-colors">About Us</Link></li>
                <li><Link to="/admission" className="hover:text-[#66BB6A] transition-colors">Admissions</Link></li>
                <li><Link to="/login" className="hover:text-[#66BB6A] transition-colors">Login</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Online Seat Booking</li>
                <li>Fee Management</li>
                <li>Payment Gateway</li>
                <li>Digital ID Cards</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#66BB6A]" />
                  info@lakshyalibrary.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#66BB6A]" />
                  +91 1234567890
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#66BB6A]" />
                  City, State, India
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2026 LakshyaLibrary. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
