import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import AdminLogin from '@/pages/AdminLogin';
import AdminAccess from '@/pages/AdminAccess';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Doctors from '@/pages/Doctors';
import Consultation from '@/pages/Consultation';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import MediaCenter from '@/pages/MediaCenter';
import Faq from '@/pages/Faq';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import ServiceDetail from '@/pages/ServiceDetail';
import LoanConditions from '@/pages/LoanConditions';
import LoanCalculator from '@/pages/LoanCalculator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-access" element={<AdminAccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/media" element={<MediaCenter />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/loan-conditions" element={<LoanConditions />} />
              <Route path="/loan-calculator" element={<LoanCalculator />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
