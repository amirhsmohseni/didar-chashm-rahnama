
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('doctors')
        .select('*')
        .limit(4);

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  return (
    <section className="section bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">پزشکان برجسته</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            پزشکان متخصص و با تجربه‌ای که با دقت انتخاب شده‌اند تا بهترین خدمات را به شما ارائه دهند
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg border p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-secondary">
                {doctor.img_url ? (
                  <img 
                    src={doctor.img_url} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <span className="text-muted-foreground">عکس</span>
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{doctor.name}</h3>
              <p className="text-primary mb-1">{doctor.specialty}</p>
              <p className="text-sm text-muted-foreground mb-3">{doctor.subspecialty}</p>
              <p className="text-sm text-muted-foreground">{doctor.city}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/doctors" 
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            مشاهده همه پزشکان
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
