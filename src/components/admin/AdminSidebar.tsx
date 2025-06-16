
import { Home, Users, UserCheck, MessageSquare, FileText, Settings, Cog, Star, Briefcase, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const sidebarItems = [
    { id: 'dashboard', label: 'داشبورد', icon: Home },
    { id: 'users', label: 'مدیریت کاربران', icon: Users },
    { id: 'doctors', label: 'مدیریت پزشکان', icon: UserCheck },
    { id: 'services', label: 'مدیریت خدمات', icon: Briefcase },
    { id: 'consultations', label: 'درخواست‌های مشاوره', icon: MessageSquare },
    { id: 'reviews', label: 'نظرات بیماران', icon: Star },
    { id: 'faq', label: 'سوالات متداول', icon: MessageSquare },
    { id: 'media', label: 'مرکز رسانه', icon: FileText },
    { id: 'pages', label: 'مدیریت صفحات', icon: FileText },
    { id: 'blog', label: 'مدیریت بلاگ', icon: FileText },
    { id: 'header-settings', label: 'تنظیمات هدر', icon: Type },
    { id: 'site-settings', label: 'تنظیمات سایت', icon: Settings },
    { id: 'settings', label: 'تنظیمات سیستم', icon: Cog },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">پنل مدیریت</h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-right",
                  activeTab === item.id 
                    ? "bg-primary text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="ml-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
