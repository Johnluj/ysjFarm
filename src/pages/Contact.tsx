import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    setTimeout(() => setFormState('sent'), 1500);
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-primary-gold py-24 px-6 text-center">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-4xl mx-auto space-y-4 text-primary-green"
         >
           <h1 className="font-display font-bold text-5xl md:text-7xl">Connect With Us</h1>
           <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto opacity-80">
             Whether you're a large distributor or a catering service, we're ready to power your poultry supply.
           </p>
         </motion.div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-primary-green font-display font-bold text-4xl">Reach Out Directly</h2>
              <p className="text-gray-600 leading-relaxed max-w-md">
                Our farm office is always open for inquiries, partnership discussions, and direct order placements.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { label: 'Hotline', value: '09131201229', sub: 'Call anytime', icon: Phone },
                { label: 'WhatsApp', value: '09131201229', sub: 'Instant response', icon: MessageSquare },
                { label: 'Email', value: 'hello@ysjpoultry.com', sub: 'Business inquiries', icon: Mail },
                { label: 'Head Office', value: 'Road 5, Lamona, Oluhunda Akobo, Ibadan', sub: 'Farm facility', icon: MapPin },
              ].map((item, idx) => (
                <motion.div 
                  key={item.label} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-soft-white p-6 rounded-3xl space-y-4 border border-transparent hover:border-primary-gold/30 hover:shadow-xl transition-all group"
                >
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-green shadow-sm group-hover:bg-primary-green group-hover:text-white transition-all">
                      <item.icon size={24} />
                   </div>
                   <div>
                      <h4 className="text-xs uppercase tracking-widest font-bold text-primary-gold mb-1">{item.label}</h4>
                      <p className="font-bold text-primary-green">{item.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
                   </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary-green text-white p-10 rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden"
            >
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                     <Clock className="text-primary-gold" />
                     <h3 className="font-display font-bold text-2xl">Operating Hours</h3>
                  </div>
                  <ul className="space-y-2 opacity-80 text-sm">
                     <li className="flex justify-between"><span>Monday - Friday</span> <span>08:00 - 18:00</span></li>
                     <li className="flex justify-between"><span>Saturday</span> <span>09:00 - 16:00</span></li>
                     <li className="flex justify-between text-primary-gold font-bold"><span>Sunday</span> <span>Closed</span></li>
                  </ul>
               </div>
               <div className="absolute right-0 bottom-0 opacity-10">
                  <MapPin size={200} />
               </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-gray-100"
          >
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-2">Your Name</label>
                      <input required type="text" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-primary-gold outline-none transition-all placeholder:text-gray-300" placeholder="John Doe" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-2">Email Address</label>
                      <input required type="email" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-primary-gold outline-none transition-all placeholder:text-gray-300" placeholder="john@example.com" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-2">Phone Number</label>
                   <input required type="tel" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-primary-gold outline-none transition-all placeholder:text-gray-300" placeholder="+234 ..." />
                </div>
                <div className="space-y-2">
                   <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-2">Message Type</label>
                   <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-primary-gold outline-none transition-all cursor-pointer">
                      <option>Commercial Distribution Query</option>
                      <option>Frozen Food Order</option>
                      <option>Poultry Management Inquiry</option>
                      <option>General Feedback</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-2">Your Message</label>
                   <textarea required rows={5} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-2 focus:ring-primary-gold outline-none transition-all placeholder:text-gray-300 resize-none" placeholder="How can we help?"></textarea>
                </div>

                <button 
                  disabled={formState !== 'idle'}
                  className={`w-full py-5 rounded-[2rem] font-bold text-primary-green transition-all flex items-center justify-center gap-3 shadow-lg ${
                    formState === 'sent' ? 'bg-green-500 text-white' : 'bg-primary-gold hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {formState === 'idle' && <><Send size={20} /> Send Inquiry</>}
                  {formState === 'sending' && <div className="w-6 h-6 border-4 border-primary-green border-t-white rounded-full animate-spin"></div>}
                  {formState === 'sent' && <><CheckCircle2 size={20} /> Message Sent!</>}
                </button>
             </form>
          </motion.div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[500px] bg-gray-100 relative group overflow-hidden">
         <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700">
            {/* Visual representation of a map */}
            <div className="w-full h-full bg-[#e5e7eb] flex items-center justify-center relative">
               <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center text-white mx-auto shadow-2xl animate-bounce">
                     <MapPin size={32} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-2xl text-primary-green">YSJ Farm Facility</h3>
                    <p className="text-gray-500">Ibadan, Road 5 Akobo</p>
                  </div>
               </div>
               
               {/* Decorative map elements */}
               <div className="absolute top-1/4 left-1/3 w-1 h-32 bg-gray-500/20 rounded-full rotate-45"></div>
               <div className="absolute bottom-1/4 right-1/4 w-full h-1 bg-gray-500/10"></div>
            </div>
         </div>
      </section>
    </div>
  );
}
