
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
    email: '',
    phone: '',
    age: '',
    gender: '',
    medical_condition: '',
    doctor_id: searchParams.get('doctor') || '',
    preferred_date: '',
    preferred_time: '',
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
    
    if (!formData.name || !formData.email || !formData.phone || !formData.medical_condition) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای ضروری را پر کنید",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        doctor_id: formData.doctor_id || null,
        preferred_date: formData.preferred_date || null,
        preferred_time: formData.preferred_time || null,
        notes: formData.notes || null,
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
                        email: '',
                        phone: '',
                        age: '',
                        gender: '',
                        medical_condition: '',
                        doctor_id: '',
                        preferred_date: '',
                        preferred_time: '',
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
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات درخواست مشاوره</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" />
                      اطلاعات شخصی
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">نام و نام خانوادگی *</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="نام کامل خود را وارد کنید"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">شماره تماس *</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="09xxxxxxxxx"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">ایمیل *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="example@email.com"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">سن</label>
                        <Input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                          placeholder="سن شما"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">جنسیت</label>
                        <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="انتخاب کنید" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="مرد">مرد</SelectItem>
                            <SelectItem value="زن">زن</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">اطلاعات پزشکی</h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">شرح مشکل پزشکی *</label>
                      <Textarea
                        value={formData.medical_condition}
                        onChange={(e) => setFormData({...formData, medical_condition: e.target.value})}
                        placeholder="لطفاً مشکل چشمی خود را به تفصیل شرح دهید..."
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">انتخاب پزشک</label>
                      <Select value={formData.doctor_id} onValueChange={(value) => setFormData({...formData, doctor_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="پزشک مورد نظر را انتخاب کنید (اختیاری)" />
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
                  </div>

                  {/* Appointment Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      ترجیحات زمان ملاقات
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">تاریخ مورد نظر</label>
                        <Input
                          type="date"
                          value={formData.preferred_date}
                          onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ساعت مورد نظر</label>
                        <Input
                          type="time"
                          value={formData.preferred_time}
                          onChange={(e) => setFormData({...formData, preferred_time: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-1">توضیحات اضافی</label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="هر توضیح اضافی که نیاز دارید..."
                      rows={3}
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
