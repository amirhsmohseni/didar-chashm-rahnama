
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import AdminToolbox from '@/components/admin/AdminToolbox';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import NewAdminDashboard from '@/components/admin/NewAdminDashboard';
import UserRolesManager from '@/components/admin/UserRolesManager';
import DoctorsManager from '@/components/admin/DoctorsManager';
import EnhancedServicesManager from '@/components/admin/EnhancedServicesManager';
import ConsultationRequestsManager from '@/components/admin/ConsultationRequestsManager';
import PatientReviewsManager from '@/components/admin/PatientReviewsManager';
import FaqManager from '@/components/admin/FaqManager';
import MediaCenterManager from '@/components/admin/MediaCenterManager';
import PagesManager from '@/components/admin/PagesManager';
import BlogManager from '@/components/admin/BlogManager';
import HeaderSettingsManager from '@/components/admin/HeaderSettingsManager';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';
import AdminSettings from '@/components/admin/AdminSettings';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isAdmin } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <NewAdminDashboard onTabChange={setActiveTab} />;
      case 'users':
        return <UserRolesManager />;
      case 'doctors':
        return <DoctorsManager />;
      case 'services':
        return <EnhancedServicesManager />;
      case 'consultations':
        return <ConsultationRequestsManager />;
      case 'reviews':
        return <PatientReviewsManager />;
      case 'faq':
        return <FaqManager />;
      case 'media':
        return <MediaCenterManager />;
      case 'pages':
        return <PagesManager />;
      case 'blog':
        return <BlogManager />;
      case 'header-settings':
        return <HeaderSettingsManager />;
      case 'site-settings':
        return <SiteSettingsManager />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <NewAdminDashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <AdminProtectedRoute>
        <AdminToolbox />
        
        {isAdmin ? (
          <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            )}
            
            {/* Sidebar */}
            <div className={`
              fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
              transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0 transition-transform duration-300 ease-in-out
              w-72 lg:w-80 flex-shrink-0
            `}>
              <AdminSidebar 
                activeTab={activeTab} 
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setIsMobileSidebarOpen(false);
                }} 
              />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
              {/* Admin Header */}
              <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                  {/* Mobile Menu Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                  >
                    {isMobileSidebarOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </Button>
                  
                  <div className="flex-1 lg:flex-none">
                    <AdminHeader />
                  </div>
                </div>
              </div>
              
              {/* Content Area */}
              <main className="flex-1 p-4 lg:p-6 pb-20">
                <div className="max-w-7xl mx-auto">
                  {renderContent()}
                </div>
              </main>
            </div>
          </div>
        ) : null}
      </AdminProtectedRoute>
      
      {/* Footer with proper spacing */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Admin;
