import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/2349131201229"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[99] bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] flex items-center justify-center border-4 border-white"
    >
      <MessageCircle size={32} />
      <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
    </motion.a>
  );
}
