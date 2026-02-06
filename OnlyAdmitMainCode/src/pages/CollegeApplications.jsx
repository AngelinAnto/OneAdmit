import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, FileText, Calendar, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function CollegeApplications() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: college } = useQuery({
    queryKey: ['myCollege'],
    queryFn: async () => {
      const user = await base44.auth.me();
      if (!user.college_id) return null;
      const colleges = await base44.entities.College.filter({ id: user.college_id });
      return colleges[0];
    },
    enabled: !!user,
  });

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['collegeApplications'],
    queryFn: async () => {
      if (!college?.id) return [];
      return base44.entities.Application.filter({ college_id: college.id }, '-created_date');
    },
    enabled: !!college?.id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Application.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collegeApplications'] });
      toast.success('Application status updated');
    },
  });

  const pending = applications.filter(a => a.status === 'pending');
  const reviewed = applications.filter(a => ['under_review', 'accepted', 'rejected', 'waitlisted'].includes(a.status));

  if (!college) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Link to={createPageUrl('CollegeDashboard')}>
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-indigo-200">Review and manage student applications</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed ({reviewed.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <ApplicationList applications={applications} isLoading={isLoading} onUpdateStatus={updateStatusMutation.mutate} />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <ApplicationList applications={pending} isLoading={isLoading} onUpdateStatus={updateStatusMutation.mutate} />
          </TabsContent>

          <TabsContent value="reviewed" className="mt-6">
            <ApplicationList applications={reviewed} isLoading={isLoading} onUpdateStatus={updateStatusMutation.mutate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ApplicationList({ applications, isLoading, onUpdateStatus }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-48" />)}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No applications</h3>
          <p className="text-gray-600">Applications will appear here once students apply</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map(app => (
        <Card key={app.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{app.student_name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{app.course}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{app.student_email}</span>
                </div>
                {app.exam_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Exam: {format(new Date(app.exam_date), 'MMM d, yyyy')} at {app.exam_time}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Payment:</span>{' '}
                  <Badge variant={app.payment_status === 'completed' ? 'default' : 'secondary'}>
                    {app.payment_status}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-600">Applied:</span>{' '}
                  {format(new Date(app.created_date), 'MMM d, yyyy')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <span className="text-sm text-gray-600">Update Status:</span>
              <Select
                value={app.status}
                onValueChange={(status) => onUpdateStatus({ id: app.id, status })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    waitlisted: 'bg-purple-100 text-purple-800',
  };

  return (
    <Badge className={colors[status]}>
      {status.replace('_', ' ')}
    </Badge>
  );
}