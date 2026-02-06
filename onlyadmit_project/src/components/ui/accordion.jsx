import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  submitted: 'bg-blue-100 text-blue-700',
  under_review: 'bg-purple-100 text-purple-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  waitlisted: 'bg-orange-100 text-orange-700',
};

const statusLabels = {
  pending: 'Payment Pending',
  submitted: 'Submitted',
  under_review: 'Under Review',
  accepted: 'Accepted',
  rejected: 'Rejected',
  waitlisted: 'Waitlisted',
};

export default function ApplicationCard({ application, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{application.college_name}</h3>
          <p className="text-sm text-gray-500">{application.course}</p>
        </div>
        <Badge className={statusStyles[application.status] || statusStyles.pending}>
          {statusLabels[application.status] || application.status}
        </Badge>
      </div>
      
      {application.exam_date && (
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-violet-500" />
            <span>{format(new Date(application.exam_date), 'MMM d, yyyy')}</span>
          </div>
          {application.exam_time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-violet-500" />
              <span>{application.exam_time}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        {application.payment_status === 'completed' && (
          <Badge variant="outline" className="text-green-600 border-green-200">
            ₹{application.amount_paid} Paid
          </Badge>
        )}
        {application.needs_hostel && (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            Hostel
          </Badge>
        )}
        {application.needs_scholarship && (
          <Badge variant="outline" className="text-amber-600 border-amber-200">
            Scholarship
          </Badge>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <Link to={createPageUrl(`CollegeDetail?id=${application.college_id}`)}>
          <Button variant="ghost" className="w-full justify-between text-violet-600 hover:text-violet-700 hover:bg-violet-50">
            View College
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
