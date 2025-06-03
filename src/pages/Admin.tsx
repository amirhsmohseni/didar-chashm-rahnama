
import { useState } from 'react';
import { Users, Stethoscope, MessageSquare, FileText, UserCheck } from 'lucide-react';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import UserRolesManager from '@/components/admin/UserRolesManager';
import DoctorsManager from '@/components/admin/DoctorsManager';
import ConsultationRequestsManager from '@/components/admin/ConsultationRequestsManager';
import BlogManager from '@/components/admin/BlogManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  return (
    <AdminProtectedRoute>
      <Header />
      
      <div className="bg-secondary min-h-screen">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">پنل مدیریت</h1>
            <p className="text-muted-foreground mt-2">
              مدیریت کلیه بخش‌های سایت از این قسمت
            </p>
          </div>

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                <span className="hidden sm:inline">نقش‌های کاربری</span>
              </TabsTrigger>
              <TabsTrigger value="doctors" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">پزشکان</span>
              </TabsTrigger>
              <TabsTrigger value="consultations" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">درخواست‌ها</span>
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
        </div>
      </div>

      <Footer />
    </AdminProtectedRoute>
  );
};

export default Admin;
