
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Eye, Heart, Phone, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturedDoctors from '@/components/sections/FeaturedDoctors';

const Index = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-eyecare-800 to-eyecare-700 text-white">
        <div className="container py-16 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                مشاوره تخصصی و معرفی به بهترین جراحان چشم ایران
              </h1>
              <p className="text-lg mb-8 text-gray-100">
                دیدار چشم رهنما، خدمات مشاوره رایگان برای انتخاب بهترین متخصص چشم پزشکی متناسب با نیاز شما ارائه می‌دهد.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/consultation">
                    درخواست مشاوره رایگان
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/doctors">مشاهده پزشکان</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>مشاوره کاملاً رایگان</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>معرفی به بهترین متخصصان</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>پیگیری پس از جراحی</span>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/lovable-uploads/2044c494-74f5-42c3-9979-6effb4059825.png" 
                alt="جراحی چشم" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">چگونه کار می‌کنیم؟</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              روند ساده و موثر ما برای کمک به شما در دریافت بهترین خدمات جراحی چشم
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Phone className="h-8 w-8 text-primary" />,
                title: "درخواست مشاوره",
                description: "فرم مشاوره را تکمیل کنید یا با ما تماس بگیرید. تیم مشاوران ما به صورت رایگان با شما صحبت خواهند کرد."
              },
              {
                icon: <Eye className="h-8 w-8 text-primary" />,
                title: "معرفی به پزشک متخصص",
                description: "بر اساس نیازهای شما، بهترین و مناسب‌ترین جراح چشم را به شما معرفی می‌کنیم."
              },
              {
                icon: <Heart className="h-8 w-8 text-primary" />,
                title: "پیگیری پس از جراحی",
                description: "پس از انجام جراحی، تیم ما پیگیر روند بهبودی شما خواهد بود تا از نتایج عالی اطمینان حاصل کند."
              }
            ].map((step, index) => (
              <div key={index} className="bg-secondary p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link to="/consultation">درخواست مشاوره</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Doctors Section */}
      <FeaturedDoctors />
      
      {/* Testimonials Section */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">نظرات بیماران</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              آنچه بیماران درباره تجربه خود با دیدار چشم رهنما می‌گویند
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "مریم احمدی",
                procedure: "جراحی لازیک",
                quote: "بعد از سال‌ها استفاده از عینک، تصمیم به جراحی لازیک گرفتم. تیم مشاوره دیدار به من کمک کرد تا دکتر مناسبی پیدا کنم و نتیجه جراحی فراتر از انتظارم بود."
              },
              {
                name: "علی محمدی",
                procedure: "جراحی آب مروارید",
                quote: "از مشاوره و راهنمایی دیدار چشم رهنما بسیار راضی هستم. آنها پزشک بسیار خوبی را به من معرفی کردند و در تمام مراحل همراه من بودند."
              },
              {
                name: "فاطمه حسینی",
                procedure: "کراتوکونوس",
                quote: "از بین چندین کلینیک و پزشک، دیدار چشم رهنما بهترین راهنمایی را به من کرد. اکنون بینایی من به طور قابل توجهی بهبود یافته است."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex gap-2 text-amber-400 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.procedure}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section bg-eyecare-700 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">آماده هستید که برای بینایی بهتر اقدام کنید؟</h2>
            <p className="text-lg mb-8">
              مشاوران متخصص ما آماده راهنمایی شما در مسیر بهبود بینایی و انتخاب بهترین راه‌حل درمانی هستند.
            </p>
            <Button size="lg" className="bg-white text-eyecare-700 hover:bg-gray-100" asChild>
              <Link to="/consultation">
                همین حالا مشاوره رایگان دریافت کنید
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Index;
