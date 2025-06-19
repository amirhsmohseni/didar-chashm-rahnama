import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Eye, Share2, ArrowLeft } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';

interface Service {
  id: string;
  title: string;
  description: string;
  detailed_content: string | null;
  icon: string | null;
  image_url: string | null;
  featured_image: string | null;
  gallery_images: string[] | null;
  video_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  slug: string | null;
  reading_time: number | null;
  is_active: boolean;
  is_featured: boolean;
}

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchService();
    } else {
      setError('شناسه سرویس مشخص نشده است');
      setIsLoading(false);
    }
  }, [slug]);

  const fetchService = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        if (error.code === 'PGRST116') {
          setError('سرویس مورد نظر یافت نشد');
        } else {
          setError('خطا در دریافت اطلاعات سرویس');
        }
        return;
      }

      if (!data) {
        setError('سرویس مورد نظر یافت نشد');
        return;
      }

      // Transform the data safely with proper typing
      let galleryImages: string[] = [];
      try {
        if (data.gallery_images) {
          if (Array.isArray(data.gallery_images)) {
            // Ensure all elements are strings
            galleryImages = data.gallery_images.filter((img): img is string => typeof img === 'string');
          } else if (typeof data.gallery_images === 'string') {
            const parsed = JSON.parse(data.gallery_images);
            if (Array.isArray(parsed)) {
              galleryImages = parsed.filter((img): img is string => typeof img === 'string');
            }
          }
        }
      } catch (parseError) {
        console.warn('Error parsing gallery images:', parseError);
        galleryImages = [];
      }

      const transformedService: Service = {
        ...data,
        gallery_images: galleryImages
      };

      setService(transformedService);
    } catch (error) {
      console.error('Error fetching service:', error);
      setError('خطا در دریافت اطلاعات سرویس');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share && service) {
        await navigator.share({
          title: service.title,
          text: service.description,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
        }
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/services';
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !service) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'سرویس یافت نشد'}
            </h1>
            <Button onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              بازگشت
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title={service.meta_title || service.title}
        description={service.meta_description || service.description}
        ogImage={service.featured_image || service.image_url}
      />
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>خانه</span>
                <span>/</span>
                <span>خدمات</span>
                <span>/</span>
                <span className="text-primary">{service.title}</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {service.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {service.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {service.reading_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{service.reading_time} دقیقه مطالعه</span>
                  </div>
                )}
                
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  اشتراک‌گذاری
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {service.featured_image && (
          <section className="py-8">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <img
                  src={service.featured_image}
                  alt={service.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </section>
        )}

        {/* Video Section */}
        {service.video_url && (
          <section className="py-8">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">ویدیو آموزشی</h2>
                    <div className="aspect-video">
                      <iframe
                        src={service.video_url.includes('youtube.com') 
                          ? service.video_url.replace('watch?v=', 'embed/')
                          : service.video_url
                        }
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                        title={`ویدیو ${service.title}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  {service.detailed_content ? (
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: service.detailed_content }}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      محتوای تفصیلی برای این سرویس هنوز اضافه نشده است.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {service.gallery_images && service.gallery_images.length > 0 && (
          <section className="py-8">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">گالری تصاویر</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {service.gallery_images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${service.title} - تصویر ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => window.open(image, '_blank')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                آیا سوالی درباره {service.title} دارید؟
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                تیم متخصص ما آماده پاسخگویی و مشاوره رایگان است
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  مشاوره رایگان
                </Button>
                <Button variant="outline" size="lg">
                  تماس با ما
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ServiceDetail;
