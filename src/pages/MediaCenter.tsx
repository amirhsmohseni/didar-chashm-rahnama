
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Image, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const MediaCenter = () => {
  const [activeTab, setActiveTab] = useState('videos');

  const videos = [
    {
      id: 'video1',
      title: 'جراحی لازیک چیست؟',
      thumbnail: '/placeholder.svg',
      duration: '4:30',
      description: 'در این ویدیو، مراحل و جزئیات جراحی لازیک توضیح داده شده است.'
    },
    {
      id: 'video2',
      title: 'تفاوت لازیک و PRK',
      thumbnail: '/placeholder.svg',
      duration: '5:45',
      description: 'مقایسه دو روش رایج جراحی چشم و مزایا و معایب هر کدام.'
    },
    {
      id: 'video3',
      title: 'مراقبت‌های پس از جراحی',
      thumbnail: '/placeholder.svg',
      duration: '3:20',
      description: 'نکاتی که بیماران بعد از جراحی چشم باید رعایت کنند.'
    },
    {
      id: 'video4',
      title: 'نحوه معاینه چشم پزشکی',
      thumbnail: '/placeholder.svg',
      duration: '7:15',
      description: 'آشنایی با مراحل معاینه چشم و بررسی‌های لازم قبل از جراحی.'
    }
  ];

  const results = [
    {
      id: 'result1',
      title: 'نتیجه جراحی لازیک',
      before: '/placeholder.svg',
      after: '/placeholder.svg',
      condition: 'نزدیک‌بینی شدید',
      improvement: 'بهبود بینایی از 20/400 به 20/20'
    },
    {
      id: 'result2',
      title: 'نتیجه جراحی آب مروارید',
      before: '/placeholder.svg',
      after: '/placeholder.svg',
      condition: 'آب مروارید پیشرفته',
      improvement: 'بهبود کامل وضوح و رنگ بینایی'
    },
    {
      id: 'result3',
      title: 'نتیجه جراحی PRK',
      before: '/placeholder.svg',
      after: '/placeholder.svg',
      condition: 'آستیگماتیسم و نزدیک‌بینی',
      improvement: 'بهبود بینایی به حالت طبیعی'
    }
  ];

  const testimonials = [
    {
      id: 'testimonial1',
      name: 'محمد رضایی',
      photo: '/placeholder.svg',
      procedure: 'جراحی لازیک',
      quote: 'من با نمره چشم -4.5 جراحی لازیک انجام دادم و الان بدون عینک و با وضوح کامل می‌بینم. از تیم دیدار چشم رهنما بسیار ممنونم که بهترین دکتر را به من معرفی کردند.'
    },
    {
      id: 'testimonial2',
      name: 'سارا محمدی',
      photo: '/placeholder.svg',
      procedure: 'جراحی فمتو اسمایل',
      quote: 'تیم مشاوره دیدار چشم رهنما با دقت زیادی نیاز من را ارزیابی کردند و مناسب‌ترین روش جراحی را پیشنهاد دادند. پس از جراحی، مرتب پیگیر وضعیت من بودند و واقعا احساس حمایت کردم.'
    },
    {
      id: 'testimonial3',
      name: 'علی اکبری',
      photo: '/placeholder.svg',
      procedure: 'جراحی آب مروارید',
      quote: 'بعد از سال‌ها مشکل آب مروارید، با مشاوره و راهنمایی دیدار چشم رهنما، تحت عمل جراحی قرار گرفتم و الان دنیا را با وضوح و رنگ‌های بهتری می‌بینم. از معرفی دکتر متخصص و پیگیری‌های منظم بسیار راضی هستم.'
    }
  ];

  return (
    <>
      <Header />
      
      <div className="bg-secondary">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">مرکز رسانه</h1>
          <p className="text-muted-foreground">
            ویدیوهای آموزشی، نتایج جراحی‌ها و تجربیات بیماران
          </p>
        </div>
      </div>
      
      <section className="section">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="videos" className="text-base">
                <Play className="mr-2 h-4 w-4" />
                ویدیوهای آموزشی
              </TabsTrigger>
              <TabsTrigger value="results" className="text-base">
                <Image className="mr-2 h-4 w-4" />
                نتایج جراحی‌ها
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="text-base">
                <MessageSquare className="mr-2 h-4 w-4" />
                تجربیات بیماران
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow-sm border">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white rounded-full p-3 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                          <Play className="h-8 w-8" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                      <p className="text-muted-foreground">{video.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg overflow-hidden shadow-sm border">
                    <div className="grid grid-cols-2 gap-2 p-2">
                      <div>
                        <div className="aspect-square relative">
                          <img 
                            src={result.before} 
                            alt={`قبل از ${result.title}`} 
                            className="w-full h-full object-cover rounded-md"
                          />
                          <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            قبل
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="aspect-square relative">
                          <img 
                            src={result.after} 
                            alt={`بعد از ${result.title}`} 
                            className="w-full h-full object-cover rounded-md"
                          />
                          <div className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded">
                            بعد
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
                      <p className="text-sm"><strong>شرایط:</strong> {result.condition}</p>
                      <p className="text-sm mt-1"><strong>بهبود:</strong> {result.improvement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="testimonials">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white rounded-lg p-6 shadow-sm border">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={testimonial.photo} 
                        alt={testimonial.name} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.procedure}</p>
                      </div>
                    </div>
                    <blockquote className="relative">
                      <div className="text-muted-foreground mb-4">
                        "{testimonial.quote}"
                      </div>
                    </blockquote>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <section className="section bg-eyecare-700 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">شما هم می‌توانید نتایج درخشانی داشته باشید</h2>
            <p className="text-lg mb-8">
              اولین قدم را بردارید و با دریافت مشاوره رایگان، به سوی بینایی بهتر حرکت کنید.
            </p>
            <Button size="lg" className="bg-white text-eyecare-700 hover:bg-gray-100" asChild>
              <Link to="/consultation">
                همین حالا مشاوره رایگان دریافت کنید
                <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default MediaCenter;
