
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
      
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-16 lg:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10"></div>
        
        <div className="container relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <Eye className="h-16 w-16 lg:h-20 lg:w-20 mx-auto mb-6 lg:mb-8 animate-pulse drop-shadow-lg" />
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 leading-tight">
                دیدار چشم رهنما
              </h1>
              <p className="text-lg lg:text-xl mb-8 lg:mb-10 max-w-3xl mx-auto text-blue-100 leading-relaxed">
                مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center animate-fade-in">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 group">
                <Link to="/consultation">
                  <Calendar className="h-5 w-5 lg:h-6 lg:w-6 ml-2 group-hover:scale-110 transition-transform" />
                  درخواست مشاوره رایگان
                  <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-green-600 text-white hover:bg-green-700 font-bold text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 h-auto shadow-xl hover:shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-300 group">
                <Link to="/doctors">
                  <Stethoscope className="h-5 w-5 lg:h-6 lg:w-6 ml-2 group-hover:scale-110 transition-transform" />
                  مشاهده پزشکان متخصص
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 lg:py-16 bg-white border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Users className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">۵۰۰+</div>
              <div className="text-sm lg:text-base text-gray-600">مشاوره موفق</div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Award className="h-8 w-8 lg:h-10 lg:w-10 text-green-600" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">۲۵+</div>
              <div className="text-sm lg:text-base text-gray-600">پزشک متخصص</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Star className="h-8 w-8 lg:h-10 lg:w-10 text-purple-600" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">۴.۹</div>
              <div className="text-sm lg:text-base text-gray-600">امتیاز رضایت</div>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Clock className="h-8 w-8 lg:h-10 lg:w-10 text-orange-600" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">۲۴/۷</div>
              <div className="text-sm lg:text-base text-gray-600">پشتیبانی</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 lg:mb-6 text-gray-900">خدمات ما</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-base lg:text-lg leading-relaxed">
              ما با بهترین پزشکان متخصص چشم ایران همکاری می‌کنیم تا بهترین خدمات را به شما ارائه دهیم
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg">
                  <Stethoscope className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <CardTitle className="text-lg lg:text-xl">مشاوره تخصصی</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                  مشاوره رایگان با متخصصان مجرب در زمینه بیماری‌های چشم
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg">
                  <Users className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <CardTitle className="text-lg lg:text-xl">معرفی پزشک</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                  معرفی بهترین جراحان چشم متناسب با نیاز شما
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg">
                  <Clock className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <CardTitle className="text-lg lg:text-xl">پاسخگویی سریع</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                  پاسخگویی به درخواست‌های شما در کمترین زمان ممکن
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg">
                  <Shield className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <CardTitle className="text-lg lg:text-xl">اعتماد و کیفیت</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
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
      <section className="py-16 lg:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20v20h40V20H20z"/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="container relative">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 lg:mb-6">چرا دیدار چشم رهنما؟</h2>
            <p className="text-blue-100 max-w-3xl mx-auto text-base lg:text-lg leading-relaxed">
              سال‌ها تجربه در زمینه مشاوره و معرفی بهترین متخصصان چشم
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10 lg:h-12 lg:w-12" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">پزشکان برتر</h3>
              <p className="text-blue-100 text-sm lg:text-base leading-relaxed">
                همکاری با بهترین و مجربترین پزشکان متخصص چشم کشور
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8 group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-10 w-10 lg:h-12 lg:w-12" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">مشاوره رایگان</h3>
              <p className="text-blue-100 text-sm lg:text-base leading-relaxed">
                دریافت مشاوره کاملاً رایگان قبل از انجام هر گونه عمل جراحی
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8 group-hover:scale-110 transition-transform duration-300">
                <Eye className="h-10 w-10 lg:h-12 lg:w-12" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">تخصص در چشم</h3>
              <p className="text-blue-100 text-sm lg:text-base leading-relaxed">
                تمرکز کامل بر روی بیماری‌ها و جراحی‌های مربوط به چشم
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 lg:mb-6 text-gray-900">آماده دریافت مشاوره هستید؟</h2>
            <p className="text-gray-600 mb-8 lg:mb-10 max-w-3xl mx-auto text-base lg:text-lg leading-relaxed">
              همین حالا درخواست مشاوره رایگان خود را ارسال کنید و از تجربه بهترین متخصصان بهره‌مند شوید
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mb-8 lg:mb-10">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm lg:text-base">مشاوره کاملاً رایگان</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm lg:text-base">بدون تعهد</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm lg:text-base">پاسخ سریع</span>
              </div>
            </div>
            
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-bold text-base lg:text-lg px-8 lg:px-12 py-4 lg:py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <Link to="/consultation">
                <Calendar className="h-5 w-5 lg:h-6 lg:w-6 ml-2 group-hover:scale-110 transition-transform" />
                شروع مشاوره رایگان
                <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5 mr-2 group-hover:translate-x-1 transition-transform" />
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
