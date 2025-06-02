
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Users, MessageSquare, Edit, FileText } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DoctorsManager from '@/components/admin/DoctorsManager';
import ConsultationRequestsManager from '@/components/admin/ConsultationRequestsManager';
import BlogManager from '@/components/admin/BlogManager';

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Get user profile
      const { data: profileData, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error || !profileData || (profileData as any).role !== 'admin') {
        toast({
          title: "دسترسی محدود",
          description: "شما دسترسی به پنل مدیریت ندارید",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "خروج موفق",
        description: "با موفقیت خارج شدید",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در خروج پیش آمد",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container py-8">
          <div className="text-center">در حال بارگذاری...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="bg-secondary">
        <div className="container py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">پنل مدیریت</h1>
              <p className="text-muted-foreground">
                خوش آمدید، {profile?.full_name}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="ml-2 h-4 w-4" />
              خروج
            </Button>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <Tabs defaultValue="doctors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="doctors">
                <Users className="ml-2 h-4 w-4" />
                مدیریت پزشکان
              </TabsTrigger>
              <TabsTrigger value="requests">
                <MessageSquare className="ml-2 h-4 w-4" />
                درخواست‌های مشاوره
              </TabsTrigger>
              <TabsTrigger value="blog">
                <FileText className="ml-2 h-4 w-4" />
                مدیریت مقالات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="doctors" className="mt-6">
              <DoctorsManager />
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              <ConsultationRequestsManager />
            </TabsContent>

            <TabsContent value="blog" className="mt-6">
              <BlogManager />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Admin;
