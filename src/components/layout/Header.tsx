import { useState, useCallback, memo } from 'react';
import { Menu, X, Shield, LogOut, User, ChevronDown } from 'lucide-react';
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

// Memoized Navigation Item Component for better performance
const NavigationItem = memo(({ name, href, onClick }: { name: string; href: string; onClick?: () => void }) => (
  <Link
    to={href}
    className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium text-sm sm:text-base px-3 py-2 rounded-md hover:bg-gray-50"
    onClick={onClick}
  >
    {name}
  </Link>
));

NavigationItem.displayName = 'NavigationItem';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const navigationItems = [
    { name: 'خانه', href: '/' },
    { name: 'خدمات', href: '/services' },
    { name: 'پزشکان', href: '/doctors' },
  ];

  const aboutMenuItems = [
    { name: 'درباره ما', href: '/about' },
  ];

  const contentMenuItems = [
    { name: 'وبلاگ', href: '/blog' },
    { name: 'سوالات متداول', href: '/faq' },
    { name: 'رسانه', href: '/media' },
  ];

  const loanMenuItems = [
    { name: 'شرایط دریافت وام', href: '/loan-conditions' },
    { name: 'محاسبه اقساط', href: '/loan-calculator' },
    { name: 'درخواست مشاوره', href: '/consultation' },
  ];

  const handleLogout = useCallback(async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      await supabase.auth.signOut();
      
      window.location.href = '/';
      
      toast({
        title: "خروج موفق",
        description: "شما با موفقیت و امن خارج شدید",
      });
    } catch (error) {
      console.error('Secure logout failed:', error);
      toast({
        title: "خطا در خروج",
        description: "خطا در خروج امن از حساب",
        variant: "destructive",
      });
    }
  }, [toast]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - در سمت راست */}
          <div className="flex items-center justify-end flex-1 order-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="font-bold text-lg sm:text-xl lg:text-2xl text-primary ml-2 group-hover:text-primary/80 transition-colors">
                چشم پزشکی
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary/80 transition-colors">
                <span className="text-white font-bold text-xs sm:text-sm">چ</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation with Submenus - چپ چین شده */}
          <div className="hidden lg:flex items-center order-2 flex-1 justify-start">
            <NavigationMenu>
              <NavigationMenuList className="space-x-4 xl:space-x-6">
                {/* Simple Navigation Items */}
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium text-sm sm:text-base px-3 py-2 rounded-md hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}

                {/* About Submenu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-primary font-medium">
                    درباره ما
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-48">
                      {aboutMenuItems.map((item) => (
                        <NavigationMenuLink asChild key={item.name}>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Content & Education Submenu - رسانه منتقل شده */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-primary font-medium">
                    محتوا و آموزش
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-48">
                      {contentMenuItems.map((item) => (
                        <NavigationMenuLink asChild key={item.name}>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Loan Section - جدید */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-primary font-medium">
                    دریافت وام
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-56">
                      {loanMenuItems.map((item) => (
                        <NavigationMenuLink asChild key={item.name}>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden order-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg"
              aria-label={isMenuOpen ? 'بستن منو' : 'باز کردن منو'}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
          </div>

          {/* Auth Section - فقط برای کاربران وارد شده */}
          {user && (
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 order-1 lg:order-3">
              <div className="flex items-center gap-1 sm:gap-2">
                <Link to="/admin">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm"
                  >
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline lg:inline">پنل مدیریت</span>
                    <span className="sm:hidden">پنل</span>
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 sm:gap-2 hover:bg-gray-50 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm"
                    >
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline lg:inline">حساب کاربری</span>
                      <span className="sm:hidden">حساب</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 sm:w-56 bg-white shadow-xl border border-gray-200">
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                        <Shield className="h-3 w-3" />
                        {isAdmin ? 'مدیر سیستم' : 'کاربر تست'}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="h-4 w-4" />
                        پنل مدیریت
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      خروج امن
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white/95 backdrop-blur-sm py-4 shadow-lg">
            <nav className="flex flex-col space-y-1">
              {/* Simple Items */}
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.name}
                  name={item.name}
                  href={item.href}
                  onClick={closeMenu}
                />
              ))}

              {/* About Section */}
              <div className="px-3 py-2">
                <div className="text-gray-500 text-xs font-semibold mb-2">درباره ما</div>
                {aboutMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-2 py-1 rounded-md hover:bg-gray-50 text-sm"
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Content Section - رسانه منتقل شده */}
              <div className="px-3 py-2">
                <div className="text-gray-500 text-xs font-semibold mb-2">محتوا و آموزش</div>
                {contentMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-2 py-1 rounded-md hover:bg-gray-50 text-sm"
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Loan Section - جدید */}
              <div className="px-3 py-2">
                <div className="text-gray-500 text-xs font-semibold mb-2">دریافت وام</div>
                {loanMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-2 py-1 rounded-md hover:bg-gray-50 text-sm"
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {user && (
                <Link
                  to="/admin"
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium px-3 py-2 flex items-center gap-2 justify-start hover:bg-blue-50 rounded-lg mx-2"
                  onClick={closeMenu}
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

export default memo(Header);
