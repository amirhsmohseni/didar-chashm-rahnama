
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .limit(4)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching doctors:', error);
        return;
      }

      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">پزشکان برتر</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              در حال بارگذاری...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">پزشکان برتر</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            پزشکان متخصص و با تجربه که با دقت انتخاب شده‌اند تا بهترین خدمات چشم‌پزشکی را به شما ارائه دهند
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={doctor.img_url || '/placeholder.svg'} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                <p className="text-primary mb-1">{doctor.specialty}</p>
                {doctor.subspecialty && (
                  <p className="text-sm text-muted-foreground mb-1">{doctor.subspecialty}</p>
                )}
                <p className="text-sm text-muted-foreground mb-2">{doctor.city}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {doctor.expertise?.slice(0, 2).map((item: string, index: number) => (
                    <span key={index} className="text-xs bg-secondary rounded-full px-3 py-1">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link to="/doctors">
              مشاهده همه پزشکان
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
