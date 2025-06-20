
import { useSiteSettings } from '@/hooks/useSiteSettings';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturedServices from '@/components/sections/FeaturedServices';
import FeaturedDoctors from '@/components/sections/FeaturedDoctors';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Eye, Users, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { settings, isLoading } = useSiteSettings();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-b from-primary to-primary/80 text-white py-24"
        style={{
          backgroundImage: settings.site_background ? `linear-gradient(rgba(14, 165, 233, 0.8), rgba(14, 165, 233, 0.6)), url(${settings.site_background})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            {settings.hero_title}
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            {settings.hero_description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/consultation">
                درخواست مشاوره رایگان
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/services">مشاهده خدمات</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Eye, label: 'عمل موفق', value: '۱۰۰۰+' },
              { icon: Users, label: 'بیمار راضی', value: '۹۵۰+' },
              { icon: Award, label: 'سال تجربه', value: '۱۵+' },
              { icon: Clock, label: 'ساعت کاری', value: '۲۴/۷' },
            ].map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <FeaturedServices />

      {/* Featured Doctors */}
      <FeaturedDoctors />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">آماده برای شروع هستید؟</h2>
          <p className="text-xl mb-8">مشاوره رایگان دریافت کنید و بهترین تصمیم را بگیرید</p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link to="/consultation">
              همین حالا شروع کنید
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
