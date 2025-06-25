
import { useEffect, useState } from 'react';
import { Eye, Shield, Clock, Star, ChevronDown, Play, ArrowLeft, CheckCircle, Users, Award, Heart, ChevronLeft, ChevronRight, Phone, Calendar, MapPin, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SiteSettingsLoader from '@/components/sections/SiteSettingsLoader';
import FeaturedServices from '@/components/sections/FeaturedServices';
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

const Index = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Sample images for the slider
  const sliderImages = [
    '/lovable-uploads/2044c494-74f5-42c3-9979-6effb4059825.png',
    '/lovable-uploads/3bf77a26-5255-49db-ae88-bf1a5d13339c.png',
    '/lovable-uploads/56cc2662-9b74-49e6-b2e9-3c799a4ba344.png'
  ];

  useEffect(() => {
    loadSettings();
    loadReviews();
    loadFaqs();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

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
    } finally {
      setIsLoading(false);
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <>
      <SiteSettingsLoader />
      <Header />
      
      {/* Modern Medical Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20 pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Side */}
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Shield className="h-4 w-4 ml-2" />
                  مرکز معتبر چشم‌پزشکی
                </div>
                <div className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Award className="h-4 w-4 ml-2" />
                  ۱۰+ سال تجربه
                </div>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {isLoading ? 'دیدار چشم رهنما' : (siteSettings.hero_title || 'دیدار چشم رهنما')}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  {isLoading ? 'مشاوره تخصصی...' : (siteSettings.hero_description || 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران')}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/consultation">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <Calendar className="ml-2 h-5 w-5" />
                    رزرو مشاوره رایگان
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl transition-all duration-300">
                    <Users className="ml-2 h-5 w-5" />
                    مشاهده پزشکان
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-gray-600">مشاوره موفق</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-600">پزشک متخصص</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-gray-600">رضایت بیماران</div>
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative">
              {siteSettings.site_background ? (
                <img 
                  src={siteSettings.site_background}
                  alt="مرکز چشم‌پزشکی"
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl shadow-2xl flex items-center justify-center">
                  <Eye className="h-24 w-24 text-blue-600" />
                </div>
              )}
              
              {/* Floating Card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">مشاوره رایگان</div>
                    <div className="text-sm text-gray-600">24 ساعته در دسترس</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">خدمات تخصصی ما</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              طیف کاملی از خدمات چشم‌پزشکی با استفاده از جدیدترین تکنولوژی‌های روز دنیا
            </p>
          </div>

          {/* Service Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <Eye className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">جراحی رفرکتیو</h3>
                <p className="text-gray-600 text-sm leading-relaxed">تصحیح نابینایی با لیزر و جدیدترین روش‌های درمانی</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-600 transition-colors duration-300">
                  <Heart className="h-8 w-8 text-teal-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">درمان آب مروارید</h3>
                <p className="text-gray-600 text-sm leading-relaxed">جراحی آب مروارید با تکنیک‌های پیشرفته</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                  <Shield className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">درمان گلوکوم</h3>
                <p className="text-gray-600 text-sm leading-relaxed">تشخیص و درمان فشار چشم</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-600 transition-colors duration-300">
                  <Stethoscope className="h-8 w-8 text-orange-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">معاینات تخصصی</h3>
                <p className="text-gray-600 text-sm leading-relaxed">بررسی کامل سلامت چشم</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Services Component */}
      <FeaturedServices />

      {/* Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">تجهیزات پیشرفته</h2>
            <p className="text-xl text-gray-600">آشنایی با تجهیزات مدرن چشم‌پزشکی</p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
              {sliderImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                >
                  <img
                    src={image}
                    alt={`تجهیزات چشم‌پزشکی ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">تکنولوژی پیشرفته</h3>
                    <p className="text-lg opacity-90">جدیدترین دستگاه‌های چشم‌پزشکی</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Patient Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">نظرات بیماران</h2>
              <p className="text-xl text-gray-600">تجربه واقعی بیماران ما از خدمات چشم‌پزشکی</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <Card key={review.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      {renderStars(review.rating)}
                    </div>
                    <blockquote className="text-gray-700 mb-6 leading-relaxed text-lg">
                      "{review.review_text}"
                    </blockquote>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{review.patient_name}</div>
                        {review.doctor_name && (
                          <div className="text-sm text-gray-600">بیمار دکتر {review.doctor_name}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/reviews">
                <Button variant="outline" size="lg" className="px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                  مشاهده همه نظرات
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">سوالات متداول</h2>
              <p className="text-xl text-gray-600">پاسخ سوالات رایج در مورد خدمات چشم‌پزشکی</p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.slice(0, 5).map((faq) => (
                <Card key={faq.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{faq.question}</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/faq">
                <Button variant="outline" size="lg" className="px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                  مشاهده همه سوالات
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">آماده شروع هستید؟</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              همین امروز مشاوره رایگان خود را دریافت کنید و اولین قدم را برای بینایی بهتر بردارید
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/consultation">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <Calendar className="ml-2 h-5 w-5" />
                  رزرو مشاوره رایگان
                </Button>
              </Link>
              
              <div className="flex items-center space-x-6 space-x-reverse text-white/90">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Phone className="h-5 w-5" />
                  <span>021-12345678</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Clock className="h-5 w-5" />
                  <span>24/7 پشتیبانی</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
