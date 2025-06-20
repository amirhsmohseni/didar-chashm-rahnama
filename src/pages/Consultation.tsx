
import { useState, useEffect } from 'react';
import { Calendar, Phone, User, MessageSquare, CheckCircle, Sparkles, Heart, Shield } from 'lucide-react';
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-emerald-400 mx-auto"></div>
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl animate-pulse"></div>
            </div>
            <p className="mt-8 text-emerald-200 text-xl">در حال بارگذاری...</p>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center">
          <div className="container max-w-md text-center">
            <Card className="glass-effect border-emerald-400/30 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-lg glow-animation">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-white">درخواست ارسال شد</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-emerald-200 text-lg leading-relaxed">
                  درخواست مشاوره شما با موفقیت ثبت شد. ما در اسرع وقت با شما تماس خواهیم گرفت.
                </p>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl text-lg"
                    onClick={() => navigate('/')}
                  >
                    بازگشت به صفحه اصلی
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-slate-900 py-3 rounded-xl"
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
      
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-cyan-600/90"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
          
          <div className="relative container py-20 text-center">
            <div className="mb-6 inline-flex items-center gap-2 px-6 py-3 rounded-full glass-effect text-emerald-200">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">مشاوره رایگان و تخصصی</span>
            </div>
            
            <MessageSquare className="h-20 w-20 mx-auto mb-8 text-white float-animation" />
            <h1 className="text-5xl font-bold mb-6 text-white">درخواست مشاوره</h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              برای دریافت مشاوره تخصصی و رایگان، فرم زیر را تکمیل کنید
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="container py-20">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-effect border-emerald-400/30 shadow-2xl">
              <CardHeader className="text-center">
                <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-medium">مشاوره رایگان</span>
                </div>
                <CardTitle className="text-3xl text-white">درخواست مشاوره رایگان</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-emerald-300 font-medium mb-3 text-lg">
                        نام و نام خانوادگی <span className="text-red-400">*</span>
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="نام کامل خود را وارد کنید"
                        className="bg-slate-800/50 border-emerald-400/30 text-white placeholder:text-gray-400 h-12 rounded-xl focus:border-emerald-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-emerald-300 font-medium mb-3 text-lg">
                        شماره تماس <span className="text-red-400">*</span>
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="09xxxxxxxxx"
                        className="bg-slate-800/50 border-emerald-400/30 text-white placeholder:text-gray-400 h-12 rounded-xl focus:border-emerald-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-emerald-300 font-medium mb-3 text-lg">شرح مشکل (اختیاری)</label>
                    <Textarea
                      value={formData.medical_condition}
                      onChange={(e) => setFormData({...formData, medical_condition: e.target.value})}
                      placeholder="لطفاً مشکل چشمی خود را به طور خلاصه شرح دهید..."
                      className="bg-slate-800/50 border-emerald-400/30 text-white placeholder:text-gray-400 min-h-24 rounded-xl focus:border-emerald-400"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-300 font-medium mb-3 text-lg">انتخاب پزشک (اختیاری)</label>
                    <Select value={formData.doctor_id} onValueChange={(value) => setFormData({...formData, doctor_id: value})}>
                      <SelectTrigger className="bg-slate-800/50 border-emerald-400/30 text-white h-12 rounded-xl focus:border-emerald-400">
                        <SelectValue placeholder="پزشک مورد نظر را انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-emerald-400/30">
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id} className="text-white hover:bg-emerald-500/20">
                            {doctor.name} - {doctor.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-emerald-300 font-medium mb-3 text-lg">توضیحات اضافی (اختیاری)</label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="هر توضیح اضافی که نیاز دارید..."
                      className="bg-slate-800/50 border-emerald-400/30 text-white placeholder:text-gray-400 rounded-xl focus:border-emerald-400"
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 text-xl rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        در حال ارسال...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6" />
                        ارسال درخواست مشاوره
                      </div>
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
