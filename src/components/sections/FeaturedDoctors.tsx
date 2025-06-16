
import { useState, useEffect } from 'react';
import { Star, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string | null;
  experience_years: number;
  image_url: string | null;
  consultation_fee: number | null;
  is_active: boolean;
  is_featured: boolean;
}

const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchFeaturedDoctors();
  }, []);

  const fetchFeaturedDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching featured doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, doctors.length));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + doctors.length) % Math.max(1, doctors.length));
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">در حال بارگذاری پزشکان...</p>
          </div>
        </div>
      </section>
    );
  }

  if (doctors.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">پزشکان برجسته</h2>
            <p className="text-muted-foreground">در حال حاضر پزشک برجسته‌ای ثبت نشده است</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">پزشکان برجسته</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            آشنایی با بهترین متخصصان چشم که آماده ارائه خدمات درمانی و مشاوره به شما هستند
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg"
            onClick={prevSlide}
            disabled={doctors.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg"
            onClick={nextSlide}
            disabled={doctors.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Doctors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-12">
            {doctors.slice(currentIndex, currentIndex + 3).map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow group">
                <CardContent className="p-6 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary/20">
                    <AvatarImage src={doctor.image_url || ''} alt={doctor.name} />
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                      {doctor.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
                  <p className="text-primary font-medium mb-2">{doctor.specialty}</p>
                  
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {doctor.experience_years} سال سابقه
                    </span>
                  </div>
                  
                  {doctor.bio && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {doctor.bio}
                    </p>
                  )}
                  
                  {doctor.consultation_fee && (
                    <div className="text-sm text-green-600 font-medium mb-4">
                      هزینه ویزیت: {doctor.consultation_fee.toLocaleString()} تومان
                    </div>
                  )}
                  
                  <Button 
                    asChild 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Link to="/consultation">
                      <Calendar className="h-4 w-4 mr-2" />
                      رزرو نوبت
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
            <Link to="/doctors">
              مشاهده همه پزشکان
              <ChevronLeft className="h-4 w-4 mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
