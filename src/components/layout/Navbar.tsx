import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, MessageSquare, Bird } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled || isOpen
          ? 'bg-white/90 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary-green rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform border border-primary-gold">
             <Bird className="text-primary-gold" size={24} />
          </div>
          <div>
            <h1 className={cn(
              "font-display font-bold leading-none tracking-tight",
              isScrolled || isOpen ? "text-primary-green" : "text-white"
            )}>
              YSJ FARM
            </h1>
            <p className={cn(
              "text-[10px] uppercase tracking-widest font-semibold",
              isScrolled || isOpen ? "text-primary-gold" : "text-primary-gold/90"
            )}>
              Ibadan, Nigeria
            </p>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary-gold',
                location.pathname === link.href
                  ? 'text-primary-gold underline underline-offset-4'
                  : isScrolled
                  ? 'text-primary-green'
                  : 'text-white'
              )}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'md:hidden p-2 rounded-lg transition-colors',
            isScrolled || isOpen ? 'text-primary-green' : 'text-white'
          )}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t mt-3 flex flex-col gap-4 p-6 shadow-2xl rounded-b-3xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={cn(
                  'text-lg font-semibold py-2 border-b border-gray-100 last:border-0',
                  location.pathname === link.href ? 'text-primary-gold' : 'text-primary-green'
                )}
              >
                {link.name}
              </a>
            ))}
            <div className="flex gap-4 mt-4">
              <a href="tel:09131201229" className="flex-1 flex items-center justify-center gap-2 bg-gray-100 py-3 rounded-2xl text-primary-green font-semibold">
                <Phone size={18} /> Call
              </a>
              <a href="https://wa.me/2349131201229" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-2xl font-semibold">
                <MessageSquare size={18} /> WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
