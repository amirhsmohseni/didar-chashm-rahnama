
import { useState } from 'react';
import { Menu, X, Shield, LogOut, User, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log('Header: User data:', { 
    user: user?.email || 'No user', 
    isAdmin,
    userExists: !!user
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "خروج موفق",
        description: "شما با موفقیت خارج شدید",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در خروج از حساب",
        variant: "destructive",
      });
    }
  };

  const navigationItems = [
    { name: 'خانه', href: '/' },
    { name: 'خدمات', href: '/services' },
    { name: 'پزشکان', href: '/doctors' },
    { name: 'مشاوره', href: '/consultation' },
    { name: 'درباره ما', href: '/about' },
    { name: 'وبلاگ', href: '/blog' },
    { name: 'سوالات متداول', href: '/faq' },
    { name: 'رسانه', href: '/media' },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 backdrop-blur-md bg-white/95">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Phone className="h-4 w-4" />
                <span>021-12345678</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Shield className="h-4 w-4" />
                <span>مرکز معتبر چشم‌پزشکی</span>
              </div>
            </div>
            <div className="text-sm opacity-90">
              ساعات کاری: شنبه تا چهارشنبه ۸:۰۰ - ۲۰:۰۰
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-base relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mr-0"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">چ</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-xl text-gray-900">دیدار چشم رهنما</div>
                <div className="text-xs text-gray-500">مرکز تخصصی چشم‌پزشکی</div>
              </div>
            </Link>
          </div>

          {/* Right side - Auth section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Admin Panel Button */}
                <Link to="/admin">
                  <Button variant="outline" className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">پنل مدیریت</span>
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-50">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">حساب کاربری</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl border border-gray-200">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                        <Shield className="h-3 w-3" />
                        {isAdmin ? 'مدیر سیستم' : 'کاربر (حالت تست)'}
                      </p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 px-3 py-2">
                        <Shield className="h-4 w-4" />
                        پنل مدیریت
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <LogOut className="h-4 w-4" />
                      خروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/consultation">
                  <Button variant="outline" className="hidden sm:flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Phone className="h-4 w-4" />
                    مشاوره رایگان
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-blue-600 hover:bg-blue-700">ورود / ثبت نام</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white py-4 shadow-lg rounded-b-lg">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium px-4 py-3 rounded-lg text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <Link
                  to="/admin"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200 font-medium px-4 py-3 flex items-center gap-2 justify-start rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  <span>پنل مدیریت</span>
                </Link>
              )}
              {!user && (
                <Link
                  to="/consultation"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200 font-medium px-4 py-3 flex items-center gap-2 justify-start rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone className="h-4 w-4" />
                  <span>مشاوره رایگان</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
