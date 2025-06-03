
import { useState, useEffect } from 'react';
import { Stethoscope, Award, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience_years: number;
  image_url: string | null;
  bio: string | null;
}

const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedDoctors();
  }, []);

  const fetchFeaturedDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialty, experience_years, image_url, bio')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(3);

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching featured doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال بارگذاری پزشکان برجسته...</p>
        </div>
      </section>
    );
  }

  if (doctors.length === 0) {
    return null; // Don't show section if no featured doctors
  }

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">پزشکان برجسته ما</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            آشنایی با برخی از بهترین متخصصان چشم که با ما همکاری می‌کنند
          </p>
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
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="h-12 w-12 text-primary" />
                  </div>
                )}
                <Badge variant="destructive" className="w-fit mx-auto mb-2">
                  <Award className="h-3 w-3 mr-1" />
                  پزشک برجسته
                </Badge>
                <CardTitle className="text-xl">{doctor.name}</CardTitle>
                <p className="text-primary font-medium">{doctor.specialty}</p>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 ml-2" />
                  {doctor.experience_years} سال تجربه
                </div>
                
                {doctor.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {doctor.bio}
                  </p>
                )}
                
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/consultation?doctor=${doctor.id}`}>
                    درخواست مشاوره
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/doctors">
              مشاهده همه پزشکان
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
