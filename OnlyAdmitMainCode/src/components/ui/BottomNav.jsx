import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Search, FileText, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', page: 'Home' },
  { icon: Search, label: 'Colleges', page: 'Colleges' },
  { icon: FileText, label: 'Apps', page: 'Applications' },
  { icon: Calendar, label: 'Schedule', page: 'Calendar' },
  { icon: User, label: 'Profile', page: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ icon: Icon, label, page }) => {
          const url = createPageUrl(page);
          const isActive = location.pathname === url || 
            (page === 'Home' && location.pathname === '/');
          
          return (
            <Link
              key={page}
              to={url}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full transition-all duration-200",
                isActive 
                  ? "text-violet-600" 
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 mb-1 transition-transform duration-200",
                  isActive && "scale-110"
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "font-semibold"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}