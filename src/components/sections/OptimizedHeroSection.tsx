
import { useState, useEffect, memo } from 'react';
import { Eye, Users, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SiteSettings {
  hero_title?: string;
  hero_description?: string;
  site_logo?: string;
  site_background?: string;
}

interface OptimizedHeroSectionProps {
  siteSettings: SiteSettings;
  isLoading: boolean;
}

const OptimizedHeroSection = memo(({ siteSettings, isLoading }: OptimizedHeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Optimized Background with Better Performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        {siteSettings.site_background && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 will-change-transform"
            style={{ backgroundImage: `url(${siteSettings.site_background})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      </div>
      
      {/* Optimized Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Enhanced Responsive Content */}
      <div className={`container relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-5xl mx-auto">
          {/* Optimized Logo */}
          {siteSettings.site_logo && (
            <div className="mb-6 sm:mb-8 flex justify-center">
              <img 
                src={siteSettings.site_logo} 
                alt="لوگو"
                className="h-16 w-auto sm:h-20 lg:h-24 drop-shadow-2xl animate-fade-in"
                loading="eager"
              />
            </div>
          )}
          
          {/* Enhanced Responsive Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
            {isLoading ? 'دیدار چشم رهنما' : (siteSettings.hero_title || 'دیدار چشم رهنما')}
          </h1>
          
          {/* Enhanced Responsive Subtitle */}
          <p className="text-base sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-white/90 leading-relaxed max-w-4xl mx-auto px-4">
            {isLoading ? 'مشاوره تخ...' : (siteSettings.hero_description || 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران')}
          </p>
          
          {/* Enhanced CTA Buttons with Better Mobile UX */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
            <Link to="/consultation" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white h-12 sm:h-14 min-w-[200px] sm:min-w-[220px] text-sm sm:text-base"
              >
                <Eye className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                دریافت مشاوره رایگان
              </Button>
            </Link>
            <Link to="/doctors" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300 h-12 sm:h-14 min-w-[200px] sm:min-w-[220px] text-sm sm:text-base"
              >
                <Users className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                مشاهده پزشکان
              </Button>
            </Link>
          </div>

          {/* Enhanced Responsive Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <FeatureCard 
              icon="🛡️"
              title="مشاوره تخصصی"
              description="مشاوره رایگان با بهترین متخصصان چشم"
            />
            <FeatureCard 
              icon="🏆"
              title="پزشکان مجرب"
              description="دسترسی به بهترین متخصصان کشور"
            />
            <FeatureCard 
              icon="❤️"
              title="مراقبت کامل"
              description="پیگیری و مراقبت در تمام مراحل"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-white/60" />
      </div>
    </section>
  );
});

// Memoized Feature Card Component
const FeatureCard = memo(({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
    <CardContent className="p-4 sm:p-6 text-center">
      <div className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-base sm:text-lg font-semibold mb-2">{title}</h3>
      <p className="text-white/80 text-sm sm:text-base leading-relaxed">{description}</p>
    </CardContent>
  </Card>
));

FeatureCard.displayName = 'FeatureCard';
OptimizedHeroSection.displayName = 'OptimizedHeroSection';

export default OptimizedHeroSection;
