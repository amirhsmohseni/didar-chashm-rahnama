
import { useState, useEffect } from 'react';
import { Calendar, Phone, User, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience_years: number;
  image_url: string | null;
  bio: string | null;
}

const Consultation = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    medical_condition: '',
    doctor_id: searchParams.get('doctor') || '',
    notes: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت لیست پزشکان",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "خطا",
        description: "لطفاً نام و شماره تماس را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        name: formData.name,
        phone: formData.phone,
        medical_condition: formData.medical_condition || null,
        doctor_id: formData.doctor_id || null,
        notes: formData.notes || null,
        email: null,
        age: null,
        gender: null,
        preferred_date: null,
        preferred_time: null,
      };

      const { error } = await supabase
        .from('consultation_requests')
        .insert([submitData]);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "درخواست ارسال شد",
        description: "درخواست مشاوره شما با موفقیت ثبت شد",
      });

    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast({
        title: "خطا",
        description: "خطا در ارسال درخواست",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-secondary flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-secondary flex items-center justify-center">
          <div className="container max-w-md text-center">
            <Card>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">درخواست ارسال شد</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  درخواست مشاوره شما با موفقیت ثبت شد. ما در اسرع وقت با شما تماس خواهیم گرفت.
                </p>
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/')}
                  >
                    بازگشت به صفحه اصلی
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: '',
                        phone: '',
                        medical_condition: '',
                        doctor_id: '',
                        notes: '',
                      });
                    }}
                  >
                    ارسال درخواست جدید
                  </Button>
                </div>
              </CardContent>
            </Card>
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
            <MessageSquare className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">درخواست مشاوره</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              برای دریافت مشاوره تخصصی، فرم زیر را تکمیل کنید
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="container py-16">
          <div className="max-w-lg mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>درخواست مشاوره رایگان</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      نام و نام خانوادگی <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="نام کامل خود را وارد کنید"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      شماره تماس <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="09xxxxxxxxx"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">شرح مشکل (اختیاری)</label>
                    <Textarea
                      value={formData.medical_condition}
                      onChange={(e) => setFormData({...formData, medical_condition: e.target.value})}
                      placeholder="لطفاً مشکل چشمی خود را به طور خلاصه شرح دهید..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">انتخاب پزشک (اختیاری)</label>
                    <Select value={formData.doctor_id} onValueChange={(value) => setFormData({...formData, doctor_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="پزشک مورد نظر را انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">توضیحات اضافی (اختیاری)</label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="هر توضیح اضافی که نیاز دارید..."
                      rows={2}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'در حال ارسال...' : 'ارسال درخواست مشاوره'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Consultation;
