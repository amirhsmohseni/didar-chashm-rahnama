
import { Link } from 'react-router-dom';
import { Phone, Mail, Home, Info, MessageSquare, Eye, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Eye className="text-white h-6 w-6" />
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  دیدار چشم رهنما
                </span>
                <div className="text-sm text-emerald-400 font-medium">مشاوره تخصصی چشم پزشکی</div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              دیدار چشم رهنما، مشاوره حرفه‌ای و رایگان برای متقاضیان جراحی چشم و معرفی به 
              <span className="text-emerald-400 font-semibold"> بهترین پزشکان متخصص</span> ایران ارائه می‌دهد.
            </p>
            <p className="text-gray-400">
              ما به شما کمک می‌کنیم بهترین تصمیم را برای سلامت چشمانتان بگیرید.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-emerald-300">لینک‌های سریع</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors flex items-center gap-3 py-1 group">
                  <Home className="h-4 w-4 text-emerald-500 group-hover:text-emerald-400" />
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-emerald-400 transition-colors py-1 block">پزشکان متخصص</Link>
              </li>
              <li>
                <Link to="/consultation" className="hover:text-emerald-400 transition-colors py-1 block">درخواست مشاوره رایگان</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-emerald-400 transition-colors py-1 block">مقالات آموزشی</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-emerald-400 transition-colors py-1 block">سوالات متداول</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors py-1 block">درباره ما</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-emerald-300 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              تماس با ما
            </h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mt-1">
                  <Phone className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">شماره تماس:</p>
                  <a href="tel:+989123456789" className="hover:text-emerald-400 transition-colors font-medium">+98 912 345 6789</a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mt-1">
                  <Mail className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">ایمیل:</p>
                  <a href="mailto:info@eyecare.ir" className="hover:text-emerald-400 transition-colors font-medium">info@eyecare.ir</a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mt-1">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">آدرس:</p>
                  <span className="font-medium">تهران، خیابان ولیعصر</span>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mt-1">
                  <Clock className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">ساعات کاری:</p>
                  <span className="font-medium">۲۴ ساعت، ۷ روز هفته</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} دیدار چشم رهنما. تمامی حقوق محفوظ است.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-emerald-400 transition-colors">حریم خصوصی</Link>
              <Link to="/terms" className="hover:text-emerald-400 transition-colors">شرایط استفاده</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
