
import { useState, useEffect } from 'react';
import { Users, Stethoscope, MessageSquare, FileText, TrendingUp, Calendar, Eye, CheckCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalConsultations: number;
  pendingConsultations: number;
  approvedConsultations: number;
  totalBlogPosts: number;
  recentConsultations: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalConsultations: 0,
    pendingConsultations: 0,
    approvedConsultations: 0,
    totalBlogPosts: 0,
    recentConsultations: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total doctors
      const { count: doctorsCount } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });

      // Get consultation stats
      const { count: consultationsCount } = await supabase
        .from('consultation_requests')
        .select('*', { count: 'exact', head: true });

      const { count: pendingCount } = await supabase
        .from('consultation_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: approvedCount } = await supabase
        .from('consultation_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Get blog posts count
      const { count: blogPostsCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      // Get recent consultations
      const { data: recentConsultations } = await supabase
        .from('consultation_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: usersCount || 0,
        totalDoctors: doctorsCount || 0,
        totalConsultations: consultationsCount || 0,
        pendingConsultations: pendingCount || 0,
        approvedConsultations: approvedCount || 0,
        totalBlogPosts: blogPostsCount || 0,
        recentConsultations: recentConsultations || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'در انتظار', variant: 'secondary' as const },
      approved: { label: 'تایید شده', variant: 'default' as const },
      rejected: { label: 'رد شده', variant: 'destructive' as const },
      completed: { label: 'تکمیل شده', variant: 'outline' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        در حال بارگذاری آمار...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل کاربران</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              کاربران ثبت‌نام شده
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">پزشکان</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDoctors}</div>
            <p className="text-xs text-muted-foreground">
              پزشکان فعال
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">درخواست‌های مشاوره</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConsultations}</div>
            <p className="text-xs text-muted-foreground">
              کل درخواست‌ها
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مقالات</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogPosts}</div>
            <p className="text-xs text-muted-foreground">
              مقالات منتشر شده
            </p>
          </CardContent>
        </Card>
      </div>

      {/* آمار درخواست‌های مشاوره */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">در انتظار بررسی</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingConsultations}</div>
            <p className="text-xs text-muted-foreground">
              نیاز به بررسی
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تایید شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedConsultations}</div>
            <p className="text-xs text-muted-foreground">
              مشاوره‌های تایید شده
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نرخ تایید</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalConsultations > 0 
                ? Math.round((stats.approvedConsultations / stats.totalConsultations) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              از کل درخواست‌ها
            </p>
          </CardContent>
        </Card>
      </div>

      {/* آخرین درخواست‌های مشاوره */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            آخرین درخواست‌های مشاوره
          </CardTitle>
          <CardDescription>
            جدیدترین درخواست‌های ثبت شده
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentConsultations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              هیچ درخواست مشاوره‌ای ثبت نشده است
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentConsultations.map((consultation) => (
                <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{consultation.name}</h3>
                    <p className="text-sm text-muted-foreground">{consultation.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(consultation.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(consultation.status)}
                    {consultation.medical_condition && (
                      <p className="text-xs text-muted-foreground max-w-xs truncate">
                        {consultation.medical_condition}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
