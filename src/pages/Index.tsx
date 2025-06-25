
import { useEffect, useState } from 'react';
import { Eye, Shield, Clock, Star, ChevronDown, Play, ArrowLeft, CheckCircle, Users, Award, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SiteSettingsLoader from '@/components/sections/SiteSettingsLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SiteSettings {
  hero_title?: string;
  hero_description?: string;
  site_logo?: string;
  site_background?: string;
}

const Index = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample images for the slider
  const sliderImages = [
    '/lovable-uploads/2044c494-74f5-42c3-9979-6effb4059825.png',
    '/lovable-uploads/3bf77a26-5255-49db-ae88-bf1a5d13339c.png',
    '/lovable-uploads/56cc2662-9b74-49e6-b2e9-3c799a4ba344.png'
  ];

  useEffect(() => {
    loadSettings();
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  return (
    <>
      <SiteSettingsLoader />
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
          {siteSettings.site_background && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${siteSettings.site_background})` }}
            />
          )}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            {siteSettings.site_logo && (
              <div className="mb-8 flex justify-center">
                <img 
                  src={siteSettings.site_logo} 
                  alt="لوگو"
                  className="h-24 w-auto drop-shadow-2xl animate-fade-in"
                />
              </div>
            )}
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in">
              {isLoading ? 'دیدار چشم رهنما' : (siteSettings.hero_title || 'دیدار چشم رهنما')}
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed animate-fade-in delay-200">
              {isLoading ? 'مشاوره تخ...' : (siteSettings.hero_description || 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران')}
            </p>
            
            {/* CTA Buttons - Fixed styling and sizing */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in delay-300">
              <Link to="/consultation">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white h-14 min-w-[220px]">
                  <Eye className="ml-2 h-5 w-5" />
                  دریافت مشاوره رایگان
                </Button>
              </Link>
              <Link to="/doctors">
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-2xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300 h-14 min-w-[220px]">
                  <Users className="ml-2 h-5 w-5" />
                  مشاهده پزشکان
                </Button>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in delay-500">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-lg font-semibold mb-2">مشاوره تخصصی</h3>
                  <p className="text-white/80">مشاوره رایگان با بهترین متخصصان چشم</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                  <h3 className="text-lg font-semibold mb-2">پزشکان مجرب</h3>
                  <p className="text-white/80">دسترسی به بهترین متخصصان کشور</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-red-400" />
                  <h3 className="text-lg font-semibold mb-2">مراقبت کامل</h3>
                  <p className="text-white/80">پیگیری و مراقبت در تمام مراحل</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/60" />
        </div>
      </section>

      {/* Image Slider Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">تجهیزات پیشرفته</h2>
            <p className="text-xl text-gray-600">آشنایی با تجهیزات مدرن چشم‌پزشکی</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              ))}
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray-600">مشاوره موفق</div>
            </div>
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">پزشک متخصص</div>
            </div>
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600">رضایت بیماران</div>
            </div>
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">پشتیبانی</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">خدمات ما</h2>
            <p className="text-xl text-gray-600">طیف وسیعی از خدمات چشم‌پزشکی</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">جراحی لیزیک</h3>
                <p className="text-gray-600 mb-6">تصحیح عیوب انکساری چشم با آخرین تکنولوژی</p>
                <Link to="/services">
                  <Button variant="outline" className="group">
                    اطلاعات بیشتر
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">جراحی آب مروارید</h3>
                <p className="text-gray-600 mb-6">درمان آب مروارید با تکنیک‌های پیشرفته</p>
                <Link to="/services">
                  <Button variant="outline" className="group">
                    اطلاعات بیشتر
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">معاینات تخصصی</h3>
                <p className="text-gray-600 mb-6">بررسی جامع وضعیت سلامت چشمان</p>
                <Link to="/services">
                  <Button variant="outline" className="group">
                    اطلاعات بیشتر
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-6">آماده شروع هستید؟</h2>
          <p className="text-xl mb-8 text-white/90">همین امروز مشاوره رایگان خود را دریافت کنید</p>
          <Link to="/consultation">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Eye className="ml-2 h-5 w-5" />
              شروع مشاوره
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
