
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container">
        {/* Top bar with contact info */}
        <div className="hidden md:flex justify-end items-center py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <a href="tel:+989123456789" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              <span>+98 912 345 6789</span>
            </a>
            <a href="mailto:info@eyecare.ir" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
              <span>info@eyecare.ir</span>
            </a>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">دیدار</span>
            <span className="font-medium ml-1">چشم رهنما</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="font-medium hover:text-primary transition-colors">خانه</Link>
            <Link to="/doctors" className="font-medium hover:text-primary transition-colors">پزشکان</Link>
            <Link to="/faq" className="font-medium hover:text-primary transition-colors">سوالات متداول</Link>
            <Link to="/blog" className="font-medium hover:text-primary transition-colors">بلاگ</Link>
            <Link to="/about" className="font-medium hover:text-primary transition-colors">درباره ما</Link>
            <Button asChild>
              <Link to="/consultation">درخواست مشاوره</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>خانه</Link>
              <Link to="/doctors" className="px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>پزشکان</Link>
              <Link to="/faq" className="px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>سوالات متداول</Link>
              <Link to="/blog" className="px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>بلاگ</Link>
              <Link to="/about" className="px-4 py-2 hover:bg-secondary rounded-md" onClick={() => setIsMenuOpen(false)}>درباره ما</Link>
              <div className="px-4">
                <Button className="w-full" asChild>
                  <Link to="/consultation" onClick={() => setIsMenuOpen(false)}>درخواست مشاوره</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
