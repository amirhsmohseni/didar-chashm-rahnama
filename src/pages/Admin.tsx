
import { Users, Stethoscope, MessageSquare, FileText, UserCheck, Shield } from 'lucide-react';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import UserRolesManager from '@/components/admin/UserRolesManager';
import DoctorsManager from '@/components/admin/DoctorsManager';
import ConsultationRequestsManager from '@/components/admin/ConsultationRequestsManager';
import BlogManager from '@/components/admin/BlogManager';
import UserDebugInfo from '@/components/admin/UserDebugInfo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';

const Admin = () => {
  return (
    <>
      <Header />
      
      <div className="bg-secondary min-h-screen">
        <div className="container py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">پنل مدیریت</h1>
            </div>
            <p className="text-muted-foreground">
              مدیریت کلیه بخش‌های سایت از این قسمت
            </p>
          </div>

          {/* اطلاعات دیباگ کاربر - برای تست دسترسی */}
          <UserDebugInfo />

          <AdminProtectedRoute>
            <AdminWelcome />
            
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">نقش‌های کاربری</span>
                  <span className="sm:hidden">کاربران</span>
                </TabsTrigger>
                <TabsTrigger value="doctors" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  <span className="hidden sm:inline">پزشکان</span>
                </TabsTrigger>
                <TabsTrigger value="consultations" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">درخواست‌ها</span>
                  <span className="sm:hidden">مشاوره</span>
                </TabsTrigger>
                <TabsTrigger value="blog" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">مقالات</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <UserRolesManager />
              </TabsContent>

              <TabsContent value="doctors">
                <DoctorsManager />
              </TabsContent>

              <TabsContent value="consultations">
                <ConsultationRequestsManager />
              </TabsContent>

              <TabsContent value="blog">
                <BlogManager />
              </TabsContent>
            </Tabs>
          </AdminProtectedRoute>
        </div>
      </div>

      <Footer />
    </>
  );
};

const AdminWelcome = () => {
  const { user } = useAuth();
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          خوش آمدید به پنل مدیریت
        </CardTitle>
        <CardDescription>
          شما با حساب {user?.email} وارد شده‌اید و دسترسی مدیر دارید.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background rounded-lg border">
            <UserCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">مدیریت کاربران</p>
            <p className="text-xs text-muted-foreground mt-1">نقش‌های کاربری</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <Stethoscope className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">مدیریت پزشکان</p>
            <p className="text-xs text-muted-foreground mt-1">افزودن و ویرایش</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">درخواست‌های مشاوره</p>
            <p className="text-xs text-muted-foreground mt-1">مدیریت درخواست‌ها</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">مدیریت مقالات</p>
            <p className="text-xs text-muted-foreground mt-1">نوشتن و انتشار</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Admin;
