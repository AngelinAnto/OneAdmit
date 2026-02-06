import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const courses = ['BTech CS', 'BTech IT', 'BTech Mechanical', 'BTech Civil', 'BTech ECE', 'BTech EEE'];
const cities = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'];

export default function CollegeFilters({ filters, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const activeFiltersCount = 
    (filters.courses?.length || 0) + 
    (filters.cities?.length || 0) + 
    (filters.hasHostel ? 1 : 0) + 
    (filters.hasScholarship ? 1 : 0);

  const toggleArrayFilter = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const clearFilters = () => {
    onFilterChange({ search: filters.search });
  };

  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search colleges..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-9 h-11 bg-gray-50 border-0 rounded-xl"
          />
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl relative border-gray-200">
              <SlidersHorizontal className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
            <SheetHeader className="text-left pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle>Filters</SheetTitle>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                )}
              </div>
            </SheetHeader>
            
            <div className="space-y-6 overflow-y-auto pb-8">
              {/* Courses */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Courses</h4>
                <div className="flex flex-wrap gap-2">
                  {courses.map(course => (
                    <Badge
                      key={course}
                      variant={filters.courses?.includes(course) ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1.5 ${
                        filters.courses?.includes(course) 
                          ? 'bg-violet-600' 
                          : 'hover:bg-violet-50'
                      }`}
                      onClick={() => toggleArrayFilter('courses', course)}
                    >
                      {course}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Cities */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Location</h4>
                <div className="flex flex-wrap gap-2">
                  {cities.map(city => (
                    <Badge
                      key={city}
                      variant={filters.cities?.includes(city) ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1.5 ${
                        filters.cities?.includes(city) 
                          ? 'bg-violet-600' 
                          : 'hover:bg-violet-50'
                      }`}
                      onClick={() => toggleArrayFilter('cities', city)}
                    >
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Facilities */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Facilities</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={filters.hasHostel || false}
                      onCheckedChange={(checked) => 
                        onFilterChange({ ...filters, hasHostel: checked })
                      }
                    />
                    <span className="text-gray-700">Has Hostel</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={filters.hasScholarship || false}
                      onCheckedChange={(checked) => 
                        onFilterChange({ ...filters, hasScholarship: checked })
                      }
                    />
                    <span className="text-gray-700">Scholarship Available</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <Button 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600"
                onClick={() => setIsOpen(false)}
              >
                Show Results
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.courses?.map(course => (
            <Badge 
              key={course} 
              variant="secondary" 
              className="bg-violet-100 text-violet-700 cursor-pointer"
              onClick={() => toggleArrayFilter('courses', course)}
            >
              {course}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {filters.cities?.map(city => (
            <Badge 
              key={city} 
              variant="secondary" 
              className="bg-indigo-100 text-indigo-700 cursor-pointer"
              onClick={() => toggleArrayFilter('cities', city)}
            >
              {city}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {filters.hasHostel && (
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-700 cursor-pointer"
              onClick={() => onFilterChange({ ...filters, hasHostel: false })}
            >
              Hostel
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {filters.hasScholarship && (
            <Badge 
              variant="secondary" 
              className="bg-amber-100 text-amber-700 cursor-pointer"
              onClick={() => onFilterChange({ ...filters, hasScholarship: false })}
            >
              Scholarship
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
