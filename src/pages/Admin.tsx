
import { Users, Stethoscope, MessageSquare, FileText, Shield, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import AdminToolbox from '@/components/admin/AdminToolbox';
import UserRolesManager from '@/components/admin/UserRolesManager';
import ConsultationRequestsManager from '@/components/admin/ConsultationRequestsManager';
import AdminDashboard from '@/components/admin/AdminDashboard';
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
                <DoctorsManagerSection />
              </TabsContent>

              <TabsContent value="consultations">
                <ConsultationRequestsManager />
              </TabsContent>

              <TabsContent value="content">
                <ContentManagerSection />
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        </div>
      </CardContent>
    </Card>
  );
};

const DoctorsManagerSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>مدیریت پزشکان</CardTitle>
        <CardDescription>
          اضافه کردن، ویرایش و حذف پزشکان
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            از این بخش می‌توانید پزشکان جدید اضافه کنید، اطلاعات آن‌ها را ویرایش کنید و پزشکان غیرفعال را حذف کنید.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">افزودن پزشک جدید</h3>
              <p className="text-sm text-muted-foreground mb-3">
                اطلاعات پزشک جدید را وارد کنید
              </p>
              <button className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
                افزودن پزشک
              </button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">لیست پزشکان</h3>
              <p className="text-sm text-muted-foreground mb-3">
                مشاهده و ویرایش پزشکان موجود
              </p>
              <button className="w-full bg-secondary text-foreground px-4 py-2 rounded hover:bg-secondary/80">
                مشاهده لیست
              </button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">تنظیمات تخصص‌ها</h3>
              <p className="text-sm text-muted-foreground mb-3">
                مدیریت تخصص‌های پزشکی
              </p>
              <button className="w-full bg-secondary text-foreground px-4 py-2 rounded hover:bg-secondary/80">
                تنظیمات
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ContentManagerSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>مدیریت محتوا</CardTitle>
        <CardDescription>
          مدیریت مقالات، اخبار و محتوای سایت
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            از این بخش می‌توانید مقالات وبلاگ، اخبار و سایر محتوای سایت را مدیریت کنید.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">مقالات وبلاگ</h3>
              <p className="text-sm text-muted-foreground mb-3">
                ایجاد و ویرایش مقالات آموزشی
              </p>
              <button className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
                مدیریت مقالات
              </button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">صفحات سایت</h3>
              <p className="text-sm text-muted-foreground mb-3">
                ویرایش محتوای صفحات اصلی
              </p>
              <button className="w-full bg-secondary text-foreground px-4 py-2 rounded hover:bg-secondary/80">
                ویرایش صفحات
              </button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">رسانه</h3>
              <p className="text-sm text-muted-foreground mb-3">
                مدیریت تصاویر و فایل‌ها
              </p>
              <button className="w-full bg-secondary text-foreground px-4 py-2 rounded hover:bg-secondary/80">
                کتابخانه رسانه
              </button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">سوالات متداول</h3>
              <p className="text-sm text-muted-foreground mb-3">
                مدیریت FAQ و راهنماها
              </p>
              <button className="w-full bg-secondary text-foreground px-4 py-2 rounded hover:bg-secondary/80">
                مدیریت FAQ
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Admin;
