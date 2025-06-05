
import { Users, Stethoscope, MessageSquare, FileText, Shield, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import AdminToolbox from '@/components/admin/AdminToolbox';
import UserRolesManager from '@/components/admin/UserRolesManager';
import ConsultationRequestsManager from '@/components/admin/ConsultationRequestsManager';
import AdminDashboard from '@/components/admin/AdminDashboard';
import DoctorsManager from '@/components/admin/DoctorsManager';
import BlogManager from '@/components/admin/BlogManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

          <AdminToolbox />

          <AdminProtectedRoute>
            <AdminWelcome />
            
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">داشبورد</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">کاربران</span>
                </TabsTrigger>
                <TabsTrigger value="doctors" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  <span className="hidden sm:inline">پزشکان</span>
                </TabsTrigger>
                <TabsTrigger value="consultations" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">مشاوره‌ها</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">محتوا</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <AdminDashboard />
              </TabsContent>

              <TabsContent value="users">
                <UserRolesManager />
              </TabsContent>

              <TabsContent value="doctors">
                <DoctorsManager />
              </TabsContent>

              <TabsContent value="consultations">
                <ConsultationRequestsManager />
              </TabsContent>

              <TabsContent value="content">
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
          <Shield className="h-5 w-5" />
          خوش آمدید به پنل مدیریت
        </CardTitle>
        <CardDescription>
          شما با حساب {user?.email} وارد شده‌اید و دسترسی مدیر دارید.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-background rounded-lg border">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">داشبورد آمار</p>
            <p className="text-xs text-muted-foreground mt-1">نمای کلی</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">مدیریت کاربران</p>
            <p className="text-xs text-muted-foreground mt-1">نقش‌ها و دسترسی‌ها</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <Stethoscope className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">مدیریت پزشکان</p>
            <p className="text-xs text-muted-foreground mt-1">افزودن و ویرایش</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">درخواست‌های مشاوره</p>
            <p className="text-xs text-muted-foreground mt-1">بررسی و پاسخ</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">مدیریت محتوا</p>
            <p className="text-xs text-muted-foreground mt-1">مقالات و اخبار</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Admin;
