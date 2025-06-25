
import { useState, useEffect, memo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const OptimizedImageSlider = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Optimized images array
  const sliderImages = [
    '/lovable-uploads/2044c494-74f5-42c3-9979-6effb4059825.png',
    '/lovable-uploads/3bf77a26-5255-49db-ae88-bf1a5d13339c.png',
    '/lovable-uploads/56cc2662-9b74-49e6-b2e9-3c799a4ba344.png'
  ];

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
    if (!isAutoPlaying) return;
    
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">تجهیزات پیشرفته</h2>
          <p className="text-lg sm:text-xl text-gray-600">آشنایی با تجهیزات مدرن چشم‌پزشکی</p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <div 
            className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {sliderImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image}
                  alt={`تجهیزات چشم‌پزشکی ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Navigation Buttons */}
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
          
          {/* Enhanced Dots Indicator */}
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
        </div>
      </div>
    </section>
  );
});

OptimizedImageSlider.displayName = 'OptimizedImageSlider';

export default OptimizedImageSlider;
