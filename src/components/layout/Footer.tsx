import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, ArrowUp, Bird } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-green text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Bird className="text-primary-green" size={28} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl leading-none">YSJ FARM</h2>
              <p className="text-primary-gold text-[10px] tracking-widest uppercase mt-1">Quality Agriculture Ibadan</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Ibadan's leading provider of premium commercial broilers and hygienically processed frozen chicken. Quality, health, and reliability since 2023.
          </p>
          <div className="flex gap-4">
            {[Instagram, Facebook, Twitter].map((Icon, idx) => (
              <a key={idx} href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-primary-gold hover:border-primary-gold transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-display font-bold text-lg mb-6 border-b border-primary-gold/30 pb-2 inline-block">Quick Navigation</h3>
          <ul className="space-y-4">
            {['Home', 'About', 'Services', 'Contact', 'Admin Login'].map((item) => (
              <li key={item}>
                <Link 
                  to={item === 'Home' ? '/' : item === 'Admin Login' ? '/admin' : `/${item.toLowerCase()}`} 
                  className="text-gray-400 hover:text-primary-gold transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-gold scale-0 group-hover:scale-100 transition-transform"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Business Hours */}
        <div>
          <h3 className="font-display font-bold text-lg mb-6 border-b border-primary-gold/30 pb-2 inline-block">Working Hours</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Mon - Fri:</span>
              <span>8:00 AM - 6:00 PM</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Saturday:</span>
              <span>9:00 AM - 4:00 PM</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Sunday:</span>
              <span className="text-primary-gold font-medium">Closed</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-display font-bold text-lg mb-6 border-b border-primary-gold/30 pb-2 inline-block">Address</h3>
          <ul className="space-y-6">
            <li className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-gold transition-colors">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Our Location</p>
                <p className="text-sm">Road 5, Lamona, Oluhunda Akobo, Ibadan, Nigeria</p>
              </div>
            </li>
            <li className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-gold transition-colors">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Phone Line</p>
                <a href="tel:09131201229" className="text-sm hover:text-primary-gold transition-colors">09131201229</a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} YSJ Farm. All rights reserved. Designed with Excellence.
        </p>
        <button
          onClick={scrollToTop}
          className="bg-primary-gold text-primary-green px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-white transition-all"
        >
          Back To Top <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
}
