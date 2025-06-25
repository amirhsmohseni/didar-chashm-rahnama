
import { useState } from 'react';
import { Menu, X, Shield, LogOut, User } from 'lucide-react';
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
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation - positioned on the left */}
          <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button - positioned on the left for mobile */}
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

          {/* Logo - positioned on the right */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-primary ml-2">چشم پزشکی</span>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">چ</span>
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
                    <Button variant="outline" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">حساب کاربری</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white">
                    <div className="p-2">
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                        <Shield className="h-3 w-3" />
                        {isAdmin ? 'مدیر سیستم' : 'کاربر (حالت تست)'}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        پنل مدیریت
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      خروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default">ورود / ثبت نام</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white py-4">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-4 py-2 text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <Link
                  to="/admin"
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium px-4 py-2 flex items-center gap-2 justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  <span>پنل مدیریت</span>
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
