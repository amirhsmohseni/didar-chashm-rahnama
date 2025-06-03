
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Phone, User, Calendar, Clock, Stethoscope } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
}

const Consultation = () => {
  const [searchParams] = useSearchParams();
  const selectedDoctorId = searchParams.get('doctor');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    medical_condition: '',
    doctor_id: selectedDoctorId || '',
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
        .select('id, name, specialty')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('consultation_requests')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender || null,
          medical_condition: formData.medical_condition,
          doctor_id: formData.doctor_id || null,
          preferred_date: formData.preferred_date || null,
          preferred_time: formData.preferred_time || null,
          notes: formData.notes || null,
        }]);

      if (error) throw error;

      toast({
        title: "درخواست ارسال شد",
        description: "درخواست مشاوره شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.",
      });

      // Reset form
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

    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast({
        title: "خطا در ارسال",
        description: "خطا در ثبت درخواست. لطفا مجددا تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              فرم زیر را تکمیل کنید تا کارشناسان ما در اسرع وقت با شما تماس بگیرند
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="container py-16">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  اطلاعات درخواست مشاوره
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      اطلاعات شخصی
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
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

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">سن</label>
                        <Input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                          placeholder="سن شما"
                          min="1"
                          max="120"
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
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      اطلاعات پزشکی
                    </h3>

                    <div>
                      <label className="block text-sm font-medium mb-1">پزشک مورد نظر</label>
                      <Select value={formData.doctor_id} onValueChange={(value) => setFormData({...formData, doctor_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب پزشک (اختیاری)" />
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
                      <label className="block text-sm font-medium mb-1">شرح مشکل پزشکی *</label>
                      <Textarea
                        value={formData.medical_condition}
                        onChange={(e) => setFormData({...formData, medical_condition: e.target.value})}
                        placeholder="لطفا مشکل چشمی خود را به تفصیل شرح دهید..."
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  {/* Appointment Preferences */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      ترجیحات وقت ملاقات
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
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

                    <div>
                      <label className="block text-sm font-medium mb-1">توضیحات اضافی</label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="هر توضیح اضافی که لازم است..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        در حال ارسال...
                      </div>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 ml-2" />
                        ارسال درخواست مشاوره
                      </>
                    )}
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
