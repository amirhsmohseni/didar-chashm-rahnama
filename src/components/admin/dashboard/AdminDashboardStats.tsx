
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, MessageSquare, Eye, TrendingUp, Clock } from 'lucide-react';

const AdminDashboardStats = () => {
  const stats = [
    {
      title: 'کل کاربران',
      value: '2,847',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'مشاوره‌های امروز',
      value: '18',
      change: '+5%',
      trend: 'up',
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'پیام‌های جدید',
      value: '34',
      change: '-2%',
      trend: 'down',
      icon: MessageSquare,
      color: 'purple'
    },
    {
      title: 'بازدید امروز',
      value: '1,245',
      change: '+8%',
      trend: 'up',
      icon: Eye,
      color: 'orange'
    },
    {
      title: 'درآمد ماهانه',
      value: '₹45,680',
      change: '+15%',
      trend: 'up',
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      title: 'زمان پاسخ متوسط',
      value: '2.4 ساعت',
      change: '-10%',
      trend: 'up',
      icon: Clock,
      color: 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600',
      green: 'bg-green-500 text-green-600',
      purple: 'bg-purple-500 text-purple-600',
      orange: 'bg-orange-500 text-orange-600',
      emerald: 'bg-emerald-500 text-emerald-600',
      red: 'bg-red-500 text-red-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        const colorClasses = getColorClasses(stat.color);
        const [bgColor, textColor] = colorClasses.split(' ');
        
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-opacity-10 ${bgColor.replace('bg-', 'bg-').replace('-500', '-100')}`}>
                <IconComponent className={`h-5 w-5 ${textColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    stat.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminDashboardStats;
