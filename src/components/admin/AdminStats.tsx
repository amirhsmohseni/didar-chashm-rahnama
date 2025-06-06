
import { useEffect, useState } from 'react';
import { Users, Stethoscope, MessageSquare, FileText, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsData {
  totalUsers: number;
  totalDoctors: number;
  totalConsultations: number;
  totalBlogPosts: number;
  pendingConsultations: number;
  thisMonthConsultations: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalDoctors: 0,
    totalConsultations: 0,
    totalBlogPosts: 0,
    pendingConsultations: 0,
    thisMonthConsultations: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { count: usersCount },
        { count: doctorsCount },
        { count: consultationsCount },
        { count: blogPostsCount },
        { count: pendingCount },
        { count: thisMonthCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('doctors').select('*', { count: 'exact', head: true }),
        supabase.from('consultation_requests').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('consultation_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('consultation_requests').select('*', { count: 'exact', head: true }).gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);

      setStats({
        totalUsers: usersCount || 0,
        totalDoctors: doctorsCount || 0,
        totalConsultations: consultationsCount || 0,
        totalBlogPosts: blogPostsCount || 0,
        pendingConsultations: pendingCount || 0,
        thisMonthConsultations: thisMonthCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'کل کاربران',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'پزشکان فعال',
      value: stats.totalDoctors,
      icon: Stethoscope,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'درخواست‌های مشاوره',
      value: stats.totalConsultations,
      icon: MessageSquare,
      color: 'bg-yellow-500',
      change: '+8%'
    },
    {
      title: 'مقالات منتشر شده',
      value: stats.totalBlogPosts,
      icon: FileText,
      color: 'bg-purple-500',
      change: '+3%'
    },
    {
      title: 'در انتظار بررسی',
      value: stats.pendingConsultations,
      icon: Calendar,
      color: 'bg-orange-500',
      change: '-2%'
    },
    {
      title: 'این ماه',
      value: stats.thisMonthConsultations,
      icon: TrendingUp,
      color: 'bg-red-500',
      change: '+15%'
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} از ماه گذشته
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStats;
