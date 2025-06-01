
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';

const consultationSchema = z.object({
  fullName: z.string().min(2, { message: "نام و نام خانوادگی الزامی است" }),
  city: z.string().optional(),
  phone: z.string().min(11, { message: "شماره تماس باید حداقل 11 رقم باشد" }),
  email: z.string().email({ message: "ایمیل معتبر وارد کنید" }).optional().or(z.literal("")),
  eyeProblem: z.string().optional(),
  surgeryType: z.string().optional(),
  medicalHistory: z.string().optional(),
  preferredContact: z.enum(["phone", "email", "whatsapp"], {
    required_error: "لطفاً روش ارتباط مورد نظر را انتخاب کنید",
  }),
});

const Consultation = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      fullName: "",
      city: "",
      phone: "",
      email: "",
      eyeProblem: "",
      surgeryType: "",
      medicalHistory: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof consultationSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .insert([{
          full_name: data.fullName,
          city: data.city,
          phone: data.phone,
          email: data.email,
          eye_problem: data.eyeProblem,
          surgery_type: data.surgeryType,
          medical_history: data.medicalHistory,
          preferred_contact: data.preferredContact,
        }]);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "درخواست ثبت شد",
        description: "درخواست شما با موفقیت ثبت شد. در اسرع وقت با شما تماس خواهیم گرفت.",
      });
    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast({
        title: "خطا",
        description: "خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="bg-secondary">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">درخواست مشاوره</h1>
          <p className="text-muted-foreground">
            برای دریافت مشاوره رایگان، فرم زیر را تکمیل کنید
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {isSubmitted ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">درخواست شما ثبت شد</h2>
                    <p className="text-muted-foreground mb-6">
                      تشکر از شما! درخواست مشاوره شما با موفقیت ثبت شد. 
                      کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.
                    </p>
                    <Button 
                      onClick={() => {
                        setIsSubmitted(false);
                        form.reset();
                      }}
                      variant="outline"
                    >
                      ثبت درخواست جدید
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>فرم درخواست مشاوره</CardTitle>
                  <CardDescription>
                    لطفاً اطلاعات زیر را تکمیل کنید تا بتوانیم بهترین مشاوره را به شما ارائه دهیم
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شهر</FormLabel>
                              <FormControl>
                                <Input placeholder="شهر محل سکونت" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شماره تماس *</FormLabel>
                              <FormControl>
                                <Input placeholder="09xxxxxxxxx" {...field} />
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
                              <FormLabel>ایمیل</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="example@email.com" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="preferredContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>روش ارتباط مورد نظر *</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="روش ارتباط مورد نظر خود را انتخاب کنید" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="phone">
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      تماس تلفنی
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="email">
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      ایمیل
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="whatsapp">
                                    <div className="flex items-center gap-2">
                                      <MessageSquare className="h-4 w-4" />
                                      واتساپ
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="eyeProblem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>مشکل چشمی</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="مشکل یا علائم چشمی خود را شرح دهید..."
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
                        name="surgeryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>نوع جراحی مورد نظر</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="در صورت تمایل به جراحی خاص، نام آن را ذکر کنید"
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
                            <FormLabel>سوابق پزشکی</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="سوابق پزشکی، داروهای مصرفی یا بیماری‌های زمینه‌ای..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? "در حال ارسال..." : "ثبت درخواست"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Consultation;
