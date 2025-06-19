
import { Link } from 'react-router-dom';
import { Eye, Stethoscope, Calendar, Phone, Award, Users, Clock, Shield, ArrowLeft, Star, CheckCircle } from 'lucide-react';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturedServices from '@/components/sections/FeaturedServices';
import FeaturedDoctors from '@/components/sections/FeaturedDoctors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <>
      <Header />
      
      {/* Enhanced Hero Section with better gradients and animations */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 text-white py-20 lg:py-28 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.08"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20 animate-pulse"></div>
        
        <div className="container relative">
          <div className="text-center max-w-5xl mx-auto">
            <div className="animate-fade-in">
              <div className="relative mb-8">
                <Eye className="h-20 w-20 lg:h-24 lg:w-24 mx-auto mb-6 animate-bounce drop-shadow-2xl text-blue-100" />
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl h-20 w-20 lg:h-24 lg:w-24 mx-auto"></div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 lg:mb-8 leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                دیدار چشم رهنما
              </h1>
              <p className="text-xl lg:text-2xl mb-10 lg:mb-12 max-w-4xl mx-auto text-blue-50 leading-relaxed font-medium">
                مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center items-center animate-fade-in">
              <Button asChild size="lg" className="bg-gradient-to-r from-white to-blue-50 text-blue-800 hover:from-blue-50 hover:to-white font-bold text-lg lg:text-xl px-8 lg:px-12 py-4 lg:py-6 h-auto shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 border-2 border-white/30 hover:border-white/60 group transform hover:scale-105">
                <Link to="/consultation" className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 lg:h-7 lg:w-7 group-hover:scale-110 transition-transform text-blue-600" />
                  درخواست مشاوره رایگان
                  <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform text-blue-600" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 font-bold text-lg lg:text-xl px-8 lg:px-12 py-4 lg:py-6 h-auto shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 border-2 border-white/20 hover:border-white/40 group transform hover:scale-105">
                <Link to="/doctors" className="flex items-center gap-3">
                  <Stethoscope className="h-6 w-6 lg:h-7 lg:w-7 group-hover:scale-110 transition-transform" />
                  مشاهده پزشکان متخصص
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Trust Indicators */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-white to-gray-50 border-b border-gray-100">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <Users className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">۵۰۰+</div>
              <div className="text-base lg:text-lg text-gray-600 font-medium">مشاوره موفق</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <Award className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">۲۵+</div>
              <div className="text-base lg:text-lg text-gray-600 font-medium">پزشک متخصص</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <Star className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">۴.۹</div>
              <div className="text-base lg:text-lg text-gray-600 font-medium">امتیاز رضایت</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <Clock className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">۲۴/۷</div>
              <div className="text-base lg:text-lg text-gray-600 font-medium">پشتیبانی</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="container">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 lg:mb-8 text-gray-900 bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">خدمات ما</h2>
            <p className="text-gray-600 max-w-4xl mx-auto text-lg lg:text-xl leading-relaxed font-medium">
              ما با بهترین پزشکان متخصص چشم ایران همکاری می‌کنیم تا بهترین خدمات را به شما ارائه دهیم
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10">
            <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white/90 backdrop-blur-sm group">
              <CardHeader className="pb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                <CardTitle className="text-xl lg:text-2xl font-bold">مشاوره تخصصی</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                  مشاوره رایگان با متخصصان مجرب در زمینه بیماری‌های چشم
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white/90 backdrop-blur-sm group">
              <CardHeader className="pb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 w-20 h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                <CardTitle className="text-xl lg:text-2xl font-bold">معرفی پزشک</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                  معرفی بهترین جراحان چشم متناسب با نیاز شما
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white/90 backdrop-blur-sm group">
              <CardHeader className="pb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                <CardTitle className="text-xl lg:text-2xl font-bold">پاسخگویی سریع</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                  پاسخگویی به درخواست‌های شما در کمترین زمان ممکن
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-white/90 backdrop-blur-sm group">
              <CardHeader className="pb-6">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                <CardTitle className="text-xl lg:text-2xl font-bold">اعتماد و کیفیت</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                  همکاری با معتبرترین پزشکان و مراکز درمانی کشور
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <FeaturedServices />

      {/* Featured Doctors */}
      <FeaturedDoctors />

      {/* Enhanced Why Choose Us */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.08"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20v20h40V20H20z"/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="container relative">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 lg:mb-8">چرا دیدار چشم رهنما؟</h2>
            <p className="text-blue-100 max-w-4xl mx-auto text-lg lg:text-xl leading-relaxed font-medium">
              سال‌ها تجربه در زمینه مشاوره و معرفی بهترین متخصصان چشم
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center group">
              <div className="bg-white/15 backdrop-blur-sm w-24 h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center mx-auto mb-8 lg:mb-10 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                <Award className="h-12 w-12 lg:h-14 lg:w-14" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">پزشکان برتر</h3>
              <p className="text-blue-100 text-lg lg:text-xl leading-relaxed">
                همکاری با بهترین و مجربترین پزشکان متخصص چشم کشور
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-white/15 backdrop-blur-sm w-24 h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center mx-auto mb-8 lg:mb-10 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                <Phone className="h-12 w-12 lg:h-14 lg:w-14" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">مشاوره رایگان</h3>
              <p className="text-blue-100 text-lg lg:text-xl leading-relaxed">
                دریافت مشاوره کاملاً رایگان قبل از انجام هر گونه عمل جراحی
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-white/15 backdrop-blur-sm w-24 h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center mx-auto mb-8 lg:mb-10 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                <Eye className="h-12 w-12 lg:h-14 lg:w-14" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">تخصص در چشم</h3>
              <p className="text-blue-100 text-lg lg:text-xl leading-relaxed">
                تمرکز کامل بر روی بیماری‌ها و جراحی‌های مربوط به چشم
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="container text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 lg:mb-8 text-gray-900 bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">آماده دریافت مشاوره هستید؟</h2>
            <p className="text-gray-600 mb-12 lg:mb-16 max-w-4xl mx-auto text-lg lg:text-xl leading-relaxed font-medium">
              همین حالا درخواست مشاوره رایگان خود را ارسال کنید و از تجربه بهترین متخصصان بهره‌مند شوید
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center items-center mb-12 lg:mb-16">
              <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-200">
                <CheckCircle className="h-6 w-6" />
                <span className="text-lg font-semibold">مشاوره کاملاً رایگان</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-200">
                <CheckCircle className="h-6 w-6" />
                <span className="text-lg font-semibold">بدون تعهد</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-200">
                <CheckCircle className="h-6 w-6" />
                <span className="text-lg font-semibold">پاسخ سریع</span>
              </div>
            </div>
            
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 font-bold text-xl lg:text-2xl px-12 lg:px-16 py-6 lg:py-8 h-auto shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group transform hover:scale-105">
              <Link to="/consultation" className="flex items-center gap-4">
                <Calendar className="h-7 w-7 lg:h-8 lg:w-8 group-hover:scale-110 transition-transform" />
                شروع مشاوره رایگان
                <ArrowLeft className="h-6 w-6 lg:h-7 lg:w-7 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
