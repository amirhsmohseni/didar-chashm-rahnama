
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const consultationSchema = z.object({
  fullName: z.string().min(2, { message: "نام و نام خانوادگی باید حداقل 2 حرف باشد" }),
  phone: z.string().min(10, { message: "شماره تلفن باید حداقل 10 رقم باشد" }),
  email: z.string().email({ message: "ایمیل معتبر وارد کنید" }).optional().or(z.literal("")),
  city: z.string().optional(),
  surgeryType: z.string().optional(),
  eyeProblem: z.string().optional(),
  medicalHistory: z.string().optional(),
  preferredContact: z.string().min(1, { message: "روش ارتباطی مورد نظر را انتخاب کنید" }),
  consent: z.boolean().refine((val) => val === true, { message: "باید شرایط را قبول کنید" }),
});

const Consultation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      city: "",
      surgeryType: "",
      eyeProblem: "",
      medicalHistory: "",
      preferredContact: "",
      consent: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof consultationSchema>) => {
    setIsSubmitting(true);
    
    try {
      const requestData = {
        full_name: data.fullName,
        phone: data.phone,
        email: data.email || null,
        city: data.city || null,
        surgery_type: data.surgeryType || null,
        eye_problem: data.eyeProblem || null,
        medical_history: data.medicalHistory || null,
        preferred_contact: data.preferredContact,
      };

      const { error } = await supabase
        .from('consultation_requests' as any)
        .insert([requestData]);

      if (error) throw error;

      toast({
        title: "درخواست ثبت شد",
        description: "درخواست مشاوره شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.",
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast({
        title: "خطا",
        description: "خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <div className="bg-secondary">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">درخواست مشاوره</h1>
          <p className="text-muted-foreground">
            برای دریافت مشاوره تخصصی در زمینه جراحی‌های چشم فرم زیر را تکمیل کنید
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>فرم درخواست مشاوره</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">اطلاعات شخصی</h3>
                      
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>نام و نام خانوادگی *</FormLabel>
                            <FormControl>
                              <Input placeholder="نام و نام خانوادگی خود را وارد کنید" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شماره تماس *</FormLabel>
                              <FormControl>
                                <Input placeholder="09123456789" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ایمیل (اختیاری)</FormLabel>
                              <FormControl>
                                <Input placeholder="example@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>شهر (اختیاری)</FormLabel>
                            <FormControl>
                              <Input placeholder="شهر محل زندگی" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Medical Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">اطلاعات پزشکی</h3>
                      
                      <FormField
                        control={form.control}
                        name="surgeryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>نوع جراحی مورد نظر (اختیاری)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="انتخاب کنید" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="lasik">جراحی لازیک</SelectItem>
                                <SelectItem value="cataract">جراحی آب مروارید</SelectItem>
                                <SelectItem value="retina">جراحی شبکیه</SelectItem>
                                <SelectItem value="cornea">جراحی قرنیه</SelectItem>
                                <SelectItem value="glaucoma">درمان گلوکوم</SelectItem>
                                <SelectItem value="keratoconus">درمان کراتوکونوس</SelectItem>
                                <SelectItem value="color-change">تغییر رنگ چشم</SelectItem>
                                <SelectItem value="other">سایر</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="eyeProblem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>مشکل چشمی فعلی (اختیاری)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="مشکل یا علایمی که دارید را شرح دهید..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="medicalHistory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>سابقه بیماری یا جراحی قبلی (اختیاری)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="سوابق پزشکی مرتبط با چشم یا سایر بیماری‌ها..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Contact Preferences */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">ترجیحات تماس</h3>
                      
                      <FormField
                        control={form.control}
                        name="preferredContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>روش ارتباطی مورد نظر *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="انتخاب کنید" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="phone">تماس تلفنی</SelectItem>
                                <SelectItem value="whatsapp">واتساپ</SelectItem>
                                <SelectItem value="email">ایمیل</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Consent */}
                    <FormField
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              موافقت با شرایط و ضوابط *
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              با ثبت این فرم، موافقت می‌کنم که اطلاعات من برای ارائه مشاوره پزشکی استفاده شود.
                            </p>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "در حال ارسال..." : "ارسال درخواست مشاوره"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">چرا مشاوره آنلاین؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• صرفه‌جویی در وقت و هزینه</li>
                    <li>• دسترسی به متخصصان برتر</li>
                    <li>• مشاوره اولیه رایگان</li>
                    <li>• پاسخ سریع به سوالات</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">مراحل بعدی</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• بررسی درخواست توسط تیم پزشکی</li>
                    <li>• تماس طی 24 ساعت</li>
                    <li>• مشاوره تخصصی</li>
                    <li>• هماهنگی برای ویزیت حضوری</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Consultation;
