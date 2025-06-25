
import { 
  Home, Users, UserCheck, MessageSquare, FileText, Settings, Cog, 
  Star, Briefcase, Type, BarChart3, Bell, Shield, X, Menu, Palette 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);
  const { user } = useAuth();

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
      id: 'content',
      title: 'مدیریت محتوا',
      icon: FileText,
      items: [
        { id: 'header-manager', title: 'مدیریت هدر', icon: Menu, description: 'ویرایش منوی ناوبری' },
        { id: 'service-icons', title: 'آیکون‌های خدمات', icon: Palette, description: 'مدیریت آیکون‌ها' },
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
    <div className="h-full bg-gradient-to-b from-slate-50 to-white shadow-2xl border-r border-gray-200 overflow-y-auto">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg flex-shrink-0">
            <Shield className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 truncate">پنل مدیریت</h2>
            <p className="text-xs lg:text-sm text-gray-500 truncate">مدیریت کامل سایت</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-6">
          {sidebarSections.map((section, sectionIndex) => (
            <div key={section.title}>
              {sectionIndex > 0 && <Separator className="my-4" />}
              
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
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
                          "w-full justify-start text-right h-10 lg:h-11 px-3 lg:px-4 transition-all duration-200 text-sm lg:text-base",
                          isActive 
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        )}
                        onClick={() => onTabChange(item.id)}
                      >
                        <Icon className={cn(
                          "ml-2 lg:ml-3 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0",
                          isActive ? "text-white" : "text-gray-400"
                        )} />
                        <span className="flex-1 text-right truncate">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant={isActive ? "secondary" : "outline"} 
                            className={cn(
                              "text-xs mr-1 lg:mr-2 flex-shrink-0",
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

        {/* Footer Stats */}
        <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <BarChart3 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">آمار کلی سیستم</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="truncate">کاربران فعال:</span>
              <span className="font-semibold flex-shrink-0">۲۳۴</span>
            </div>
            <div className="flex justify-between">
              <span className="truncate">پزشکان:</span>
              <span className="font-semibold flex-shrink-0">۱۲</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
