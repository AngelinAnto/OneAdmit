import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BottomNav from '@/components/ui/BottomNav';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Bell, AlertCircle, Calendar, Info, Trophy, Clock } from 'lucide-react';
import { format } from 'date-fns';

const typeIcons = {
  general: Info,
  deadline: Clock,
  exam: Calendar,
  result: Trophy,
  important: AlertCircle,
};

const typeColors = {
  general: 'bg-gray-100 text-gray-700',
  deadline: 'bg-red-100 text-red-700',
  exam: 'bg-blue-100 text-blue-700',
  result: 'bg-green-100 text-green-700',
  important: 'bg-amber-100 text-amber-700',
};

export default function Announcements() {
  // Get user's applied colleges
  const { data: applications = [] } = useQuery({
    queryKey: ['myApplications'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Application.filter({ student_email: user.email });
    },
  });

  const appliedCollegeIds = applications.map(a => a.college_id);

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements', appliedCollegeIds],
    queryFn: () => base44.entities.Announcement.filter({ is_active: true }, '-created_date'),
  });

  // Filter to show announcements from applied colleges
  const relevantAnnouncements = announcements.filter(
    a => appliedCollegeIds.includes(a.college_id)
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Updates</h1>
            <p className="text-sm text-gray-500">
              {relevantAnnouncements.length} announcements
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : relevantAnnouncements.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No updates yet</h3>
            <p className="text-gray-500 text-sm">
              {applications.length === 0 
                ? 'Apply to colleges to see their announcements' 
                : 'Check back later for updates from your colleges'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {relevantAnnouncements.map((announcement, index) => {
              const Icon = typeIcons[announcement.type] || Info;
              
              return (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${typeColors[announcement.type]} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                        <Badge variant="secondary" className={typeColors[announcement.type]}>
                          {announcement.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-violet-600 font-medium mb-2">
                        {announcement.college_name}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-3">
                        {format(new Date(announcement.created_date), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ApplicationCard from '@/components/applications/ApplicationCard';
import BottomNav from '@/components/ui/BottomNav';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Applications() {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Application.filter({ student_email: user.email }, '-created_date');
    },
  });

  const pendingApps = applications.filter(a => ['pending', 'submitted', 'under_review'].includes(a.status));
  const acceptedApps = applications.filter(a => a.status === 'accepted');
  const rejectedApps = applications.filter(a => ['rejected', 'waitlisted'].includes(a.status));

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Applications</h1>
            <p className="text-sm text-gray-500">{applications.length} total applications</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full bg-gray-100 rounded-xl p-1 h-auto">
            <TabsTrigger value="all" className="flex-1 rounded-lg py-2.5 data-[state=active]:bg-white">
              All ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 rounded-lg py-2.5 data-[state=active]:bg-white">
              <Clock className="w-3 h-3 mr-1" />
              ({pendingApps.length})
            </TabsTrigger>
            <TabsTrigger value="accepted" className="flex-1 rounded-lg py-2.5 data-[state=active]:bg-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              ({acceptedApps.length})
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="space-y-4 mt-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          ) : (
            <>
              <TabsContent value="all" className="mt-4 space-y-4">
                {applications.length === 0 ? (
                  <EmptyState />
                ) : (
                  applications.map((app, index) => (
                    <ApplicationCard key={app.id} application={app} index={index} />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="pending" className="mt-4 space-y-4">
                {pendingApps.length === 0 ? (
                  <EmptyState message="No pending applications" />
                ) : (
                  pendingApps.map((app, index) => (
                    <ApplicationCard key={app.id} application={app} index={index} />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="accepted" className="mt-4 space-y-4">
                {acceptedApps.length === 0 ? (
                  <EmptyState message="No accepted applications yet" />
                ) : (
                  acceptedApps.map((app, index) => (
                    <ApplicationCard key={app.id} application={app} index={index} />
                  ))
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}

function EmptyState({ message = "No applications yet" }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{message}</h3>
      <p className="text-gray-500 text-sm">Start exploring colleges to apply</p>
    </div>
  );
}
