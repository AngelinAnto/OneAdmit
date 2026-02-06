import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center px-6 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 -left-32 w-64 h-64 bg-violet-200 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-20 -right-32 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30" />
      
      <div className="relative z-10 max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full border border-violet-100 mb-8">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-700">Admissions Made Simple</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              OneAdmit
            </span>
          </h1>
          <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
            One form.<br />Every future.
          </p>
          <p className="text-lg text-gray-500 mb-10 max-w-sm mx-auto">
            Upload details once, apply everywhere instantly. Save 5+ hours per application.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <Link to={createPageUrl('Profile')}>
            <Button 
              size="lg"
              className="w-full h-14 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-2xl text-lg font-semibold shadow-lg shadow-violet-200 transition-all duration-300 hover:shadow-xl hover:shadow-violet-300"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to={createPageUrl('Colleges')}>
            <Button 
              variant="outline"
              size="lg"
              className="w-full h-14 border-2 border-gray-200 hover:border-violet-200 hover:bg-violet-50 rounded-2xl text-lg font-medium"
            >
              Browse Colleges
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}