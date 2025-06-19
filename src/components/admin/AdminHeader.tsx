
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Settings, User, Bell, Shield, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationCenter from './NotificationCenter';

const AdminHeader = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900 flex items-center gap-2 truncate">
            <Shield className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 flex-shrink-0" />
            <span className="hidden sm:inline">پنل مدیریت</span>
            <span className="sm:hidden">پنل</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Activity className="h-3 w-3 lg:h-4 lg:w-4 text-green-500 flex-shrink-0" />
            <p className="text-xs lg:text-sm text-gray-500 truncate">
              <span className="hidden lg:inline">
                {new Date().toLocaleDateString('fa-IR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="lg:hidden">
                {new Date().toLocaleDateString('fa-IR')}
              </span>
            </p>
            <Badge variant="outline" className="text-green-600 border-green-200 text-xs flex-shrink-0">
              آنلاین
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
        {/* Notifications */}
        <div className="relative">
          <NotificationCenter />
        </div>
        
        {/* Admin Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 lg:gap-3 hover:bg-gray-50 px-2 lg:px-3 py-2 rounded-lg">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                  {user?.email || 'مدیر'}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  مدیر سیستم
                </p>
              </div>
              <Avatar className="h-8 w-8 lg:h-10 lg:w-10 border-2 border-blue-200 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold text-sm lg:text-base">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 lg:w-64 p-2">
            <div className="px-2 py-2 border-b border-gray-100 mb-2">
              <p className="font-medium text-gray-900 truncate">{user?.email}</p>
              <p className="text-sm text-gray-500">دسترسی کامل مدیریت</p>
            </div>
            
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer">
              <User className="h-4 w-4" />
              پروفایل کاربری
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer">
              <Settings className="h-4 w-4" />
              تنظیمات حساب
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer">
              <Bell className="h-4 w-4" />
              اعلان‌ها
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem 
              onClick={handleSignOut} 
              className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              خروج از حساب
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AdminHeader;
