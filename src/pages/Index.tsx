
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturedServices from '@/components/sections/FeaturedServices';
import FeaturedDoctors from '@/components/sections/FeaturedDoctors';
import SiteSettingsLoader from '@/components/sections/SiteSettingsLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, Clock, Shield, Award, Users } from 'lucide-react';
import SEO from '@/components/SEO';

interface SiteSettings {
  site_title: string;
  site_description: string;
  hero_title: string;
  hero_description: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  site_logo: string;
  site_background: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_title: 'دیدار چشم رهنما',
    site_description: 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم',
    hero_title: 'دیدار چشم رهنما',
    hero_description: 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران',
    contact_phone: '021-12345678',
    contact_email: 'info@clinic.com',
    contact_address: 'تهران، خیابان ولیعصر',
    site_logo: '',
    site_background: ''
  });

  const handleSettingsLoad = (settings: SiteSettings) => {
    console.log('Settings loaded in Index:', settings);
    if (settings && typeof settings === 'object') {
      setSiteSettings(settings);
    }
  };

  return (
    <>
      <SEO 
        title={siteSettings?.site_title || 'دیدار چشم رهنما'}
        description={siteSettings?.site_description || 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم'}
      />
      
      <SiteSettingsLoader onSettingsLoad={handleSettingsLoad} />
      
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-b from-primary to-primary/80 text-white py-20 overflow-hidden"
        style={{
          backgroundImage: siteSettings?.site_background ? `url(${siteSettings.site_background})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: siteSettings?.site_background ? 'overlay' : undefined
        }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {siteSettings?.hero_title || 'دیدار چشم رهنما'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              {siteSettings?.hero_description || 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
                onClick={() => navigate('/consultation')}
              >
                <MessageCircle className="ml-2 h-6 w-6" />
                مشاوره رایگان
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6"
                onClick={() => window.open(`tel:${siteSettings?.contact_phone || '021-12345678'}`, '_self')}
              >
                <Phone className="ml-2 h-6 w-6" />
                {siteSettings?.contact_phone || '021-12345678'}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 text-white/90">
                <Clock className="h-8 w-8" />
                <span className="text-lg">مشاوره 24 ساعته</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/90">
                <Shield className="h-8 w-8" />
                <span className="text-lg">مشاوره رایگان</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/90">
                <Award className="h-8 w-8" />
                <span className="text-lg">متخصصان برتر</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">۱۰۰۰+</div>
                <div className="text-muted-foreground">مشاوره موفق</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">۵۰+</div>
                <div className="text-muted-foreground">پزشک متخصص</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">۱۵+</div>
                <div className="text-muted-foreground">سال تجربه</div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">۹۸%</div>
                <div className="text-muted-foreground">رضایت بیماران</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <FeaturedServices />

      {/* Featured Doctors */}
      <FeaturedDoctors />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              آماده برای شروع مشاوره هستید؟
            </h2>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              با متخصصان ما در ارتباط باشید و بهترین تصمیم را برای سلامت چشمان خود بگیرید
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
                onClick={() => navigate('/consultation')}
              >
                <MessageCircle className="ml-2 h-6 w-6" />
                شروع مشاوره رایگان
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6"
                onClick={() => navigate('/doctors')}
              >
                <Users className="ml-2 h-6 w-6" />
                مشاهده پزشکان
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;
