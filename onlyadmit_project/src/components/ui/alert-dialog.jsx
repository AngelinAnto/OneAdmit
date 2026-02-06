import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, IndianRupee, Home, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CollegeCard({ college, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-br from-violet-100 to-indigo-100 relative">
        {college.cover_image_url ? (
          <img 
            src={college.cover_image_url} 
            alt={college.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl font-bold text-violet-200">
              {college.name?.charAt(0)}
            </div>
          </div>
        )}
        
        {college.accreditation && (
          <Badge className="absolute top-3 right-3 bg-white/90 text-violet-700 backdrop-blur-sm">
            <Award className="w-3 h-3 mr-1" />
            {college.accreditation}
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          {college.logo_url ? (
            <img 
              src={college.logo_url} 
              alt=""
              className="w-12 h-12 rounded-xl object-cover border border-gray-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              {college.name?.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{college.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {college.city}
            </p>
          </div>
        </div>
        
        {/* Courses */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {college.courses?.slice(0, 3).map((course, i) => (
            <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              {course}
            </Badge>
          ))}
          {college.courses?.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
              +{college.courses.length - 3}
            </Badge>
          )}
        </div>
        
        {/* Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3 h-3" />
            {college.annual_fees_min?.toLocaleString()}-{college.annual_fees_max?.toLocaleString()}
          </span>
          {college.has_hostel && (
            <span className="flex items-center gap-1 text-green-600">
              <Home className="w-3 h-3" />
              Hostel
            </span>
          )}
        </div>
        
        <Link to={createPageUrl(`CollegeDetail?id=${college.id}`)}>
          <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl">
            View & Apply
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
