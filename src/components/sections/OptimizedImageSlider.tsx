import { useState, useEffect, memo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SliderImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  alt_text: string;
  link_url?: string;
  order_index: number;
}

const OptimizedImageSlider = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Load slider images from database
  useEffect(() => {
    const loadSliderImages = async () => {
      try {
        const { data, error } = await supabase
          .from('slider_images')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) {
          console.error('Error loading slider images:', error);
          // Fallback to default images if database fails
          setSliderImages([
            {
              id: '1',
              title: 'تجهیزات پیشرفته چشم‌پزشکی',
              image_url: '/lovable-uploads/2044c494-74f5-42c3-9979-6effb4059825.png',
              alt_text: 'تجهیزات چشم‌پزشکی 1',
              order_index: 0
            },
            {
              id: '2', 
              title: 'مرکز تخصصی چشم',
              image_url: '/lovable-uploads/3bf77a26-5255-49db-ae88-bf1a5d13339c.png',
              alt_text: 'تجهیزات چشم‌پزشکی 2',
              order_index: 1
            },
            {
              id: '3',
              title: 'خدمات جراحی چشم',
              image_url: '/lovable-uploads/56cc2662-9b74-49e6-b2e9-3c799a4ba344.png',
              alt_text: 'تجهیزات چشم‌پزشکی 3',
              order_index: 2
            }
          ]);
        } else {
          setSliderImages((data as unknown as SliderImage[]) || []);
        }
      } catch (error) {
        console.error('Error in loadSliderImages:', error);
        // Use fallback images
        setSliderImages([
          {
            id: '1',
            title: 'تجهیزات پیشرفته چشم‌پزشکی',
            image_url: '/lovable-uploads/2044c494-74f5-42c3-9979-6effb4059825.png',
            alt_text: 'تجهیزات چشم‌پزشکی 1',
            order_index: 0
          },
          {
            id: '2',
            title: 'مرکز تخصصی چشم',
            image_url: '/lovable-uploads/3bf77a26-5255-49db-ae88-bf1a5d13339c.png',
            alt_text: 'تجهیزات چشم‌پزشکی 2',
            order_index: 1
          },
          {
            id: '3',
            title: 'خدمات جراحی چشم',
            image_url: '/lovable-uploads/56cc2662-9b74-49e6-b2e9-3c799a4ba344.png',
            alt_text: 'تجهیزات چشم‌پزشکی 3',
            order_index: 2
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadSliderImages();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  }, [sliderImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  }, [sliderImages.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || sliderImages.length === 0) return;
    
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide, sliderImages.length]);

  // Don't render if no images or still loading
  if (loading || sliderImages.length === 0) {
    return null;
  }

  const handleImageClick = (image: SliderImage) => {
    if (image.link_url) {
      window.open(image.link_url, '_blank');
    }
  };

  return (
    <section className="relative">
      <div className="relative max-w-full mx-auto">
        <div 
          className="relative h-64 sm:h-80 lg:h-96 overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {sliderImages.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.image_url}
                alt={image.alt_text}
                className={`w-full h-full object-cover ${image.link_url ? 'cursor-pointer' : ''}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                onClick={() => handleImageClick(image)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Image Title and Description */}
              {(image.title || image.description) && (
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  {image.title && (
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{image.title}</h3>
                  )}
                  {image.description && (
                    <p className="text-sm sm:text-base opacity-90">{image.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        {sliderImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 group"
              aria-label="تصویر قبلی"
            >
              <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 group"
              aria-label="تصویر بعدی"
            >
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}
        
        {/* Dots Indicator */}
        {sliderImages.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`برو به تصویر ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

OptimizedImageSlider.displayName = 'OptimizedImageSlider';

export default OptimizedImageSlider;
