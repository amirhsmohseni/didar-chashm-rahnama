
import { useEffect, useState, memo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SiteSettingsLoader from '@/components/sections/SiteSettingsLoader';
import FeaturedServices from '@/components/sections/FeaturedServices';
import OptimizedHeroSection from '@/components/sections/OptimizedHeroSection';
import OptimizedImageSlider from '@/components/sections/OptimizedImageSlider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SiteSettings {
  hero_title?: string;
  hero_description?: string;
  site_logo?: string;
  site_background?: string;
}

interface Review {
  id: string;
  patient_name: string;
  review_text: string;
  rating: number;
  doctor_name?: string;
  is_featured: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  is_published: boolean | null;
}

// Memoized Star Rating Component for better performance
const StarRating = memo(({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
});

StarRating.displayName = 'StarRating';

// Memoized Review Card Component
const ReviewCard = memo(({ review }: { review: Review }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
    <CardContent className="p-4 sm:p-6 h-full flex flex-col">
      <StarRating rating={review.rating} />
      <p className="text-gray-600 mb-4 leading-relaxed flex-grow text-sm sm:text-base">"{review.review_text}"</p>
      <div className="text-sm text-gray-500">
        <p className="font-semibold">{review.patient_name}</p>
        {review.doctor_name && (
          <p>بیمار دکتر {review.doctor_name}</p>
        )}
      </div>
    </CardContent>
  </Card>
));

ReviewCard.displayName = 'ReviewCard';

// Memoized FAQ Card Component
const FAQCard = memo(({ faq }: { faq: FAQ }) => (
  <Card className="hover:shadow-md transition-shadow duration-300">
    <CardContent className="p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 leading-relaxed">{faq.question}</h3>
      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
    </CardContent>
  </Card>
));

FAQCard.displayName = 'FAQCard';

// Memoized Stat Item Component
const StatItem = memo(({ value, label }: { value: string; label: string }) => (
  <div className="transform hover:scale-105 transition-all duration-300 text-center">
    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">{value}</div>
    <div className="text-gray-600 text-sm sm:text-base">{label}</div>
  </div>
));

StatItem.displayName = 'StatItem';

const Index = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          loadSettings(),
          loadReviews(),
          loadFaqs()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      if (data && data.length > 0) {
        const settingsMap: Record<string, any> = {};
        data.forEach(setting => {
          let value = setting.value;
          if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (typeof value !== 'string') {
            value = JSON.stringify(value).replace(/^"|"$/g, '');
          }
          settingsMap[setting.key] = value;
        });

        setSiteSettings(settingsMap);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_reviews')
        .select('*')
        .eq('is_featured', true)
        .eq('is_approved', true)
        .limit(6);

      if (error) {
        console.error('Error loading reviews:', error);
        return;
      }

      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .limit(6);

      if (error) {
        console.error('Error loading FAQs:', error);
        return;
      }

      setFaqs(data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    }
  };

  return (
    <>
      <SiteSettingsLoader />
      <Header />
      
      {/* Move Image Slider to top */}
      <OptimizedImageSlider />

      {/* Optimized Hero Section */}
      <OptimizedHeroSection siteSettings={siteSettings} isLoading={isLoading} />

      {/* Featured Services */}
      <FeaturedServices />

      {/* Enhanced CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-primary to-primary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">آماده شروع هستید؟</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-white/90">همین امروز مشاوره رایگان خود را دریافت کنید</p>
          <Link to="/consultation">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              شروع مشاوره
            </Button>
          </Link>
        </div>
      </section>

      {/* Enhanced Patient Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">نظرات بیماران</h2>
              <p className="text-lg sm:text-xl text-gray-600">تجربه بیماران ما از خدمات چشم‌پزشکی</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            
            <div className="text-center mt-6 sm:mt-8">
              <Link to="/reviews">
                <Button variant="outline" className="px-6 sm:px-8 py-2 sm:py-3">
                  مشاهده همه نظرات
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">سوالات متداول</h2>
              <p className="text-lg sm:text-xl text-gray-600">پاسخ سوالات رایج در مورد خدمات چشم‌پزشکی</p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {faqs.slice(0, 5).map((faq) => (
                <FAQCard key={faq.id} faq={faq} />
              ))}
            </div>
            
            <div className="text-center mt-6 sm:mt-8">
              <Link to="/faq">
                <Button variant="outline" className="px-6 sm:px-8 py-2 sm:py-3">
                  مشاهده همه سوالات
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">دستاوردهای ما</h2>
            <p className="text-lg sm:text-xl text-gray-600">آمار موفقیت‌های کلینیک چشم‌پزشکی</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <StatItem value="1000+" label="مشاوره موفق" />
            <StatItem value="50+" label="پزشک متخصص" />
            <StatItem value="98%" label="رضایت بیماران" />
            <StatItem value="24/7" label="پشتیبانی" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default memo(Index);
