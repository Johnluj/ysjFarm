import { motion } from 'motion/react';
import { Bird, Sprout, Package, Trees, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Broiler Production',
    desc: 'Elite commercial bird production following strict bio-security protocols.',
    icon: Bird,
    image: '/assets/images/hero_poultry_farm.png',
  },
  {
    title: 'Maize Farming',
    desc: 'Cultivating high-yield, premium-grade yellow and white maize for agri-processing and custom feed compounding.',
    icon: Sprout,
    image: '/assets/images/maize_farming_field.png',
  },
  {
    title: 'Poultry Brooding',
    desc: 'Professional management of day-old chicks through critical initial stages.',
    icon: Zap,
    image: '/assets/images/poultry_chicks.png',
  },
  {
    title: 'Cashew Farming',
    desc: 'Sustainable cultivation and bulk distribution of premium, uniform export-grade raw cashew nuts.',
    icon: Trees,
    image: '/assets/images/cashew_farming_harvest.png',
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-primary-gold font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-2">
              <span className="w-8 h-px bg-primary-gold"></span> OUR CORE SPECIALTIES
            </h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-primary-green leading-tight">
              Premium Poultry Solutions Tailored for Excellence
            </h3>
          </div>
          <Link to="/services" className="text-primary-green font-bold flex items-center gap-2 hover:text-primary-gold transition-colors pb-2">
            View All Services <Package size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-[450px] rounded-[2rem] overflow-hidden shadow-xl"
            >
              {/* Background Image */}
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-green via-primary-green/40 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-8 space-y-4">
                <div className="w-12 h-12 bg-primary-gold rounded-2xl flex items-center justify-center text-primary-green shadow-lg transition-transform group-hover:-translate-y-2 group-hover:rotate-6">
                  <service.icon size={24} />
                </div>
                <h4 className="text-white font-display font-bold text-2xl">{service.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {service.desc}
                </p>
                <div className="pt-2">
                   <div className="w-10 h-1 h-1 bg-primary-gold/50 rounded-full group-hover:w-full transition-all duration-700"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
