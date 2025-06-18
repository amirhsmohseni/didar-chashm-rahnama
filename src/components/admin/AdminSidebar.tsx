
import { 
  Home, Users, UserCheck, MessageSquare, FileText, Settings, Cog, 
  Star, Briefcase, Type, BarChart3, Bell, Shield 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const sidebarSections = [
    {
      title: 'داشبورد',
      items: [
        { id: 'dashboard', label: 'نمای کلی', icon: Home, badge: null },
      ]
    },
    {
      title: 'مدیریت کاربران',
      items: [
        { id: 'users', label: 'کاربران', icon: Users, badge: null },
        { id: 'doctors', label: 'پزشکان', icon: UserCheck, badge: 'جدید' },
      ]
    },
    {
      title: 'محتوا و خدمات',
      items: [
        { id: 'services', label: 'خدمات', icon: Briefcase, badge: null },
        { id: 'consultations', label: 'درخواست‌های مشاوره', icon: MessageSquare, badge: null },
        { id: 'reviews', label: 'نظرات بیماران', icon: Star, badge: null },
        { id: 'faq', label: 'سوالات متداول', icon: MessageSquare, badge: null },
      ]
    },
    {
      title: 'مدیریت محتوا',
      items: [
        { id: 'media', label: 'مرکز رسانه', icon: FileText, badge: null },
        { id: 'pages', label: 'صفحات', icon: FileText, badge: null },
        { id: 'blog', label: 'بلاگ', icon: FileText, badge: null },
      ]
    },
    {
      title: 'تنظیمات',
      items: [
        { id: 'header-settings', label: 'تنظیمات هدر', icon: Type, badge: 'بهبود یافته' },
        { id: 'site-settings', label: 'تنظیمات سایت', icon: Settings, badge: null },
        { id: 'settings', label: 'تنظیمات سیستم', icon: Cog, badge: null },
      ]
    }
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-slate-50 to-white shadow-xl border-r">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">پنل مدیریت</h2>
            <p className="text-sm text-gray-500">مدیریت کامل سایت</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-6">
          {sidebarSections.map((section, sectionIndex) => (
            <div key={section.title}>
              {sectionIndex > 0 && <Separator className="my-4" />}
              
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start text-right h-11 px-4 transition-all duration-200",
                          isActive 
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        )}
                        onClick={() => onTabChange(item.id)}
                      >
                        <Icon className={cn(
                          "ml-3 h-5 w-5",
                          isActive ? "text-white" : "text-gray-400"
                        )} />
                        <span className="flex-1 text-right">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant={isActive ? "secondary" : "outline"} 
                            className={cn(
                              "text-xs mr-2",
                              isActive ? "bg-white/20 text-white" : "text-blue-600"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BarChart3 className="h-4 w-4" />
            <span>آمار کلی سیستم</span>
          </div>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>کاربران فعال:</span>
              <span className="font-semibold">۲۳۴</span>
            </div>
            <div className="flex justify-between">
              <span>پزشکان:</span>
              <span className="font-semibold">۱۲</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
