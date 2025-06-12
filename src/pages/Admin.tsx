
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import AdminToolbox from '@/components/admin/AdminToolbox';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import NewAdminDashboard from '@/components/admin/NewAdminDashboard';
import UserRolesManager from '@/components/admin/UserRolesManager';
import DoctorsManager from '@/components/admin/DoctorsManager';
import ConsultationRequestsManager from '@/components/admin/ConsultationRequestsManager';
import BlogManager from '@/components/admin/BlogManager';
import AdminSettings from '@/components/admin/AdminSettings';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAdmin } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <NewAdminDashboard onTabChange={setActiveTab} />;
      case 'users':
        return <UserRolesManager />;
      case 'doctors':
        return <DoctorsManager />;
      case 'consultations':
        return <ConsultationRequestsManager />;
      case 'blog':
        return <BlogManager />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <NewAdminDashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <>
      <Header />
      
      <div className="bg-gray-50 min-h-screen">
        <AdminProtectedRoute>
          {/* Always show AdminToolbox - it will handle showing/hiding based on admin status */}
          <AdminToolbox />
          
          {isAdmin ? (
            <div className="flex h-screen bg-gray-50">
              <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
              
              <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                
                <main className="flex-1 overflow-auto p-6">
                  <div className="max-w-7xl mx-auto">
                    {renderContent()}
                  </div>
                </main>
              </div>
            </div>
          ) : (
            // If not admin, just show a message since AdminToolbox will handle the button
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">به پنل مدیریت خوش آمدید</h2>
                <p className="text-muted-foreground">
                  برای دسترسی به پنل مدیریت، از بخش بالا نقش ادمین را برای خود ایجاد کنید.
                </p>
              </div>
            </div>
          )}
        </AdminProtectedRoute>
      </div>

      <Footer />
    </>
  );
};

export default Admin;
