import { motion } from 'framer-motion';
import { 
  Clock, Shield, FileSpreadsheet, Calendar, 
  Bell, Building2, CreditCard, MessageSquare 
} from 'lucide-react';

const studentFeatures = [
  { icon: Clock, text: 'Enter details once (15 mins)' },
  { icon: FileSpreadsheet, text: 'DigiLocker auto-fill marksheets' },
  { icon: Calendar, text: 'Automatic exam slot conflict check' },
  { icon: Bell, text: 'Real-time college updates' },
];

const collegeFeatures = [
  { icon: FileSpreadsheet, text: 'Download applications in Excel' },
  { icon: MessageSquare, text: 'Add custom questions' },
  { icon: Calendar, text: 'Manage exam slots easily' },
  { icon: CreditCard, text: 'Direct student payments' },
];

export default function Features() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Key Features</h2>
          <p className="text-gray-500">Built for both students and colleges</p>
        </motion.div>
        
        <div className="space-y-8">
          {/* Students */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">For Students</h3>
            </div>
            <ul className="space-y-3">
              {studentFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-violet-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Colleges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">For Colleges</h3>
            </div>
            <ul className="space-y-3">
              {collegeFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}