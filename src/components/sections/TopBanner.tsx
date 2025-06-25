
import { memo } from 'react';
import { Phone, Clock, MapPin } from 'lucide-react';

const TopBanner = memo(() => {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Contact Info */}
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-3 bg-white/20 rounded-full">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm opacity-90">تماس با ما</p>
              <p className="font-semibold">021-88776655</p>
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              مرکز تخصصی چشم‌پزشکی
            </h2>
            <p className="text-white/90">
              ارائه خدمات پیشرفته چشم‌پزشکی با تجهیزات روز دنیا
            </p>
          </div>

          {/* Working Hours */}
          <div className="flex items-center justify-center md:justify-end gap-3">
            <div className="p-3 bg-white/20 rounded-full">
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">ساعات کاری</p>
              <p className="font-semibold">8:00 - 20:00</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-6 text-center">
          <a 
            href="/consultation" 
            className="inline-flex items-center bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors"
          >
            <MapPin className="h-4 w-4 ml-2" />
            رزرو نوبت آنلاین
          </a>
        </div>
      </div>
    </section>
  );
});

TopBanner.displayName = 'TopBanner';

export default TopBanner;
