import { motion } from 'motion/react';
import { Target, Eye, User, Calendar, Award } from 'lucide-react';

const values = [
  { title: 'Hygiene', desc: 'Zero tolerance for unsanitary practices in bird management.', icon: ShieldCheck },
  { title: 'Quality', desc: 'Only the healthiest birds reach our processing unit.', icon: Award },
  { title: 'Reliability', desc: 'Predictable supply schedules for commercial partners.', icon: Calendar },
];

export default function About() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-primary-green py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white font-display font-bold text-5xl md:text-7xl mb-6"
            >
              The Story of <span className="text-primary-gold">YSJ Farm</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-300 text-lg leading-relaxed"
            >
              Founded in 2023, YSJ Farm Ibadan has rapidly grown into a cornerstone of the Ibadan agricultural landscape, merging traditional farming ethics with modern scientific management.
            </motion.p>
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 right-0 w-1/2 h-full"
        >
           <img src="/assets/images/poultry_coop.png" className="w-full h-full object-cover" />
        </motion.div>
      </section>

      {/* Mission Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -30 }}
            className="bg-soft-white p-12 rounded-[3rem] space-y-6"
          >
            <div className="w-16 h-16 bg-primary-gold/20 rounded-2xl flex items-center justify-center text-primary-gold">
               <Target size={32} />
            </div>
            <h2 className="font-display font-bold text-3xl text-primary-green">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed italic text-lg">
              "To provide healthy and quality poultry products through hygienic farming practices, professional management, and reliable commercial supply."
            </p>
          </motion.div>

          <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 30 }}
            className="bg-primary-green p-12 rounded-[3rem] space-y-6 text-white"
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary-gold">
               <Eye size={32} />
            </div>
            <h2 className="font-display font-bold text-3xl">Our Vision</h2>
            <p className="text-gray-300 leading-relaxed italic text-lg">
              "To become one of the most trusted poultry production and supply farms in Nigeria, setting global benchmarks in agricultural excellence."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-soft-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary-gold/20 rounded-[3rem] blur-xl group-hover:bg-primary-gold/40 transition-all"></div>
                <img 
                  src="/assets/images/mr_sam_founder.png" 
                  alt="Mr Sam Founder" 
                  className="relative rounded-[3rem] w-full shadow-2xl"
                />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-primary-gold font-bold uppercase tracking-widest text-sm">The Visionary</h2>
                <h3 className="text-4xl md:text-5xl font-display font-bold text-primary-green">Leadership of Mr Sam</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Under the strategic direction of Mr Sam, YSJ Farm was established with a single goal: to bridge the gap between quality production and commercial accessibility in the poultry industry.
              </p>
              <div className="space-y-4">
                 {[
                   'Pioneer in bio-secure farming',
                   'Advocate for sustainable agriculture',
                   'Strategic supply chain enthusiast',
                   'Dedicated to youth empowerment in farming'
                 ].map((point, i) => (
                   <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                   >
                      <div className="w-6 h-6 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green">
                         <div className="w-2 h-2 bg-primary-green rounded-full"></div>
                      </div>
                      <span className="text-gray-700 font-medium">{point}</span>
                   </motion.div>
                 ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center font-display font-bold text-4xl text-primary-green mb-20 text-center">Our Journey</h2>
          <div className="relative">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden lg:block"></div>
            
            <div className="grid lg:grid-cols-4 gap-12 relative z-10">
              {[
                { year: '2023', event: 'Founded & First 500 birds batch' },
                { year: '2024', event: 'Expanded to 5,000 birds capacity' },
                { year: 'Early 2025', event: 'Launch of commercial processing' },
                { year: 'Present', event: '7,000+ birds & Nationwide supply network' },
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-primary-gold relative mt-10 lg:mt-0"
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 bg-primary-green rounded-full flex items-center justify-center text-white font-bold hidden lg:flex">
                    {i + 1}
                  </div>
                  <h4 className="text-primary-green font-display font-bold text-2xl mb-2">{step.year}</h4>
                  <p className="text-gray-500 text-sm">{step.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Fixed import error (ShieldCheck was missing in About.tsx from direct reference)
import { ShieldCheck } from 'lucide-react';
