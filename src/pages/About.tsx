
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, Phone, Mail, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";

const About = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "لطفا تمام فیلدها را پر کنید",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    try {
      console.log("Contact form submitted:", formData);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "پیام شما با موفقیت ارسال شد",
        description: "به زودی با شما تماس خواهیم گرفت",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: "خطا در ارسال پیام",
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

      {/* Hero Section */}
      <div className="bg-secondary">
        <div className="container py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">درباره دیدار چشم رهنما</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            ما بیماران را به بهترین جراحان چشم ایران متصل می‌کنیم و در تمام مراحل درمان کنار شما هستیم.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">ماموریت ما</h2>
              <p className="text-muted-foreground mb-6">
                ماموریت ما در دیدار چشم رهنما، کمک به بیماران برای دریافت بهترین خدمات جراحی چشم است. ما معتقدیم که هر فرد باید به بهترین متخصصان دسترسی داشته باشد، بدون اینکه نگران یافتن پزشک مناسب باشد.
              </p>
              <p className="text-muted-foreground mb-6">
                ما با ارائه مشاوره تخصصی و رایگان، معرفی به بهترین پزشکان و پیگیری پس از جراحی، اطمینان حاصل می‌کنیم که بیماران بهترین تجربه و نتیجه ممکن را دریافت می‌کنند.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <p>بیش از 500 بیمار با موفقیت به پزشکان معرفی شده‌اند</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <p>همکاری با بیش از 30 پزشک و جراح متخصص در سراسر ایران</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <p>رضایت 98 درصدی بیماران از خدمات ما</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img src="/placeholder.svg" alt="دیدار چشم رهنما" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">نحوه کار ما</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              فرآیند ساده و موثر ما برای اطمینان از بهترین تجربه درمانی
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "مشاوره تخصصی",
                description: "درخواست مشاوره رایگان خود را ارسال کنید. کارشناسان ما با بررسی اطلاعات و در صورت نیاز تماس با شما، به تمام سوالات شما پاسخ می‌دهند."
              },
              {
                step: "02",
                title: "معرفی به پزشک",
                description: "بر اساس نیاز شما، بهترین و مناسب‌ترین پزشک متخصص را معرفی می‌کنیم. ما تنها با پزشکانی همکاری می‌کنیم که سابقه درخشانی در زمینه تخصصی خود دارند."
              },
              {
                step: "03",
                title: "پیگیری و حمایت",
                description: "پس از انجام جراحی، تیم ما روند بهبودی شما را پیگیری می‌کند تا از نتیجه عالی و رضایت کامل شما اطمینان حاصل کند."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg relative">
                <div className="absolute top-4 right-4 text-3xl font-bold text-eyecare-100">
                  {item.step}
                </div>
                <div className="pt-12">
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link to="/consultation">درخواست مشاوره رایگان</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">تیم ما</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              تیم متخصص و باتجربه دیدار چشم رهنما، آماده کمک به شما در مسیر سلامت چشم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "دکتر زهرا کریمی",
                role: "مشاور ارشد پزشکی",
                bio: "دارای بیش از 8 سال سابقه در زمینه چشم‌پزشکی و مشاوره بیماران",
                imgUrl: "/placeholder.svg"
              },
              {
                name: "مهندس علی محمدی",
                role: "مدیر عامل",
                bio: "بنیانگذار دیدار چشم رهنما با هدف بهبود دسترسی به خدمات چشم‌پزشکی با کیفیت",
                imgUrl: "/placeholder.svg"
              },
              {
                name: "مهسا رضایی",
                role: "کارشناس ارتباط با بیماران",
                bio: "متخصص در پاسخگویی به نیازهای بیماران و هماهنگی با پزشکان",
                imgUrl: "/placeholder.svg"
              }
            ].map((person, index) => (
              <div key={index} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square relative">
                  <img 
                    src={person.imgUrl} 
                    alt={person.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{person.name}</h3>
                  <p className="text-primary mb-2">{person.role}</p>
                  <p className="text-sm text-muted-foreground">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-eyecare-800 text-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">تماس با ما</h2>
              <p className="mb-6">
                برای پاسخگویی به سوالات، دریافت مشاوره یا ارائه بازخورد، با ما در ارتباط باشید.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-eyecare-700 p-3 rounded-full">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">شماره تماس</p>
                    <a href="tel:+989123456789" className="text-lg hover:text-primary transition-colors">۰۹۱۲۳۴۵۶۷۸۹</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-eyecare-700 p-3 rounded-full">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">ایمیل</p>
                    <a href="mailto:info@eyecare.ir" className="text-lg hover:text-primary transition-colors">info@eyecare.ir</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-eyecare-700 p-3 rounded-full">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">واتساپ</p>
                    <a href="https://wa.me/989123456789" className="text-lg hover:text-primary transition-colors">۰۹۱۲۳۴۵۶۷۸۹</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-eyecare-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">ارسال پیام</h3>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm">نام و نام خانوادگی</label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-eyecare-600 border-eyecare-500 text-white placeholder:text-gray-400"
                        placeholder="نام خود را وارد کنید"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm">ایمیل</label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-eyecare-600 border-eyecare-500 text-white placeholder:text-gray-400"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block mb-2 text-sm">پیام</label>
                      <Textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="bg-eyecare-600 border-eyecare-500 text-white placeholder:text-gray-400 min-h-[120px]"
                        placeholder="پیام خود را وارد کنید"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-white text-eyecare-800 hover:bg-gray-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
