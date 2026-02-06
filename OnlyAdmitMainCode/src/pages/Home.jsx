import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import Features from '@/components/home/Features';
import TrustBadges from '@/components/home/TrustBadges';
import BottomNav from '@/components/ui/BottomNav';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    if (user) {
      if (!user.account_type) {
        navigate(createPageUrl('RoleSelection'));
      } else if (user.account_type === 'college') {
        navigate(createPageUrl('CollegeDashboard'));
      }
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <HeroSection />
      <HowItWorks />
      <Features />
      <TrustBadges />
      <BottomNav />
    </div>
  );
}