
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Calendar, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';

const Services = () => {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
  });
  
  const services = [
    {
      id: 'lasik',
      title: 'جراحی لازیک',
      description: 'روشی محبوب برای اصلاح عیوب انکساری چشم با استفاده از لیزر که نتایج سریع و درد کمی دارد.',
      icon: <Eye className="h-10 w-10 text-primary" />,
    },
    {
      id: 'femtosmile',
      title: 'جراحی فمتو اسمایل',
      description: 'روش پیشرفته برای اصلاح عیوب انکساری با حداقل آسیب به قرنیه و بهبودی سریع‌تر.',
      icon: <Eye className="h-10 w-10 text-primary" />,
      image: "/zeiss-visumax-standalone-specularity-frontview_sqaure.jpg"
    },
    {
      id: 'femtolasik',
      title: 'جراحی فمتو لازیک',
      description: 'ترکیب تکنولوژی فمتوسکند لیزر با لازیک برای دقت بیشتر و نتایج بهتر در اصلاح بینایی.',
      icon: <Eye className="h-10 w-10 text-primary" />,
    },
    {
      id: 'transprk',
      title: 'جراحی ترانس PRK',
      description: 'نسل جدید جراحی PRK با بهبودی سریع‌تر و راحتی بیشتر برای بیمار.',
      icon: <Eye className="h-10 w-10 text-primary" />,
    },
    {
      id: 'prk',
      title: 'جراحی PRK',
      description: 'روش کلاسیک اصلاح بینایی که برای برخی از افراد که کاندید لازیک نیستند مناسب است.',
      icon: <Eye className="h-10 w-10 text-primary" />,
    },
    {
      id: 'checkup',
      title: 'معاینات چشم و اپتومتری',
      description: 'خدمات جامع معاینه چشم برای ارزیابی سلامت و بینایی چشم‌ها.',
      icon: <Eye className="h-10 w-10 text-primary" />,
    },
    {
      id: 'eyewear',
      title: 'عینک طبی و فروش لوازم چشمی',
      description: 'تجویز و ارائه انواع عینک‌های طبی و لنزهای تماسی با کیفیت بالا.',
      icon: <Eye className="h-10 w-10 text-primary" />,
    },
  ];

  const handleQuickBooking = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = () => {
    if (!bookingData.name || !bookingData.phone) {
      toast({
        title: "خطا",
        description: "لطفاً نام و شماره تلفن خود را وارد کنید.",
        variant: "destructive",
      });
      return;
    }

    const serviceName = services.find(s => s.id === selectedService)?.title;
    
    toast({
      title: "درخواست ثبت شد",
      description: `درخواست نوبت برای خدمات ${serviceName} ثبت شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.`,
    });
    
    setIsBookingOpen(false);
    setBookingData({ name: '', phone: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Header />
      
      <div className="bg-secondary">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">خدمات جراحی چشم</h1>
          <p className="text-muted-foreground">
            بهترین خدمات جراحی و درمان چشم زیر نظر متخصصین برجسته
          </p>
          
          <div className="mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  انتخاب سریع خدمات
                  <ChevronDown className="mr-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {services.map((service) => (
                  <DropdownMenuItem key={service.id} onSelect={() => {
                    const element = document.getElementById(service.id);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    {service.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="transition-all hover:shadow-md" id={service.id}>
                <CardHeader>
                  <div className="mb-4 flex items-center justify-center bg-primary/10 p-3 rounded-full w-16 h-16">
                    {service.icon}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {service.image && (
                    <div className="mb-4">
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-auto rounded-md"
                      />
                    </div>
                  )}
                  <CardDescription className="text-base text-foreground/80">
                    {service.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="w-full sm:w-auto" asChild>
                    <Link to="/consultation">
                      درخواست مشاوره
                    </Link>
                  </Button>
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={() => handleQuickBooking(service.id)}
                  >
                    رزرو مستقیم
                    <Calendar className="mr-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="section bg-eyecare-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">آیا برای جراحی چشم نیاز به مشاوره دارید؟</h2>
            <p className="text-lg text-muted-foreground mb-8">
              تیم مشاوره ما آماده پاسخگویی به تمامی سوالات شما درباره انواع جراحی‌های چشم، هزینه‌ها، و معرفی بهترین متخصصان است.
            </p>
            <Button size="lg" className="mx-auto" asChild>
              <Link to="/consultation">
                درخواست مشاوره رایگان
                <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>رزرو نوبت</DialogTitle>
            <DialogDescription>
              لطفا اطلاعات خود را وارد کنید. کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">نام و نام خانوادگی *</Label>
              <Input 
                id="name" 
                name="name"
                value={bookingData.name}
                onChange={handleInputChange}
                placeholder="نام و نام خانوادگی خود را وارد کنید"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">شماره تماس *</Label>
              <Input 
                id="phone" 
                name="phone"
                value={bookingData.phone}
                onChange={handleInputChange}
                placeholder="مثال: 09123456789"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleBookingSubmit}>تأیید و ارسال</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default Services;
