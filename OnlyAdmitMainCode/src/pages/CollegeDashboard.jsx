import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Settings, 
  Calendar, 
  FileText, 
  Users, 
  Clock,
  TrendingUp,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export default function CollegeDashboard() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: college, isLoading: collegeLoading } = useQuery({
    queryKey: ['myCollege'],
    queryFn: async () => {
      const user = await base44.auth.me();
      if (!user.college_id) return null;
      return base44.entities.College.filter({ id: user.college_id }).then(list => list[0]);
    },
    enabled: !!user?.college_id,
  });

  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ['collegeApplications'],
    queryFn: async () => {
      if (!college?.id) return [];
      return base44.entities.Application.filter({ college_id: college.id }, '-created_date');
    },
    enabled: !!college?.id,
  });

  const { data: examSlots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ['collegeExamSlots'],
    queryFn: async () => {
      if (!college?.id) return [];
      return base44.entities.ExamSlot.filter({ college_id: college.id }, 'date');
    },
    enabled: !!college?.id,
  });

  const isLoading = userLoading || collegeLoading;

  // Stats
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(a => a.status === 'pending').length;
  const totalRevenue = applications.reduce((sum, a) => sum + (a.amount_paid || 0), 0);
  const upcomingSlots = examSlots.filter(s => new Date(s.date) >= new Date() && s.is_active).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Skeleton className="h-32 mb-6" />
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Please complete your college profile to start receiving applications.
            </p>
            <Link to={createPageUrl('CollegeSettings')}>
              <Button className="w-full">Complete Profile Setup</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{college.name}</h1>
              <p className="text-indigo-200">College Dashboard</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={async () => {
                  await base44.auth.updateMe({ account_type: null });
                  window.location.href = createPageUrl('RoleSelection');
                }}
              >
                Switch Account
              </Button>
              <Link to={createPageUrl('CollegeSettings')}>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <StatCard
            title="Total Applications"
            value={totalApplications}
            icon={FileText}
            color="violet"
          />
          <StatCard
            title="Pending Review"
            value={pendingApplications}
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Revenue Collected"
            value={`₹${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Upcoming Slots"
            value={upcomingSlots}
            icon={Calendar}
            color="blue"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link to={createPageUrl('ManageExamSlots')}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Manage Exam Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Create and manage exam slots, dates, and capacity
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('CollegeApplications')}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-indigo-600" />
                  View Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Review and manage student applications
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('CollegeSettings')}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  College Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Update profile, fees, and application form
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : applications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No applications yet</p>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{app.student_name}</p>
                      <p className="text-sm text-gray-600">{app.course}</p>
                    </div>
                    <Badge variant={app.status === 'pending' ? 'secondary' : 'default'}>
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}