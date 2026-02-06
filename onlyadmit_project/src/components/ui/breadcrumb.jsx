import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';
import { Loader2, Upload, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileForm({ profile, onSave }) {
  const [formData, setFormData] = useState(profile || {});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
  const [sameAsCurrent, setSameAsCurrent] = useState(true);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [field]: true }));
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleChange(field, file_url);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSave = { ...formData };
      if (sameAsCurrent) {
        dataToSave.permanent_address = formData.address;
        dataToSave.permanent_state = formData.state;
        dataToSave.permanent_district = formData.district;
        dataToSave.permanent_city = formData.city;
        dataToSave.permanent_pincode = formData.pincode;
      }
      await onSave({ ...dataToSave, profile_complete: true });
      toast.success('Profile saved successfully');
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const FileUploadField = ({ label, field, required }) => (
    <div className="space-y-2">
      <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
      <div className="flex items-center gap-3">
        <label className="flex-1">
          <div className="h-12 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-violet-300 hover:bg-violet-50 transition-colors">
            {uploading[field] ? (
              <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />
            ) : formData[field] ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Uploaded</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload file</span>
              </div>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*,.pdf"
            onChange={(e) => handleFileUpload(field, e.target.files[0])}
          />
        </label>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
      {/* Personal Information */}
      <div className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900">Personal Information</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input
                value={formData.first_name || ''}
                onChange={(e) => handleChange('first_name', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Middle Name *</Label>
              <Input
                value={formData.middle_name || ''}
                onChange={(e) => handleChange('middle_name', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name *</Label>
              <Input
                value={formData.last_name || ''}
                onChange={(e) => handleChange('last_name', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Date of Birth *</Label>
              <Input
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Place of Birth *</Label>
              <Input
                value={formData.place_of_birth || ''}
                onChange={(e) => handleChange('place_of_birth', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Citizenship *</Label>
              <Input
                value={formData.citizenship || 'Indian'}
                onChange={(e) => handleChange('citizenship', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select
                value={formData.gender || ''}
                onValueChange={(v) => handleChange('gender', v)}
                required
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(v) => handleChange('category', v)}
                required
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="OBC">OBC</SelectItem>
                  <SelectItem value="SC">SC</SelectItem>
                  <SelectItem value="ST">ST</SelectItem>
                  <SelectItem value="EWS">EWS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Aadhaar Number *</Label>
              <Input
                value={formData.aadhar_number || ''}
                onChange={(e) => handleChange('aadhar_number', e.target.value)}
                placeholder="XXXX XXXX XXXX"
                className="h-12 rounded-xl"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900">Contact Information</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Alternate Phone *</Label>
              <Input
                value={formData.alternate_phone || ''}
                onChange={(e) => handleChange('alternate_phone', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Current Address */}
      <div className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900">Current Address</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Address *</Label>
            <Input
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="House No, Street"
              className="h-12 rounded-xl"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>State *</Label>
              <Input
                value={formData.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>District *</Label>
              <Input
                value={formData.district || ''}
                onChange={(e) => handleChange('district', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>City/Town *</Label>
              <Input
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>PIN Code *</Label>
              <Input
                value={formData.pincode || ''}
                onChange={(e) => handleChange('pincode', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Permanent Address */}
      <div className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Permanent Address</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={sameAsCurrent}
              onCheckedChange={setSameAsCurrent}
            />
            <span className="text-sm text-gray-600">Same as current</span>
          </label>
        </div>
        
        {!sameAsCurrent && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={formData.permanent_address || ''}
                onChange={(e) => handleChange('permanent_address', e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={formData.permanent_state || ''}
                  onChange={(e) => handleChange('permanent_state', e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input
                  value={formData.permanent_district || ''}
                  onChange={(e) => handleChange('permanent_district', e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>City/Town</Label>
                <Input
                  value={formData.permanent_city || ''}
                  onChange={(e) => handleChange('permanent_city', e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>PIN Code</Label>
                <Input
                  value={formData.permanent_pincode || ''}
                  onChange={(e) => handleChange('permanent_pincode', e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Parent/Guardian Details */}
      <div className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900">Parent/Guardian Details</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Father's Name *</Label>
              <Input
                value={formData.father_name || ''}
                onChange={(e) => handleChange('father_name', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Mother's Name *</Label>
              <Input
                value={formData.mother_name || ''}
                onChange={(e) => handleChange('mother_name', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Guardian Name (if applicable)</Label>
            <Input
              value={formData.guardian_name || ''}
              onChange={(e) => handleChange('guardian_name', e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Parent Qualification *</Label>
              <Input
                value={formData.parent_qualification || ''}
                onChange={(e) => handleChange('parent_qualification', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Parent Occupation *</Label>
              <Input
                value={formData.parent_occupation || ''}
                onChange={(e) => handleChange('parent_occupation', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Annual Income *</Label>
              <Input
                type="number"
                value={formData.parent_annual_income || ''}
                onChange={(e) => handleChange('parent_annual_income', parseFloat(e.target.value))}
                placeholder="₹"
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Parent Contact *</Label>
              <Input
                value={formData.parent_contact || ''}
                onChange={(e) => handleChange('parent_contact', e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* 10th Details */}
      <div className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900">10th Standard Details</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Board Name *</Label>
            <Input
              value={formData.tenth_board || ''}
              onChange={(e) => handleChange('tenth_board', e.target.value)}
              placeholder="e.g., CBSE, State Board"
              className="h-12 rounded-xl"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>School Name *</Label>
            <Input
              value={formData.tenth_school || ''}
              onChange={(e) => handleChange('tenth_school', e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Year of Passing *</Label>
              <Input
                type="number"
                value={formData.tenth_year || ''}
                onChange={(e) => handleChange('tenth_year', parseInt(e.target.value))}
                placeholder="2024"
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Percentage/CGPA *</Label>
              <Input
                type="number"
                value={formData.tenth_marks || ''}
                onChange={(e) => handleChange('tenth_marks', parseFloat(e.target.value))}
                placeholder="85.5"
                className="h-12 rounded-xl"
                step="0.1"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* 12th Details */}
      <div className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900">12th Standard Details</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Board Name *</Label>
            <Input
              value={formData.twelfth_board || ''}
              onChange={(e) => handleChange('twelfth_board', e.target.value)}
              placeholder="e.g., CBSE, State Board"
              className="h-12 rounded-xl"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>School Name *</Label>
            <Input
              value={formData.twelfth_school || ''}
              onChange={(e) => handleChange('twelfth_school', e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Year of Passing *</Label>
              <Input
                type="number"
                value={formData.twelfth_year || ''}
                onChange={(e) => handleChange('twelfth_year', parseInt(e.target.value))}
                placeholder="2026"
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Stream *</Label>
              <Select
                value={formData.twelfth_stream || ''}
                onValueChange={(v) => handleChange('twelfth_stream', v)}
                required
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="commerce">Commerce</SelectItem>
                  <SelectItem value="arts">Arts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Percentage/CGPA *</Label>
            <Input
              type="number"
              value={formData.twelfth_marks || ''}
              onChange={(e) => handleChange('twelfth_marks', parseFloat(e.target.value))}
              placeholder="88.0"
              className="h-12 rounded-xl"
              step="0.1"
              required
            />
          </div>
        </div>
      </div>

      {/* Entrance Exam */}
      <div className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900">Entrance Exam (Optional)</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Exam Name</Label>
            <Select
              value={formData.entrance_exam || ''}
              onValueChange={(v) => handleChange('entrance_exam', v)}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JEE Main">JEE Main</SelectItem>
                <SelectItem value="TNEA">TNEA</SelectItem>
                <SelectItem value="COMEDK">COMEDK</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Score/Rank</Label>
            <Input
              type="number"
              value={formData.entrance_score || ''}
              onChange={(e) => handleChange('entrance_score', parseFloat(e.target.value))}
              className="h-12 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900">Documents</h3>
        <FileUploadField label="Photo" field="photo_url" />
        <FileUploadField label="10th Marksheet" field="tenth_marksheet_url" />
        <FileUploadField label="12th Marksheet" field="twelfth_marksheet_url" />
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900">Preferences</h3>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={formData.needs_hostel || false}
            onCheckedChange={(checked) => handleChange('needs_hostel', checked)}
          />
          <span className="text-gray-700">I need hostel accommodation</span>
        </label>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={formData.needs_scholarship || false}
            onCheckedChange={(checked) => handleChange('needs_scholarship', checked)}
          />
          <span className="text-gray-700">I'm interested in scholarships</span>
        </label>
      </div>

      <Button 
        type="submit" 
        disabled={saving}
        className="w-full h-14 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-2xl text-lg font-semibold sticky bottom-20 z-10"
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Profile'
        )}
      </Button>
    </form>
  );
}
