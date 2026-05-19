import { motion } from 'motion/react';
import { MessageSquare, PhoneCall, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/hero_poultry_farm.png"
          alt="Premium Poultry Farm Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-green/90 via-primary-green/60 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 pt-20">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-primary-gold/20 text-primary-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-gold/30 backdrop-blur-sm">
              YSJ Farm Ibadan
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display font-bold text-5xl md:text-7xl text-white leading-[1.1]"
          >
            Trusted <span className="text-primary-gold">Broiler</span> Production & Supply
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 text-lg max-w-lg leading-relaxed"
          >
            Providing healthy and hygienically managed poultry products for distributors, restaurants, hotels, and caterers across Nigeria. Committed to international agricultural standards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <a
              href="https://wa.me/2349131201229"
              className="px-8 py-4 bg-primary-gold text-primary-green rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl shadow-primary-gold/20"
            >
              Order Now <MessageSquare size={18} />
            </a>
            <a
              href="tel:09131201229"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-primary-green transition-all"
            >
              Contact Us <ChevronRight size={18} />
            </a>
          </motion.div>
        </div>

        {/* Decorative Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="hidden md:flex items-center justify-center p-12"
        >
          <div className="w-64 h-64 border-2 border-primary-gold/20 rounded-full flex items-center justify-center relative p-6">
            <div className="absolute inset-0 bg-primary-gold/5 rounded-full animate-pulse"></div>
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-full border border-white/20 text-center space-y-2">
              <p className="text-primary-gold font-display font-bold text-4xl">100%</p>
              <p className="text-white text-[10px] uppercase tracking-tighter font-semibold">Quality & Hygiene Guaranteed</p>
            </div>
            {/* Spinning Text would be nice here but keeping it simpler for now */}
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-6 hidden md:flex items-center gap-6">
         <div className="flex -space-x-3">
           {[1,2,3].map(i => (
             <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-green bg-gray-200 overflow-hidden">
               <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
             </div>
           ))}
         </div>
         <p className="text-white text-xs font-medium">Trusted by <span className="text-primary-gold">500+</span> regular distributors</p>
      </div>
    </section>
  );
}
