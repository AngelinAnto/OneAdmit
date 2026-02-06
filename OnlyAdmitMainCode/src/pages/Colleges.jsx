import { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import CollegeCard from '@/components/colleges/CollegeCard';
import CollegeFilters from '@/components/colleges/CollegeFilters';
import BottomNav from '@/components/ui/BottomNav';
import { Skeleton } from '@/components/ui/skeleton';
import { GraduationCap } from 'lucide-react';

export default function Colleges() {
  const [filters, setFilters] = useState({});
  
  const { data: colleges = [], isLoading } = useQuery({
    queryKey: ['colleges'],
    queryFn: () => base44.entities.College.filter({ is_active: true }),
  });

  const filteredColleges = useMemo(() => {
    return colleges.filter(college => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = college.name?.toLowerCase().includes(searchLower);
        const cityMatch = college.city?.toLowerCase().includes(searchLower);
        if (!nameMatch && !cityMatch) return false;
      }
      
      // Course filter
      if (filters.courses?.length > 0) {
        const hasMatchingCourse = filters.courses.some(course => 
          college.courses?.includes(course)
        );
        if (!hasMatchingCourse) return false;
      }
      
      // City filter
      if (filters.cities?.length > 0) {
        if (!filters.cities.includes(college.city)) return false;
      }
      
      // Hostel filter
      if (filters.hasHostel && !college.has_hostel) return false;
      
      // Scholarship filter
      if (filters.hasScholarship && !college.has_scholarship) return false;
      
      return true;
    });
  }, [colleges, filters]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Explore Colleges</h1>
            <p className="text-sm text-gray-500">
              {filteredColleges.length} colleges found
            </p>
          </div>
        </div>
      </div>
      
      <CollegeFilters filters={filters} onFilterChange={setFilters} />
      
      <div className="px-4 py-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4">
                <Skeleton className="h-32 rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredColleges.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No colleges found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredColleges.map((college, index) => (
              <CollegeCard key={college.id} college={college} index={index} />
            ))}
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}