
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MessageSquare, User, Settings, FileText } from 'lucide-react';

const RecentActivityList = () => {
  const activities = [
    {
      id: 1,
      type: 'consultation',
      title: 'درخواست مشاوره جدید',
      description: 'احمد محمدی درخواست مشاوره برای جراحی لیزیک ثبت کرد',
      time: '5 دقیقه پیش',
      icon: Calendar,
      color: 'blue',
      user: 'احمد محمدی'
    },
    {
      id: 2,
      type: 'message',
      title: 'پیام جدید',
      description: 'مریم احمدی سوالی درباره هزینه جراحی پرسیده',
      time: '12 دقیقه پیش',
      icon: MessageSquare,
      color: 'green',
      user: 'مریم احمدی'
    },
    {
      id: 3,
      type: 'user',
      title: 'کاربر جدید',
      description: 'علی رضایی در سایت ثبت‌نام کرد',
      time: '25 دقیقه پیش',
      icon: User,
      color: 'purple',
      user: 'علی رضایی'
    },
    {
      id: 4,
      type: 'system',
      title: 'تغییر تنظیمات',
      description: 'تنظیمات سایت بروزرسانی شد',
      time: '1 ساعت پیش',
      icon: Settings,
      color: 'orange',
      user: 'ادمین'
    },
    {
      id: 5,
      type: 'content',
      title: 'محتوای جدید',
      description: 'مقاله جدید درباره جراحی آب مروارید منتشر شد',
      time: '2 ساعت پیش',
      icon: FileText,
      color: 'indigo',
      user: 'نویسنده'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBadgeVariant = (type: string): "default" | "destructive" | "outline" | "secondary" => {
    const variants = {
      consultation: "default" as const,
      message: "secondary" as const,
      user: "outline" as const,
      system: "destructive" as const,
      content: "default" as const
    };
    return variants[type as keyof typeof variants] || "default";
  };

  return (
    <Card className="shadow-md border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          فعالیت‌های اخیر
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          const colorClasses = getColorClasses(activity.color);
          
          return (
            <div key={activity.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`p-2 rounded-lg ${colorClasses}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {activity.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">{activity.user}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getBadgeVariant(activity.type)} className="text-xs">
                      {activity.type === 'consultation' && 'مشاوره'}
                      {activity.type === 'message' && 'پیام'}
                      {activity.type === 'user' && 'کاربر'}
                      {activity.type === 'system' && 'سیستم'}
                      {activity.type === 'content' && 'محتوا'}
                    </Badge>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="text-center pt-2">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            مشاهده همه فعالیت‌ها →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityList;
