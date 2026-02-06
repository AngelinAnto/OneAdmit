import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, X, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

const COURSE_OPTIONS = [
  'BTech Computer Science',
  'BTech Electronics',
  'BTech Mechanical',
  'BTech Civil',
  'BTech Electrical',
  'BArch Architecture',
];

const CITY_OPTIONS = [
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Trichy',
  'Salem',
  'Vellore',
];

export default function CollegeSettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: college, isLoading } = useQuery({
    queryKey: ['myCollege'],
    queryFn: async () => {
      const user = await base44.auth.me();
      if (!user.college_id) return null;
      const colleges = await base44.entities.College.filter({ id: user.college_id });
      const college = colleges[0];
      setFormData(college || {});
      return college;
    },
    enabled: !!user,
  });

  const createCollegeMutation = useMutation({
    mutationFn: async (data) => {
      const newCollege = await base44.entities.College.create(data);
      await base44.auth.updateMe({ college_id: newCollege.id });
      return newCollege;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCollege'] });
      toast.success('College profile created!');
      navigate(createPageUrl('CollegeDashboard'));
    },
  });

  const updateCollegeMutation = useMutation({
    mutationFn: (data) => base44.entities.College.update(college.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCollege'] });
      toast.success('Settings updated!');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (college) {
      updateCollegeMutation.mutate(formData);
    } else {
      createCollegeMutation.mutate(formData);
    }
  };

  const toggleCourse = (course) => {
    const courses = formData.courses || [];
    if (courses.includes(course)) {
      setFormData({ ...formData, courses: courses.filter(c => c !== course) });
    } else {
      setFormData({ ...formData, courses: [...courses, course] });
    }
  };

  const saving = createCollegeMutation.isPending || updateCollegeMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to={createPageUrl('CollegeDashboard')}>
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">College Settings</h1>
          <p className="text-indigo-200">Customize your profile and application requirements</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>College Name *</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>College Code *</Label>
                <Input
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., SRM001"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Select
                    value={formData.city || ''}
                    onValueChange={(v) => setFormData({ ...formData, city: v })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITY_OPTIONS.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Application Fee (₹) *</Label>
                  <Input
                    type="number"
                    value={formData.application_fee || ''}
                    onChange={(e) => setFormData({ ...formData, application_fee: parseFloat(e.target.value) })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Contact Email *</Label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Phone *</Label>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Courses (Tags) */}
          <Card>
            <CardHeader>
              <CardTitle>Offered Courses (Tags)</CardTitle>
              <p className="text-sm text-gray-600">Students can filter colleges by these courses</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {COURSE_OPTIONS.map(course => (
                  <label key={course} className="flex items-center gap-3 cursor-pointer p-3 border rounded-xl hover:bg-gray-50">
                    <Checkbox
                      checked={(formData.courses || []).includes(course)}
                      onCheckedChange={() => toggleCourse(course)}
                    />
                    <span>{course}</span>
                  </label>
                ))}
              </div>
              {formData.courses?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.courses.map(course => (
                    <Badge key={course} variant="secondary">{course}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fees & Facilities */}
          <Card>
            <CardHeader>
              <CardTitle>Fees & Facilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Annual Fees (Min) ₹</Label>
                  <Input
                    type="number"
                    value={formData.annual_fees_min || ''}
                    onChange={(e) => setFormData({ ...formData, annual_fees_min: parseFloat(e.target.value) })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Annual Fees (Max) ₹</Label>
                  <Input
                    type="number"
                    value={formData.annual_fees_max || ''}
                    onChange={(e) => setFormData({ ...formData, annual_fees_max: parseFloat(e.target.value) })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.has_hostel || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, has_hostel: checked })}
                  />
                  <span>Has Hostel Facility</span>
                </label>

                {formData.has_hostel && (
                  <div className="ml-9">
                    <Label>Hostel Fees (Annual) ₹</Label>
                    <Input
                      type="number"
                      value={formData.hostel_fees || ''}
                      onChange={(e) => setFormData({ ...formData, hostel_fees: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.has_scholarship || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, has_scholarship: checked })}
                  />
                  <span>Offers Scholarships</span>
                </label>

                {formData.has_scholarship && (
                  <div className="ml-9">
                    <Label>Scholarship Details</Label>
                    <Textarea
                      value={formData.scholarship_details || ''}
                      onChange={(e) => setFormData({ ...formData, scholarship_details: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Accreditation */}
          <Card>
            <CardHeader>
              <CardTitle>Accreditation & Ranking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>NAAC Accreditation</Label>
                <Select
                  value={formData.accreditation || ''}
                  onValueChange={(v) => setFormData({ ...formData, accreditation: v })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select accreditation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NAAC A++">NAAC A++</SelectItem>
                    <SelectItem value="NAAC A+">NAAC A+</SelectItem>
                    <SelectItem value="NAAC A">NAAC A</SelectItem>
                    <SelectItem value="NAAC B++">NAAC B++</SelectItem>
                    <SelectItem value="NAAC B+">NAAC B+</SelectItem>
                    <SelectItem value="NAAC B">NAAC B</SelectItem>
                    <SelectItem value="Not Accredited">Not Accredited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>NIRF Ranking (Optional)</Label>
                <Input
                  type="number"
                  value={formData.ranking || ''}
                  onChange={(e) => setFormData({ ...formData, ranking: parseInt(e.target.value) })}
                  placeholder="e.g., 25"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            disabled={saving}
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              college ? 'Update Settings' : 'Create College Profile'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}