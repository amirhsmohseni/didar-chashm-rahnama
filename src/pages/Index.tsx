
import { Helmet } from 'react-helmet-async';
import OptimizedHeroSection from '@/components/sections/OptimizedHeroSection';
import OptimizedImageSlider from '@/components/sections/OptimizedImageSlider';
import FeaturedServices from '@/components/sections/FeaturedServices';
import FeaturedDoctors from '@/components/sections/FeaturedDoctors';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SiteSettingsLoader from '@/components/sections/SiteSettingsLoader';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Index = () => {
  const { settings: siteSettings, isLoading } = useSiteSettings();

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>کلینیک چشم‌پزشکی اپتگرا - مرکز تخصصی درمان چشم</title>
        <meta name="description" content="کلینیک چشم‌پزشکی اپتگرا با بهترین متخصصان و تجهیزات پیشرفته، خدمات تشخیص و درمان بیماری‌های چشم را ارائه می‌دهد." />
        <meta name="keywords" content="چشم‌پزشکی, لیزیک, جراحی چشم, کلینیک چشم, اپتگرا" />
      </Helmet>
      
      <SiteSettingsLoader />
      <Header />
      <main>
        <OptimizedHeroSection siteSettings={siteSettings} isLoading={isLoading} />
        {/* Move image slider right after hero section */}
        <OptimizedImageSlider />
        <FeaturedServices />
        <FeaturedDoctors />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
