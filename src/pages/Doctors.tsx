
import { useState, useEffect } from 'react';
import { Stethoscope, Award, Calendar, Phone, Mail, RefreshCw } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience_years: number;
  education: string | null;
  image_url: string | null;
  bio: string | null;
  is_featured: boolean;
  is_active: boolean;
  consultation_fee: number | null;
}

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching all doctors...');
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching doctors:', error);
        throw error;
      }
      
      console.log('All doctors data:', data);
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsultationRequest = (doctorId: string) => {
    navigate(`/consultation?doctor=${doctorId}`);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-secondary flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">در حال بارگذاری پزشکان...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="bg-secondary min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary to-primary/80 text-white py-16">
          <div className="container text-center">
            <Stethoscope className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">پزشکان متخصص ما</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              با بهترین متخصصان چشم کشور آشنا شوید و درخواست مشاوره ارسال کنید
            </p>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="container py-16">
          {doctors.length === 0 ? (
            <div className="text-center py-16">
              <Stethoscope className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">هیچ پزشکی یافت نشد</h3>
              <p className="text-muted-foreground mb-4">در حال حاضر هیچ پزشک فعالی ثبت نشده است.</p>
              <Button onClick={fetchDoctors} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                بازخوانی
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    {doctor.image_url ? (
                      <img
                        src={doctor.image_url}
                        alt={doctor.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                        onError={(e) => {
                          console.log('Image failed to load:', doctor.image_url);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="h-16 w-16 text-primary" />
                      </div>
                    )}
                    <CardTitle className="text-xl">{doctor.name}</CardTitle>
                    <p className="text-primary font-medium">{doctor.specialty}</p>
                    {doctor.is_featured && (
                      <Badge variant="destructive" className="w-fit mx-auto mt-2">
                        <Award className="h-3 w-3 mr-1" />
                        پزشک برجسته
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 ml-2" />
                        {doctor.experience_years} سال تجربه
                      </div>
                      
                      {doctor.education && (
                        <div className="text-sm">
                          <span className="font-medium">تحصیلات:</span>
                          <p className="text-muted-foreground mt-1">{doctor.education}</p>
                        </div>
                      )}

                      {doctor.bio && (
                        <div className="text-sm">
                          <span className="font-medium">درباره دکتر:</span>
                          <p className="text-muted-foreground mt-1 line-clamp-3">{doctor.bio}</p>
                        </div>
                      )}

                      {doctor.consultation_fee && (
                        <div className="text-sm">
                          <span className="font-medium">هزینه ویزیت:</span>
                          <p className="text-primary font-medium mt-1">
                            {doctor.consultation_fee.toLocaleString()} تومان
                          </p>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full mt-6"
                      onClick={() => handleConsultationRequest(doctor.id)}
                    >
                      <Phone className="h-4 w-4 ml-2" />
                      درخواست مشاوره
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Doctors;
