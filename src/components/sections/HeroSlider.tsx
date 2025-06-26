
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SlideData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  alt_text: string;
  cta_text?: string;
  cta_link?: string;
  order_index: number;
}

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load slides from database
  useEffect(() => {
    const loadSlides = async () => {
      try {
        const { data, error } = await supabase
          .from('slider_images')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) {
          console.error('Error loading slides:', error);
          return;
        }

        setSlides((data as unknown as SlideData[]) || []);
      } catch (error) {
        console.error('Error in loadSlides:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSlides();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide, slides.length]);

  if (loading) {
    return (
      <section className="relative h-[500px] md:h-[600px] lg:h-[700px] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">در حال بارگذاری...</div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image_url}
              alt={slide.alt_text}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-1000 ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-8'
                }`}
                style={{ display: index === currentSlide ? 'block' : 'none' }}
              >
                {slide.subtitle && (
                  <h2 className="text-sm sm:text-base text-primary-300 font-medium mb-2 tracking-wide">
                    {slide.subtitle}
                  </h2>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {slide.title}
                </h1>
                {slide.description && (
                  <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed">
                    {slide.description}
                  </p>
                )}
                {slide.cta_text && slide.cta_link && (
                  <Link to={slide.cta_link}>
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      {slide.cta_text}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 md:p-4 transition-all duration-300 group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 md:p-4 transition-all duration-300 group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-20">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%` 
          }}
        />
      </div>
    </section>
  );
};

export default HeroSlider;
