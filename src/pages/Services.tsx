import { motion } from 'motion/react';
import { Bird, Snowflake, Package, Truck, Zap, Activity, CheckCircle2 } from 'lucide-react';

const serviceDetails = [
  {
    title: 'Commercial Broiler Production',
    icon: Bird,
    desc: 'Our flagship service focusing on massive production of healthy, heavy-weight broilers. We use scientifically formulated diets and climate-controlled housing for optimal growth.',
    highlights: ['Vaccinated Stock', 'Bio-Secure Housing', 'Growth Monitoring', 'Sustainable Feed'],
    cta: 'Discuss Production Capacity'
  },
  {
    title: 'Frozen Chicken Supply',
    icon: Snowflake,
    desc: 'Hygienically processed, blast-frozen chicken parts and whole birds. Processed in an ultra-clean environment under strict supervision.',
    highlights: ['Instant Freezing', 'Perfect Packaging', 'Clean Processing', 'Quality Inspection'],
    cta: 'Place Market Order'
  },
  {
    title: 'Poultry Brooding Services',
    icon: Zap,
    desc: 'We take the risk out of early-stage poultry farming. Our brooding specialists manage chicks from day old to four weeks, ensuring high survival rates.',
    highlights: ['Temperature Control', 'Early Immunization', 'Expert Monitoring', 'Reduced Mortality'],
    cta: 'Enquire About Brooding'
  },
  {
    title: 'Bulk Poultry Supply',
    icon: Package,
    desc: 'Tailored for large outlets, caterers, and hotels requiring consistent, large-scale poultry deliveries on a regular basis.',
    highlights: ['Schedule Deliveries', 'Volume Discounting', 'Consistent Weights', 'Contract Supply'],
    cta: 'Supply Partnership'
  },
];

export default function Services() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-primary-green relative py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="space-y-6"
           >
             <h1 className="text-white font-display font-bold text-5xl md:text-7xl leading-tight">
               Our Professional <span className="text-primary-gold underline decoration-primary-gold/30">Services</span>
             </h1>
             <p className="text-gray-300 text-lg max-w-2xl mx-auto">
               Providing the backbone of Nigeria's poultry supply chain through innovation, hygiene, and scale.
             </p>
           </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {serviceDetails.map((service, i) => (
            <motion.div 
              key={service.title}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              viewport={{ once: true }}
              className={`flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}
            >
              <div className="lg:w-1/2 relative group">
                <div className="absolute inset-0 bg-primary-green/5 rounded-[4rem] group-hover:scale-105 transition-transform duration-700"></div>
                <div className="relative aspect-square md:aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
                   <img 
                    src={[
                      '/assets/images/hero_poultry_farm.png',
                      '/assets/images/poultry_distribution.png',
                      '/assets/images/poultry_chicks.png',
                      '/assets/images/poultry_distribution.png'
                    ][i]} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                   />
                   <div className="absolute top-8 left-8 w-16 h-16 bg-white/90 backdrop-blur shadow-2xl rounded-2xl flex items-center justify-center text-primary-gold border border-white/50">
                      <service.icon size={32} />
                   </div>
                </div>
              </div>
              <div className="lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-green">{service.title}</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">{service.desc}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {service.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-3">
                      <div className="text-primary-gold flex-shrink-0">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="text-gray-800 font-semibold">{h}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                   <a
                    href="https://wa.me/2349131201229"
                    className="px-8 py-4 bg-primary-green text-white rounded-2xl font-bold inline-flex items-center gap-3 shadow-xl hover:bg-primary-gold hover:text-primary-green transition-all"
                   >
                     {service.cta} <Activity size={18} />
                   </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-soft-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-primary-gold font-bold uppercase tracking-widest text-sm mb-4">The Pipeline</h2>
              <h3 className="text-4xl font-display font-bold text-primary-green italic">How We Deliver Excellence</h3>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Quality Sourcing', step: '01', desc: 'Sourcing of day-old chicks from the most reputable hatcheries.' },
                { title: 'Precision Rearing', step: '02', desc: 'Strict dietary and environmental control for optimal weight gain.' },
                { title: 'Hygienic Processing', step: '03', desc: 'World-class processing facility ensuring product purity.' },
              ].map((p, idx) => (
                <motion.div 
                  key={p.step} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-10 rounded-[2.5rem] shadow-sm relative group hover:bg-primary-green transition-all"
                >
                   <span className="absolute top-6 right-8 text-6xl font-display font-black text-gray-100 group-hover:text-white/10 transition-all">{p.step}</span>
                   <div className="space-y-4 relative z-10">
                      <h4 className="text-2xl font-bold text-primary-green group-hover:text-primary-gold transition-all">{p.title}</h4>
                      <p className="text-gray-500 group-hover:text-gray-300 transition-all">{p.desc}</p>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
