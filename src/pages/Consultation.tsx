
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, Upload, User, Phone, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  fullName: z.string().min(3, { message: "نام و نام خانوادگی باید حداقل 3 حرف باشد" }),
  city: z.string().min(2, { message: "لطفا شهر خود را وارد کنید" }),
  phone: z.string().min(10, { message: "شماره تماس معتبر نیست" }),
  email: z.string().email({ message: "ایمیل معتبر نیست" }).optional().or(z.literal('')),
  eyeProblem: z.string().min(5, { message: "لطفا مشکل چشمی خود را توضیح دهید" }),
  surgeryType: z.string().optional(),
  medicalHistory: z.string().optional(),
  preferredContact: z.enum(["phone", "email", "whatsapp"], {
    required_error: "لطفا روش ارتباطی مورد نظر خود را انتخاب کنید",
  }),
});

const Consultation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      city: "",
      phone: "",
      email: "",
      eyeProblem: "",
      surgeryType: "",
      medicalHistory: "",
      preferredContact: "phone",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file && file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطا",
        description: "اندازه فایل باید کمتر از 5 مگابایت باشد",
        variant: "destructive",
      });
      setSelectedFile(null);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Simulate API call
    try {
      console.log("Form data submitted:", data);
      console.log("File:", selectedFile);
      
      // Simulating a delay for API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setIsSuccess(true);
      toast({
        title: "درخواست ثبت شد",
        description: "مشاوران ما به زودی با شما تماس خواهند گرفت",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "خطا در ارسال فرم",
        description: "لطفا دوباره تلاش کنید",
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
          <h1 className="text-3xl font-bold mb-2">درخواست مشاوره رایگان</h1>
          <p className="text-muted-foreground">
            فرم زیر را تکمیل کنید تا مشاوران ما با شما تماس بگیرند
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {isSuccess ? (
                <div className="bg-white p-8 rounded-lg border text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">درخواست شما با موفقیت ثبت شد</h2>
                  <p className="text-lg mb-6">
                    از اینکه دیدار چشم رهنما را انتخاب کرده‌اید متشکریم. مشاوران ما در اسرع وقت با شما تماس خواهند گرفت.
                  </p>
                  <Button onClick={() => setIsSuccess(false)}>ثبت درخواست جدید</Button>
                </div>
              ) : (
                <div className="bg-white p-6 md:p-8 rounded-lg border">
                  <h2 className="text-xl font-semibold mb-6">اطلاعات خود را وارد کنید</h2>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <FormLabel>شهر *</FormLabel>
                              <FormControl>
                                <Input placeholder="شهر خود را وارد کنید" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>شماره تماس *</FormLabel>
                              <FormControl>
                                <Input placeholder="مثال: 09123456789" {...field} />
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
                                <Input placeholder="email@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="eyeProblem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>مشکل چشمی یا علائم *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="لطفا مشکل چشمی یا علائمی که دارید را توضیح دهید"
                                className="min-h-[120px]"
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
                            <FormLabel>نوع جراحی مورد نظر (اختیاری)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="نوع جراحی مورد نظر خود را انتخاب کنید" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="lasik">لازیک</SelectItem>
                                <SelectItem value="prk">PRK</SelectItem>
                                <SelectItem value="cataract">آب مروارید</SelectItem>
                                <SelectItem value="keratopigmentation">کراتوپیگمنتیشن</SelectItem>
                                <SelectItem value="keratoconus">کراتوکونوس</SelectItem>
                                <SelectItem value="other">سایر موارد</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="medicalHistory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>سوابق پزشکی (اختیاری)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="سوابق پزشکی یا بیماری‌های زمینه‌ای خود را ذکر کنید"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          آپلود مدارک پزشکی (اختیاری)
                        </label>
                        <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-secondary/50 transition-colors">
                          <input
                            type="file"
                            id="file-upload"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm mb-1">فایل خود را به اینجا بکشید یا کلیک کنید</p>
                            <p className="text-xs text-muted-foreground">فرمت‌های مجاز: PDF, JPG, PNG (حداکثر 5MB)</p>
                          </label>
                          {selectedFile && (
                            <div className="mt-3 text-sm bg-secondary p-2 rounded">
                              <p className="truncate">{selectedFile.name}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="preferredContact"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>روش ارتباطی ترجیحی *</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-wrap gap-4"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0 space-x-reverse">
                                  <FormControl>
                                    <RadioGroupItem value="phone" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">تماس تلفنی</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0 space-x-reverse">
                                  <FormControl>
                                    <RadioGroupItem value="whatsapp" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">واتساپ</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0 space-x-reverse">
                                  <FormControl>
                                    <RadioGroupItem value="email" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">ایمیل</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                        {isSubmitting ? 'در حال ارسال...' : 'ارسال درخواست مشاوره'}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
            </div>

            <div>
              <div className="bg-eyecare-50 rounded-lg p-6 border border-eyecare-100 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">چرا دیدار چشم رهنما؟</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-eyecare-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">مشاوره تخصصی رایگان</h4>
                      <p className="text-sm text-muted-foreground">
                        مشاوره با کارشناسان ما کاملا رایگان و بدون هیچ هزینه‌ای است.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-eyecare-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">معرفی به پزشکان متخصص</h4>
                      <p className="text-sm text-muted-foreground">
                        شما را به بهترین پزشکان متناسب با نیاز شما معرفی می‌کنیم.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-eyecare-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">پیگیری پس از جراحی</h4>
                      <p className="text-sm text-muted-foreground">
                        تیم ما پس از جراحی، روند بهبودی شما را پیگیری می‌کند.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-eyecare-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">محرمانگی اطلاعات</h4>
                      <p className="text-sm text-muted-foreground">
                        اطلاعات شما در نهایت محرمانگی نگهداری می‌شود.
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-eyecare-600" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">نام مشاور:</p>
                      <p className="font-medium">دکتر زهرا کریمی</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-eyecare-600" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">شماره تماس:</p>
                      <p className="font-medium">۰۹۱۲۳۴۵۶۷۸۹</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-eyecare-600" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">ایمیل:</p>
                      <p className="font-medium">info@eyecare.ir</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Consultation;
