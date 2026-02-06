import { motion } from 'framer-motion';
import { UserCircle, Search, MousePointer, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: UserCircle,
    title: 'Create Profile',
    description: 'Fill your details once (15 mins)',
    color: 'bg-violet-100 text-violet-600'
  },
  {
    icon: Search,
    title: 'Explore Colleges',
    description: 'Filter by course, hostel, fees',
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    icon: MousePointer,
    title: 'One-Click Apply',
    description: 'Book exam slot & pay instantly',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: CheckCircle,
    title: 'Track Status',
    description: 'All applications in one place',
    color: 'bg-pink-100 text-pink-600'
  }
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h2>
          <p className="text-gray-500">Four simple steps to your dream college</p>
        </motion.div>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm"
            >
              <div className="relative">
                <div className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="absolute -top-2 -left-2 w-6 h-6 bg-gray-900 text-white rounded-full text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
