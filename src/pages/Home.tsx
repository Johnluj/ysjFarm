import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import ServicesPreview from '../components/home/ServicesPreview';
import { motion } from 'motion/react';
import { ShieldCheck, Leaf, Truck, Users, Activity, HeartPulse } from 'lucide-react';

const whyChooseUs = [
  { title: 'Hygienic Environment', icon: ShieldCheck, desc: 'Our facility maintains strict bio-security standards to ensure zero contamination.' },
  { title: 'Healthy Bird Management', icon: HeartPulse, desc: 'Expert veterinary supervision and premium feed for optimal bird health.' },
  { title: 'Reliable Supply', icon: Truck, desc: 'Efficient logistics ensuring prompt delivery of poultry, maize, and raw cashews.' },
  { title: 'Quality Assurance', icon: Leaf, desc: '100% natural growth processes without harmful inorganic additives.' },
  { title: 'Experienced Team', icon: Users, desc: 'Professional poultry managers with decades of combined industry experience.' },
  { title: 'Customer First', icon: Activity, desc: 'Tailored solutions for large-scale distributors and small caterers alike.' },
];

const galleryImages = [
  '/assets/images/poultry_chicks.png',
  '/assets/images/poultry_coop.png',
  '/assets/images/home_gallery_final.png',
  '/assets/images/hero_poultry_farm.png',
  '/assets/images/maize_farming_field.png',
  '/assets/images/cashew_farming_harvest.png',
];

export default function Home() {
  return (
    <div className="space-y-0">
      <Hero />
      <Stats />

      {/* Why Choose Us */}
      <section className="py-24 bg-soft-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-primary-gold font-bold uppercase tracking-widest text-sm">Why YSJ Poultry</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-primary-green">Excellence in Every Wing</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-gold/20 transition-all group"
              >
                <div className="w-14 h-14 bg-primary-green/5 rounded-2xl flex items-center justify-center text-primary-green mb-6 group-hover:bg-primary-gold group-hover:text-white transition-all">
                  <item.icon size={28} />
                </div>
                <h4 className="text-xl font-display font-bold text-primary-green mb-3">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServicesPreview />

      {/* Gallery */}
      <section className="py-24 bg-primary-green relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <h2 className="text-primary-gold font-bold uppercase tracking-widest text-sm">Visual Journey</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white">Our Farm in Action</h3>
            </div>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group rounded-3xl overflow-hidden cursor-zoom-in"
              >
                <img
                  src={img}
                  alt={`Farm Gallery ${idx}`}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-primary-green/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="w-12 h-12 bg-primary-gold rounded-full flex items-center justify-center text-primary-green">
                      <Leaf size={24} />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-primary-gold rounded-[3rem] p-12 md:p-20 text-center space-y-10 relative overflow-hidden shadow-2xl shadow-primary-gold/30"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-0 left-0 w-40 h-40 border-8 border-white rounded-full -ml-20 -mt-20"></div>
             <div className="absolute bottom-0 right-0 w-60 h-60 border-8 border-white rounded-full -mr-30 -mb-30"></div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-primary-green font-display font-bold text-4xl md:text-6xl">
              Ready to Upgrade Your Supply Chain?
            </h2>
            <p className="text-primary-green/80 text-lg max-w-2xl mx-auto font-medium">
              Join Ibadan's most successful agribusiness distributors and partners. Secure your crops and premium poultry today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="tel:09131201229" className="w-full sm:w-auto px-10 py-5 bg-primary-green text-white rounded-full font-bold shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-all">
              <ShieldCheck size={20} /> Call for Orders
            </a>
            <a href="https://wa.me/2349131201229" className="w-full sm:w-auto px-10 py-5 bg-white text-primary-green rounded-full font-bold shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-all">
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
