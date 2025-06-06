
import { Plus, Upload, Download, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickActionsProps {
  onTabChange: (tab: string) => void;
}

const QuickActions = ({ onTabChange }: QuickActionsProps) => {
  const actions = [
    {
      title: 'افزودن پزشک جدید',
      description: 'پزشک جدید به سیستم اضافه کنید',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => onTabChange('doctors')
    },
    {
      title: 'ایجاد محتوا جدید',
      description: 'مقاله یا خبر جدید منتشر کنید',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => onTabChange('blog')
    },
    {
      title: 'مدیریت کاربران',
      description: 'نقش‌ها و دسترسی‌ها را تنظیم کنید',
      icon: Settings,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => onTabChange('users')
    },
    {
      title: 'بررسی درخواست‌ها',
      description: 'درخواست‌های مشاوره را بررسی کنید',
      icon: RefreshCw,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => onTabChange('consultations')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>اقدامات سریع</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all"
                onClick={action.onClick}
              >
                <div className={`${action.color} p-3 rounded-full transition-colors`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
