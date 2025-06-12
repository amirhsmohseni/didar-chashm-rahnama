
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/media" element={<MediaCenter />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
