
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, Calendar, MessageSquare, Users, Settings, FileText, Image } from 'lucide-react';

interface QuickActionCardsProps {
  onNavigate: (tab: string) => void;
}

const QuickActionCards = ({ onNavigate }: QuickActionCardsProps) => {
  const quickActions = [
    {
      title: 'مشاوره جدید',
      description: 'درخواست مشاوره جدید ثبت کنید',
      icon: Plus,
      action: () => onNavigate('consultations'),
      color: 'blue'
    },
    {
      title: 'مدیریت نوبت‌ها',
      description: 'برنامه‌ریزی و مدیریت نوبت‌ها',
      icon: Calendar,
      action: () => onNavigate('consultations'),
      color: 'green'
    },
    {
      title: 'پیام‌های جدید',
      description: 'مشاهده و پاسخ به پیام‌ها',
      icon: MessageSquare,
      action: () => onNavigate('consultations'),
      color: 'purple'
    },
    {
      title: 'مدیریت کاربران',
      description: 'مشاهده و مدیریت کاربران',
      icon: Users,
      action: () => onNavigate('users'),
      color: 'orange'
    },
    {
      title: 'تنظیمات سایت',
      description: 'ویرایش تنظیمات عمومی سایت',
      icon: Settings,
      action: () => onNavigate('site-settings'),
      color: 'red'
    },
    {
      title: 'مدیریت محتوا',
      description: 'ویرایش صفحات و محتوای سایت',
      icon: FileText,
      action: () => onNavigate('pages'),
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
      green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700',
      purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700',
      red: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700',
      indigo: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">عملیات سریع</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          const colorClasses = getColorClasses(action.color);
          
          return (
            <Card 
              key={index} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${colorClasses}`}
              onClick={action.action}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5" />
                  <CardTitle className="text-base font-medium">
                    {action.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-3">
                  {action.description}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-auto font-medium hover:bg-transparent"
                >
                  اجرا →
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionCards;
