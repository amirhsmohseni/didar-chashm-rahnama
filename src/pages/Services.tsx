
import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Heart, Stethoscope, User, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  slug: string | null;
  reading_time: number | null;
  order_index: number | null;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, showFeaturedOnly]);

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      const { data, error } = await supabase
        .from('services')
        .select('id, title, description, icon, image_url, is_featured, is_active, slug, reading_time, order_index')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }

      console.log('Services fetched:', data?.length || 0);
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by featured status
    if (showFeaturedOnly === 'featured') {
      filtered = filtered.filter(service => service.is_featured);
    }

    setFilteredServices(filtered);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری خدمات...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">خدمات ما</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            طیف گسترده‌ای از خدمات تخصصی چشم‌پزشکی با بالاترین کیفیت و تکنولوژی روز دنیا
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="جستجو در خدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <div>
              <Select value={showFeaturedOnly} onValueChange={setShowFeaturedOnly}>
                <SelectTrigger>
                  <SelectValue placeholder="فیلتر خدمات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه خدمات</SelectItem>
                  <SelectItem value="featured">خدمات ویژه</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredServices.length} خدمت یافت شد
          </p>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Stethoscope className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              هیچ خدمتی یافت نشد
            </h3>
            <p className="text-gray-500">
              لطفاً عبارت جستجو یا فیلتر را تغییر دهید
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                {/* Service Image */}
                {service.image_url &&  (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {service.is_featured && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive">ویژه</Badge>
                      </div>
                    )}
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {getIcon(service.icon)}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {service.title}
                  </CardTitle>
                  {service.is_featured && !service.image_url && (
                    <Badge variant="destructive" className="w-fit mx-auto">ویژه</Badge>
                  )}
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </CardDescription>

                  {/* Service Info */}
                  <div className="space-y-2 mb-6">
                    {service.reading_time && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <span>زمان مطالعه: {service.reading_time} دقیقه</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="text-center">
                    {service.slug ? (
                      <Link to={`/services/${service.slug}`}>
                        <Button className="group-hover:bg-primary group-hover:text-white transition-colors w-full">
                          اطلاعات بیشتر
                          <ArrowLeft className="mr-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        بزودی
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Services;
