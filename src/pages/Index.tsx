
import { useEffect, useState } from 'react';
import { Eye, Shield, Clock, Star, ChevronDown, Play, ArrowLeft, CheckCircle, Users, Award, Heart, ChevronLeft, ChevronRight, Phone, Calendar, MapPin, Stethoscope, User } from 'lucide-react';
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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {isLoading ? 'دیدار چشم رهنما' : (siteSettings.hero_title || 'دیدار چشم رهنما')}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {isLoading ? 'مشاوره تخصصی...' : (siteSettings.hero_description || 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/consultation">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Calendar className="ml-2 h-5 w-5" />
                رزرو مشاوره رایگان
              </Button>
            </Link>
            <Link to="/doctors">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Users className="ml-2 h-5 w-5" />
                مشاهده پزشکان
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Image Slider Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">تجهیزات پیشرفته</h2>
            <p className="text-lg text-gray-600">آشنایی با تجهیزات مدرن چشم‌پزشکی</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
              {sliderImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image}
                    alt={`تجهیزات چشم‌پزشکی ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            {/* Navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">خدمات ما</h2>
            <p className="text-lg text-gray-600">خدمات تخصصی چشم‌پزشکی</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">جراحی رفرکتیو</h3>
                <p className="text-gray-600">تصحیح نابینایی با لیزر</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">درمان آب مروارید</h3>
                <p className="text-gray-600">جراحی پیشرفته آب مروارید</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">درمان گلوکوم</h3>
                <p className="text-gray-600">تشخیص و درمان فشار چشم</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Services Component */}
      <FeaturedServices />

      {/* Patient Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">نظرات بیماران</h2>
              <p className="text-lg text-gray-600">تجربه بیماران ما</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {renderStars(review.rating)}
                    </div>
                    <blockquote className="text-gray-700 mb-4">
                      "{review.review_text}"
                    </blockquote>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{review.patient_name}</div>
                        {review.doctor_name && (
                          <div className="text-sm text-gray-600">بیمار دکتر {review.doctor_name}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/reviews">
                <Button variant="outline">
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
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">سوالات متداول</h2>
              <p className="text-lg text-gray-600">پاسخ سوالات رایج</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.slice(0, 5).map((faq) => (
                <Card key={faq.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/faq">
                <Button variant="outline">
                  مشاهده همه سوالات
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">آماده شروع هستید؟</h2>
          <p className="text-xl mb-8">
            همین امروز مشاوره رایگان دریافت کنید
          </p>
          <Link to="/consultation">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Phone className="ml-2 h-5 w-5" />
              درخواست مشاوره
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
