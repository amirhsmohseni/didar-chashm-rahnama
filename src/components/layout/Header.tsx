
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'صفحه اصلی', path: '/' },
    { name: 'خدمات', path: '/services' },
    { name: 'پزشکان', path: '/doctors' },
    { name: 'درباره ما', path: '/about' },
    { name: 'مرکز رسانه', path: '/media' },
    { name: 'وبلاگ', path: '/blog' },
    { name: 'سوالات متداول', path: '/faq' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md">
      {/* Top bar with contact info */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6 space-x-reverse">
              <div className="flex items-center gap-2 hover:text-emerald-200 transition-colors">
                <Phone className="h-4 w-4" />
                <span>021-12345678</span>
              </div>
              <div className="flex items-center gap-2 hover:text-emerald-200 transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@clinic.com</span>
              </div>
              <div className="flex items-center gap-2 hover:text-emerald-200 transition-colors">
                <MapPin className="h-4 w-4" />
                <span>تهران، خیابان ولیعصر</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-slate-900/95 backdrop-blur-lg border-b border-emerald-500/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 space-x-reverse group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-400/50 transition-all duration-300 group-hover:scale-110">
                <Eye className="text-white h-6 w-6" />
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  دیدار چشم رهنما
                </span>
                <div className="text-xs text-emerald-400 font-medium">مشاوره تخصصی چشم پزشکی</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative py-2 px-1 transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-emerald-400 font-semibold'
                      : 'text-gray-300 hover:text-emerald-300'
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
              <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
                <Link to="/consultation">درخواست مشاوره</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:text-emerald-300 hover:bg-emerald-500/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-6 border-t border-emerald-500/20">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                        : 'text-gray-300 hover:text-emerald-300 hover:bg-emerald-500/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white mt-6 rounded-xl">
                  <Link to="/consultation" onClick={() => setIsMenuOpen(false)}>
                    درخواست مشاوره
                  </Link>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
