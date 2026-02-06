import { Toaster } from 'sonner';

export default function Layout({ children, currentPageName }) {
  const isCollegePage = currentPageName && (
    currentPageName.startsWith('College') || 
    currentPageName === 'ManageExamSlots' ||
    currentPageName === 'RoleSelection'
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <style>{`
        :root {
          --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }
      `}</style>
      
      <main className={isCollegePage ? 'bg-white min-h-screen' : 'max-w-lg mx-auto bg-white min-h-screen shadow-sm'}>
        {children}
      </main>
      
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'rounded-xl',
        }}
      />
    </div>
  );
}