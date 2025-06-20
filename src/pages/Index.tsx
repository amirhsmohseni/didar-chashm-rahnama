
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturedServices from '@/components/sections/FeaturedServices';
import FeaturedDoctors from '@/components/sections/FeaturedDoctors';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Eye, Users, Award, Clock, Sparkles, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-95"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative container py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect text-emerald-200">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">مشاوره تخصصی چشم پزشکی</span>
            </div>
            
            <h1 className="text-7xl font-bold mb-8 leading-tight text-white">
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                دیدار چشم
              </span>
              <br />
              <span className="text-5xl">رهنما</span>
            </h1>
            
            <p className="text-2xl mb-12 text-emerald-100 max-w-3xl mx-auto leading-relaxed">
              مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به 
              <span className="font-semibold text-emerald-300"> بهترین پزشکان متخصص ایران</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-lg rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 glow-animation">
                <Link to="/consultation">
                  <Heart className="mr-2 h-6 w-6" />
                  درخواست مشاوره رایگان
                  <ArrowLeft className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-emerald-300 text-emerald-300 hover:bg-emerald-300 hover:text-slate-900 px-8 py-4 text-lg rounded-2xl backdrop-blur-sm">
                <Link to="/services">
                  <Shield className="mr-2 h-6 w-6" />
                  مشاهده خدمات
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-emerald-900/50"></div>
        <div className="relative container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">آمار موفقیت ما</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Eye, label: 'عمل موفق', value: '۱۰۰۰+', color: 'from-emerald-400 to-teal-400' },
              { icon: Users, label: 'بیمار راضی', value: '۹۵۰+', color: 'from-teal-400 to-cyan-400' },
              { icon: Award, label: 'سال تجربه', value: '۱۵+', color: 'from-cyan-400 to-blue-400' },
              { icon: Clock, label: 'ساعت کاری', value: '۲۴/۷', color: 'from-blue-400 to-indigo-400' },
            ].map((stat, index) => (
              <Card key={index} className="group glass-effect border-white/20 hover:border-emerald-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} mb-6 float-animation`} style={{animationDelay: `${index * 0.2}s`}}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-emerald-200 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/50 to-transparent"></div>
        <FeaturedServices />
      </div>

      {/* Featured Doctors */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/30 to-transparent"></div>
        <FeaturedDoctors />
      </div>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative container text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">شروع سفر سلامتی شما</span>
            </div>
            
            <h2 className="text-5xl font-bold text-white mb-6">آماده برای شروع هستید؟</h2>
            <p className="text-xl mb-10 text-emerald-100 leading-relaxed">
              مشاوره رایگان دریافت کنید و بهترین تصمیم را برای سلامت چشمانتان بگیرید
            </p>
            
            <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 px-10 py-4 text-xl rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105">
              <Link to="/consultation">
                <Heart className="mr-3 h-6 w-6" />
                همین حالا شروع کنید
                <ArrowLeft className="ml-3 h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
