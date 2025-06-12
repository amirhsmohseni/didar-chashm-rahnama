
import { useState, useEffect } from 'react';
import { Star, Award, Calendar, MapPin, Phone, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string | null;
  education: string | null;
  experience_years: number;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  consultation_fee: number | null;
}

const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    fetchDoctors();
  }, [lastUpdate]);

  const fetchDoctors = async () => {
    try {
      console.log('FeaturedDoctors: Fetching featured doctors...', new Date().toISOString());
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialty, bio, education, experience_years, image_url, is_featured, is_active, consultation_fee')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('FeaturedDoctors: Error fetching doctors:', error);
        throw error;
      }
      
      console.log('FeaturedDoctors: Featured doctors data:', data);
      setDoctors(data || []);
    } catch (error) {
      console.error('FeaturedDoctors: Error fetching featured doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    console.log('FeaturedDoctors: Manual refresh triggered');
    setIsLoading(true);
    setLastUpdate(Date.now());
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">در حال بارگذاری پزشکان...</p>
          </div>
        </div>
      </section>
    );
  }

  if (doctors.length === 0) {
    console.log('FeaturedDoctors: No featured doctors found');
    return (
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-eyecare-800 mb-4">پزشکان متخصص ما</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              با بهترین متخصصان چشم‌پزشکی کشور آشنا شوید
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground mb-4">در حال حاضر هیچ پزشک برجسته‌ای موجود نیست</p>
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              بازخوانی
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-eyecare-800 mb-4">پزشکان متخصص ما</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            با بهترین متخصصان چشم‌پزشکی کشور آشنا شوید
          </p>
          <Button onClick={refreshData} variant="ghost" size="sm" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            بروزرسانی اطلاعات
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                {doctor.image_url ? (
                  <img
                    src={doctor.image_url}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    onError={(e) => {
                      console.log('FeaturedDoctors: Image failed to load:', doctor.image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center">
                    <Star className="h-12 w-12 text-primary" />
                  </div>
                )}
                <CardTitle className="text-xl">{doctor.name}</CardTitle>
                <p className="text-primary font-medium">{doctor.specialty}</p>
                <Badge variant="destructive" className="w-fit mx-auto">
                  <Award className="h-3 w-3 mr-1" />
                  پزشک برجسته
                </Badge>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <Calendar className="h-4 w-4 ml-2" />
                    {doctor.experience_years} سال تجربه
                  </div>
                  
                  {doctor.education && (
                    <p className="text-center">{doctor.education}</p>
                  )}

                  {doctor.bio && (
                    <p className="text-center line-clamp-2">{doctor.bio}</p>
                  )}

                  {doctor.consultation_fee && (
                    <div className="text-center font-medium text-primary">
                      هزینه ویزیت: {doctor.consultation_fee.toLocaleString()} تومان
                    </div>
                  )}
                </div>

                <Link to={`/consultation?doctor=${doctor.id}`} className="block mt-4">
                  <Button className="w-full">
                    <Phone className="h-4 w-4 ml-2" />
                    درخواست مشاوره
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/doctors">
            <Button size="lg" variant="outline">
              مشاهده همه پزشکان
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
