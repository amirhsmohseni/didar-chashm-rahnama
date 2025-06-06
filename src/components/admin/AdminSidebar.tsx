
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  MessageSquare, 
  FileText, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { id: 'users', label: 'مدیریت کاربران', icon: Users },
    { id: 'doctors', label: 'مدیریت پزشکان', icon: Stethoscope },
    { id: 'consultations', label: 'درخواست مشاوره', icon: MessageSquare },
    { id: 'blog', label: 'مدیریت محتوا', icon: FileText },
    { id: 'settings', label: 'تنظیمات', icon: Settings },
  ];

  return (
    <div className={cn(
      "bg-white border-l border-gray-200 h-full transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="font-bold text-lg">پنل مدیریت</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10",
                collapsed ? "px-2" : "px-3"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
