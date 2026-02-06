import { motion } from 'framer-motion';
import { Shield, Lock, Smartphone, FileCheck } from 'lucide-react';

const badges = [
  { icon: FileCheck, text: 'DigiLocker Integrated' },
  { icon: Lock, text: 'DPDP Compliant' },
  { icon: Shield, text: 'Direct College Payments' },
  { icon: Smartphone, text: 'Mobile-First Design' },
];

export default function TrustBadges() {
  return (
    <section className="px-6 py-12 bg-gray-900">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Trusted & Secure
          </h3>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.text}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 bg-gray-800 rounded-xl p-3"
            >
              <badge.icon className="w-5 h-5 text-violet-400 flex-shrink-0" />
              <span className="text-sm text-gray-300 font-medium">{badge.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
