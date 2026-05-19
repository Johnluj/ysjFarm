import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

const stats = [
  { label: 'Birds Managed', value: 7000, suffix: '+' },
  { label: 'Farm Facility', value: 10, suffix: ' Acres' },
  { label: 'Since', value: 2023, suffix: '' },
  { label: 'Monthly Capacity', value: 2500, suffix: '+' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let duration = 2000;
      let start = 0;
      let end = value;
      let increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-display font-bold text-4xl md:text-5xl text-primary-green">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-20 bg-soft-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] text-center space-y-2 border-b-4 border-primary-gold hover:-translate-y-2 transition-transform"
            >
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
