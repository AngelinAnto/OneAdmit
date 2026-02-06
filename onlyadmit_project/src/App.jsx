import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BottomNav from '@/components/ui/BottomNav';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Trophy, AlertCircle } from 'lucide-react';
import { format, parseISO, isBefore, isAfter, isToday } from 'date-fns';

export default function Calendar() {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Application.filter({ student_email: user.email }, '-exam_date');
    },
  });

  // Group applications by timeline
  const upcomingExams = applications.filter(a => 
    a.exam_date && isAfter(parseISO(a.exam_date), new Date())
  );
  
  const pastExams = applications.filter(a => 
    a.exam_date && isBefore(parseISO(a.exam_date), new Date()) && !isToday(parseISO(a.exam_date))
  );
  
  const todayExams = applications.filter(a => 
    a.exam_date && isToday(parseISO(a.exam_date))
  );
  
  const upcomingResults = applications.filter(a => 
    a.result_date && isAfter(parseISO(a.result_date), new Date())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-500 to-indigo-600 px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Schedule</h1>
            <p className="text-sm text-violet-200">Track your exams and results</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No schedule yet</h3>
            <p className="text-gray-500 text-sm">Apply to colleges to see your exam dates</p>
          </div>
        ) : (
          <>
            {/* Today's Exams */}
            {todayExams.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h2 className="font-bold text-gray-900">Today's Exams</h2>
                </div>
                <div className="space-y-3">
                  {todayExams.map((app, index) => (
                    <EventCard key={app.id} application={app} index={index} type="today" />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Exams */}
            {upcomingExams.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-violet-600" />
                  <h2 className="font-bold text-gray-900">Upcoming Exams</h2>
                </div>
                <div className="space-y-3">
                  {upcomingExams.map((app, index) => (
                    <EventCard key={app.id} application={app} index={index} type="upcoming" />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Results */}
            {upcomingResults.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  <h2 className="font-bold text-gray-900">Expected Results</h2>
                </div>
                <div className="space-y-3">
                  {upcomingResults.map((app, index) => (
                    <EventCard key={app.id} application={app} index={index} type="result" />
                  ))}
                </div>
              </section>
            )}

            {/* Past Exams */}
            {pastExams.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <h2 className="font-bold text-gray-900">Past Exams</h2>
                </div>
                <div className="space-y-3">
                  {pastExams.slice(0, 5).map((app, index) => (
                    <EventCard key={app.id} application={app} index={index} type="past" />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function EventCard({ application, index, type }) {
  const isResult = type === 'result';
  const date = isResult ? application.result_date : application.exam_date;
  const time = application.exam_time;
  
  const colorClasses = {
    today: 'bg-red-50 border-red-200',
    upcoming: 'bg-violet-50 border-violet-200',
    result: 'bg-amber-50 border-amber-200',
    past: 'bg-gray-50 border-gray-200'
  };

  const badgeClasses = {
    today: 'bg-red-100 text-red-700',
    upcoming: 'bg-violet-100 text-violet-700',
    result: 'bg-amber-100 text-amber-700',
    past: 'bg-gray-100 text-gray-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border-2 p-4 ${colorClasses[type]}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{application.college_name}</h3>
          <p className="text-sm text-gray-600">{application.course}</p>
        </div>
        <Badge className={badgeClasses[type]}>
          {type === 'today' ? 'TODAY' : type === 'result' ? 'Result' : 'Exam'}
        </Badge>
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <CalendarIcon className="w-4 h-4" />
          <span className="font-medium">
            {format(parseISO(date), 'EEE, MMM d, yyyy')}
          </span>
        </div>
        {time && !isResult && (
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
        )}
      </div>
      
      {type === 'today' && (
        <div className="mt-3 pt-3 border-t border-red-200">
          <p className="text-sm text-red-700 font-medium">
            ⚠️ Exam in progress - Good luck!
          </p>
        </div>
      )}
      
      {type === 'result' && (
        <div className="mt-3 pt-3 border-t border-amber-200">
          <p className="text-xs text-amber-700">
            Tentative date - check college portal for updates
          </p>
        </div>
      )}
    </motion.div>
  );
}
