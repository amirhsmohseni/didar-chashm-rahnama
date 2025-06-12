
import { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, Activity } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsData {
  consultationTrends: Array<{ date: string; count: number; }>;
  blogViews: Array<{ date: string; views: number; }>;
  statusDistribution: Array<{ name: string; value: number; color: string; }>;
  monthlyStats: Array<{ month: string; consultations: number; blogs: number; }>;
}

const AdvancedAnalytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    consultationTrends: [],
    blogViews: [],
    statusDistribution: [],
    monthlyStats: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch consultation trends
      const { data: consultations } = await supabase
        .from('consultation_requests')
        .select('created_at, status')
        .gte('created_at', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString());

      // Fetch blog views
      const { data: blogs } = await supabase
        .from('blog_posts')
        .select('published_at, views_count')
        .eq('is_published', true)
        .gte('published_at', new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000).toISOString());

      // Process consultation trends
      const consultationTrends = processTimeSeriesData(consultations || [], 'created_at');
      
      // Process blog views
      const blogViews = processViewsData(blogs || []);
      
      // Status distribution
      const statusCounts = (consultations || []).reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
        name: getStatusLabel(status),
        value: count,
        color: getStatusColor(status),
      }));

      // Monthly stats
      const monthlyStats = processMonthlyStats(consultations || [], blogs || []);

      setData({
        consultationTrends,
        blogViews,
        statusDistribution,
        monthlyStats,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processTimeSeriesData = (data: any[], dateField: string) => {
    const groupedData = data.reduce((acc, item) => {
      const date = new Date(item[dateField]).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groupedData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const processViewsData = (blogs: any[]) => {
    return blogs.map(blog => ({
      date: blog.published_at,
      views: blog.views_count || 0,
    })).sort((a, b) => a.date.localeCompare(b.date));
  };

  const processMonthlyStats = (consultations: any[], blogs: any[]) => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toISOString().substr(0, 7);
    }).reverse();

    return months.map(month => {
      const consultationCount = consultations.filter(c => 
        c.created_at.startsWith(month)
      ).length;
      
      const blogCount = blogs.filter(b => 
        b.published_at && b.published_at.startsWith(month)
      ).length;

      return {
        month: new Date(month).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short' }),
        consultations: consultationCount,
        blogs: blogCount,
      };
    });
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'در انتظار',
      approved: 'تایید شده',
      rejected: 'رد شده',
      completed: 'تکمیل شده',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: '#f59e0b',
      approved: '#10b981',
      rejected: '#ef4444',
      completed: '#6366f1',
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">آنالیتیکس پیشرفته</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="7">7 روز گذشته</option>
          <option value="30">30 روز گذشته</option>
          <option value="90">90 روز گذشته</option>
        </select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نمای کلی</TabsTrigger>
          <TabsTrigger value="consultations">مشاوره‌ها</TabsTrigger>
          <TabsTrigger value="blog">مقالات</TabsTrigger>
          <TabsTrigger value="trends">روندها</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  آمار ماهانه
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="consultations" fill="#3b82f6" name="مشاوره‌ها" />
                    <Bar dataKey="blogs" fill="#10b981" name="مقالات" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  توزیع وضعیت درخواست‌ها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consultations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                روند درخواست‌های مشاوره
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data.consultationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    name="تعداد درخواست"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>بازدید مقالات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.blogViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="بازدید"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>مقایسه عملکرد</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="consultations"
                      stroke="#3b82f6"
                      name="مشاوره‌ها"
                    />
                    <Line
                      type="monotone"
                      dataKey="blogs"
                      stroke="#10b981"
                      name="مقالات"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>آمار کلی</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">کل درخواست‌های مشاوره</span>
                  <span className="text-lg font-bold text-blue-600">
                    {data.consultationTrends.reduce((sum, item) => sum + item.count, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">کل بازدید مقالات</span>
                  <span className="text-lg font-bold text-green-600">
                    {data.blogViews.reduce((sum, item) => sum + item.views, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium">متوسط درخواست روزانه</span>
                  <span className="text-lg font-bold text-yellow-600">
                    {Math.round(data.consultationTrends.reduce((sum, item) => sum + item.count, 0) / Math.max(data.consultationTrends.length, 1))}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
