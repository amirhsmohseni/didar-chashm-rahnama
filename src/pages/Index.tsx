
import { Link } from 'react-router-dom';
import { Eye, Stethoscope, Calendar, Phone, Award, Users, Clock, Shield } from 'lucide-react';

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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary/80 text-white py-20">
        <div className="container text-center">
          <Eye className="h-20 w-20 mx-auto mb-8 animate-pulse" />
          <h1 className="text-5xl font-bold mb-6">دیدار چشم رهنما</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
            مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold text-lg px-8 py-4 h-auto shadow-lg">
              <Link to="/consultation">
                <Calendar className="h-6 w-6 ml-2" />
                درخواست مشاوره رایگان
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-green-600 text-white hover:bg-green-700 font-bold text-lg px-8 py-4 h-auto shadow-lg border-2 border-white">
              <Link to="/doctors">
                <Stethoscope className="h-6 w-6 ml-2" />
                مشاهده پزشکان
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">خدمات ما</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ما با بهترین پزشکان متخصص چشم ایران همکاری می‌کنیم تا بهترین خدمات را به شما ارائه دهیم
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Stethoscope className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>مشاوره تخصصی</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  مشاوره رایگان با متخصصان مجرب در زمینه بیماری‌های چشم
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>معرفی پزشک</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  معرفی بهترین جراحان چشم متناسب با نیاز شما
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>پاسخگویی سریع</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  پاسخگویی به درخواست‌های شما در کمترین زمان ممکن
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>اعتماد و کیفیت</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
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

      {/* Why Choose Us */}
      <section className="py-20 bg-primary text-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">چرا دیدار چشم رهنما؟</h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              سال‌ها تجربه در زمینه مشاوره و معرفی بهترین متخصصان چشم
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Award className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">پزشکان برتر</h3>
              <p className="text-white/80">
                همکاری با بهترین و مجربترین پزشکان متخصص چشم کشور
              </p>
            </div>

            <div className="text-center">
              <Phone className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">مشاوره رایگان</h3>
              <p className="text-white/80">
                دریافت مشاوره کاملاً رایگان قبل از انجام هر گونه عمل جراحی
              </p>
            </div>

            <div className="text-center">
              <Eye className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">تخصص در چشم</h3>
              <p className="text-white/80">
                تمرکز کامل بر روی بیماری‌ها و جراحی‌های مربوط به چشم
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">آماده دریافت مشاوره هستید؟</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            همین حالا درخواست مشاوره رایگان خود را ارسال کنید و از تجربه بهترین متخصصان بهره‌مند شوید
          </p>
          <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 font-bold text-lg px-8 py-4 h-auto shadow-lg">
            <Link to="/consultation">
              <Calendar className="h-6 w-6 ml-2" />
              شروع مشاوره رایگان
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
