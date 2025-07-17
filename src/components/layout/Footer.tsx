
import { Link } from 'react-router-dom';
import { Phone, Mail, Home, Info, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-eyecare-800 text-white">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              درباره دیدار
            </h3>
            <p className="text-gray-300 mb-4">
              دیدار چشم رهنما، مشاوره حرفه‌ای و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ارائه می‌دهد.
            </p>
            <p className="text-gray-300">
              ما به شما کمک می‌کنیم بهترین تصمیم را برای سلامت چشمانتان بگیرید.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">لینک‌های سریع</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-primary transition-colors">پزشکان متخصص</Link>
              </li>
              <li>
                <Link to="/consultation" className="hover:text-primary transition-colors">درخواست مشاوره رایگان</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">مقالات آموزشی</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">سوالات متداول</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">درباره ما</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              تماس با ما
            </h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-400">شماره تماس:</p>
                  <a href="tel:+989123456789" className="hover:text-primary transition-colors" dir="ltr">
                    +98 912 345 6789
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-400">ایمیل:</p>
                  <a href="mailto:info@eyecare.ir" className="hover:text-primary transition-colors">info@eyecare.ir</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} دیدار چشم رهنما. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
