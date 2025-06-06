
import { useEffect, useState } from 'react';
import { Clock, User, MessageSquare, FileText, Stethoscope } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  type: 'consultation' | 'blog' | 'doctor' | 'user';
  title: string;
  description: string;
  time: string;
  status?: string;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const [consultations, blogPosts, doctors] = await Promise.all([
        supabase
          .from('consultation_requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(2),
        supabase
          .from('doctors')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(2)
      ]);

      const allActivities: Activity[] = [
        ...(consultations.data || []).map(item => ({
          id: item.id,
          type: 'consultation' as const,
          title: `درخواست مشاوره جدید`,
          description: `${item.name} درخواست مشاوره ارسال کرد`,
          time: new Date(item.created_at).toLocaleDateString('fa-IR'),
          status: item.status
        })),
        ...(blogPosts.data || []).map(item => ({
          id: item.id,
          type: 'blog' as const,
          title: `مقاله جدید`,
          description: item.title,
          time: new Date(item.created_at).toLocaleDateString('fa-IR'),
          status: item.is_published ? 'published' : 'draft'
        })),
        ...(doctors.data || []).map(item => ({
          id: item.id,
          type: 'doctor' as const,
          title: `پزشک جدید`,
          description: `${item.name} - ${item.specialty}`,
          time: new Date(item.created_at).toLocaleDateString('fa-IR'),
          status: item.is_active ? 'active' : 'inactive'
        }))
      ];

      setActivities(allActivities.slice(0, 8));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return MessageSquare;
      case 'blog':
        return FileText;
      case 'doctor':
        return Stethoscope;
      default:
        return User;
    }
  };

  const getStatusBadge = (type: string, status?: string) => {
    if (!status) return null;

    const variants: Record<string, any> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      published: 'default',
      draft: 'secondary',
      active: 'default',
      inactive: 'secondary'
    };

    const labels: Record<string, string> = {
      pending: 'در انتظار',
      approved: 'تایید شده',
      rejected: 'رد شده',
      published: 'منتشر شده',
      draft: 'پیش‌نویس',
      active: 'فعال',
      inactive: 'غیرفعال'
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>فعالیت‌های اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          فعالیت‌های اخیر
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              هیچ فعالیت اخیری یافت نشد
            </p>
          ) : (
            activities.map((activity) => {
              const Icon = getIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{activity.title}</p>
                      {getStatusBadge(activity.type, activity.status)}
                    </div>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
