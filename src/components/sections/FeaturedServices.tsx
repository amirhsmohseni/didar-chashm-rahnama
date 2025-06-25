
import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Heart, Stethoscope, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  image_url: string | null;
  is_featured: boolean;
  slug: string | null;
  price: number | null;
}

const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      console.log('Fetching featured services...');
      const { data, error } = await supabase
        .from('services')
        .select('id, title, description, icon, image_url, is_featured, slug, price')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('order_index', { ascending: true })
        .limit(6);

      if (error) {
        console.error('Error fetching featured services:', error);
        throw error;
      }

      console.log('Featured services fetched:', data?.length || 0);
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (iconName: string | null) => {
    switch (iconName) {
      case 'Eye':
        return <Eye className="h-8 w-8" />;
      case 'Heart':
        return <Heart className="h-8 w-8" />;
      case 'Stethoscope':
        return <Stethoscope className="h-8 w-8" />;
      case 'User':
        return <User className="h-8 w-8" />;
      default:
        return <Stethoscope className="h-8 w-8" />;
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null || price === 0) return 'تماس بگیرید';
    return `${price.toLocaleString('fa-IR')} تومان`;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری خدمات ویژه...</p>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-eyecare-800 mb-4">خدمات برجسته ما</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ما طیف گسترده‌ای از خدمات تخصصی چشم‌پزشکی را با بالاترین کیفیت ارائه می‌دهیم
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {getIcon(service.icon)}
                </div>
                <CardTitle className="text-lg font-semibold text-eyecare-800">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed mb-4">
                  {service.description}
                </CardDescription>
                
                {/* Price Display */}
                <div className="text-center mb-4">
                  <div className="text-lg font-semibold text-primary">
                    {formatPrice(service.price)}
                  </div>
                </div>

                {service.slug && (
                  <div className="text-center">
                    <Link to={`/services/${service.slug}`}>
                      <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors w-full">
                        اطلاعات بیشتر
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/services">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              مشاهده تمام خدمات
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
