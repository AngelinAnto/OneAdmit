import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Calendar, Clock, Users, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ManageExamSlots() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({});

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

  const { data: examSlots = [], isLoading } = useQuery({
    queryKey: ['collegeExamSlots'],
    queryFn: async () => {
      if (!college?.id) return [];
      return base44.entities.ExamSlot.filter({ college_id: college.id }, 'date');
    },
    enabled: !!college?.id,
  });

  const createSlotMutation = useMutation({
    mutationFn: (data) => base44.entities.ExamSlot.create({
      ...data,
      college_id: college.id,
      college_name: college.name,
      booked_seats: 0,
      is_active: true,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collegeExamSlots'] });
      setShowDialog(false);
      setFormData({});
      toast.success('Exam slot created!');
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: (id) => base44.entities.ExamSlot.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collegeExamSlots'] });
      toast.success('Exam slot deleted');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createSlotMutation.mutate(formData);
  };

  if (!college) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Exam Slots</h1>
              <p className="text-indigo-200">Create and manage exam dates for your college</p>
            </div>
            
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slot
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Exam Slot</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Start Time *</Label>
                      <Input
                        type="time"
                        value={formData.start_time || ''}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>End Time *</Label>
                      <Input
                        type="time"
                        value={formData.end_time || ''}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Venue *</Label>
                    <Input
                      value={formData.venue || ''}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="Main Auditorium"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Total Seats *</Label>
                    <Input
                      type="number"
                      value={formData.total_seats || ''}
                      onChange={(e) => setFormData({ ...formData, total_seats: parseInt(e.target.value) })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={createSlotMutation.isPending}
                    className="w-full"
                  >
                    {createSlotMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Slot'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : examSlots.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No exam slots yet</h3>
              <p className="text-gray-600 mb-4">Create your first exam slot to start accepting applications</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {examSlots.map(slot => (
              <Card key={slot.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        {format(new Date(slot.date), 'EEE, MMM d, yyyy')}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {slot.start_time} - {slot.end_time}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Delete this exam slot?')) {
                          deleteSlotMutation.mutate(slot.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        {slot.booked_seats} / {slot.total_seats} seats booked
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Venue:</span> {slot.venue}
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      {slot.booked_seats >= slot.total_seats ? (
                        <Badge variant="destructive">Full</Badge>
                      ) : (
                        <Badge variant="secondary">
                          {slot.total_seats - slot.booked_seats} seats available
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
