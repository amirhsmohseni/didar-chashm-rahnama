
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const SEO = ({
  title = 'کلینیک چشم‌پزشکی - مراقبت حرفه‌ای از چشمان شما',
  description = 'کلینیک تخصصی چشم‌پزشکی با پزشکان مجرب، خدمات درمانی پیشرفته و تجهیزات مدرن. مشاوره رایگان و درمان تخصصی بیماری‌های چشم.',
  keywords = 'چشم‌پزشکی، کلینیک چشم، درمان چشم، جراحی چشم، لیزیک، آب مروارید، گلوکوم، شبکیه، مشاوره چشم‌پزشکی',
  ogTitle,
  ogDescription,
  ogImage = '/favicon.ico',
  ogType = 'website',
  canonicalUrl,
  noindex = false,
  nofollow = false,
}: SEOProps) => {
  const fullTitle = title.includes('کلینیک چشم‌پزشکی') ? title : `${title} | کلینیک چشم‌پزشکی`;
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots Meta */}
      <meta 
        name="robots" 
        content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} 
      />
      
      {/* Canonical URL */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      <meta property="og:site_name" content="کلینیک چشم‌پزشکی" />
      <meta property="og:locale" content="fa_IR" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="کلینیک چشم‌پزشکی" />
      <meta name="language" content="fa" />
      <meta name="geo.region" content="IR" />
      <meta name="geo.placename" content="ایران" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          "name": "کلینیک چشم‌پزشکی",
          "description": description,
          ...(currentUrl && { "url": currentUrl }),
          "logo": ogImage,
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": "Persian"
          },
          "medicalSpecialty": "Ophthalmology",
          "areaServed": "Iran"
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
