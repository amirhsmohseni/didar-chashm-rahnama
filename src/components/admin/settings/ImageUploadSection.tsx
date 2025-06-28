
import { useState, useRef } from 'react';
import { Upload, X, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadSectionProps {
  title: string;
  currentImage: string | null;
  onImageChange: (url: string | null) => void;
  aspectRatio?: string;
}

const ImageUploadSection = ({
  title,
  currentImage,
  onImageChange,
  aspectRatio = "16/9"
}: ImageUploadSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (file: File, maxWidth: number, maxHeight: number, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // محاسبه ابعاد جدید
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // رسم تصویر با کیفیت بهتر
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const validateAndProcessFile = async (file: File): Promise<{ processedFile: Blob; originalSize: number; newSize: number } | null> => {
    setError(null);
    
    // بررسی نوع فایل
    if (!file.type.startsWith('image/')) {
      setError('لطفاً فقط فایل تصویری انتخاب کنید (JPG, PNG, WEBP)');
      return null;
    }

    const originalSize = file.size;
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    
    console.log(`حجم اصلی فایل: ${(originalSize / 1024 / 1024).toFixed(2)} مگابایت`);
    
    let processedFile: Blob = file;
    
    // اگر فایل بزرگ‌تر از 5MB است، آن را کوچک کنیم
    if (originalSize > maxSizeBytes) {
      toast.info('فایل بزرگ است، در حال کوچک‌سازی...');
      
      try {
        // تعیین ابعاد مناسب بر اساس نوع تصویر
        const maxWidth = aspectRatio === "1/1" ? 800 : 1200;
        const maxHeight = aspectRatio === "1/1" ? 800 : 800;
        
        processedFile = await resizeImage(file, maxWidth, maxHeight, 0.7);
        
        if (!processedFile) {
          setError('خطا در پردازش تصویر');
          return null;
        }
        
        console.log(`حجم بعد از کوچک‌سازی: ${(processedFile.size / 1024 / 1024).toFixed(2)} مگابایت`);
        
        // اگر حتی بعد از کوچک‌سازی هم بزرگ است
        if (processedFile.size > maxSizeBytes) {
          // کیفیت پایین‌تر امتحان کنیم
          processedFile = await resizeImage(file, maxWidth * 0.8, maxHeight * 0.8, 0.5);
          
          if (processedFile.size > maxSizeBytes) {
            setError('حتی بعد از کوچک‌سازی، فایل هنوز بزرگ است. لطفاً تصویر کوچک‌تری انتخاب کنید.');
            return null;
          }
        }
        
        toast.success(`تصویر از ${(originalSize / 1024 / 1024).toFixed(1)}MB به ${(processedFile.size / 1024 / 1024).toFixed(1)}MB کوچک شد`);
      } catch (error) {
        console.error('خطا در کوچک‌سازی:', error);
        setError('خطا در پردازش تصویر. لطفاً تصویر دیگری امتحان کنید.');
        return null;
      }
    }
    
    return {
      processedFile,
      originalSize,
      newSize: processedFile.size
    };
  };

  const uploadToSupabase = async (file: Blob): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
      const filePath = `site-images/${fileName}`;

      console.log('شروع آپلود به Supabase:', filePath);
      setUploadProgress(10);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('خطا در آپلود:', uploadError);
        
        if (uploadError.message.includes('Payload too large')) {
          setError('حجم فایل بیش از حد مجاز است. لطفاً تصویر کوچک‌تری استفاده کنید.');
        } else if (uploadError.message.includes('storage')) {
          setError('خطا در اتصال به سرور ذخیره‌سازی');
        } else {
          setError(`خطا در آپلود: ${uploadError.message}`);
        }
        return null;
      }

      setUploadProgress(80);

      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(uploadData.path);

        if (urlData?.publicUrl) {
          setUploadProgress(100);
          console.log('URL عمومی دریافت شد:', urlData.publicUrl);
          return urlData.publicUrl;
        }
      }

      setError('خطا در دریافت لینک تصویر');
      return null;
    } catch (error) {
      console.error('خطا در فرآیند آپلود:', error);
      setError('خطای غیرمنتظره در آپلود');
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('فایل انتخاب شد:', file.name, file.size, file.type);
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // پردازش و اعتبارسنجی فایل
      const result = await validateAndProcessFile(file);
      if (!result) {
        setIsUploading(false);
        return;
      }

      // ایجاد پیش‌نمایش محلی
      const localPreviewUrl = URL.createObjectURL(result.processedFile);
      setCurrentImageUrl(localPreviewUrl);
      setUploadProgress(5);
      
      toast.success(`در حال آپلود ${title}...`);
      
      // آپلود به Supabase
      const serverUrl = await uploadToSupabase(result.processedFile);
      
      if (serverUrl) {
        // بروزرسانی با URL سرور
        setCurrentImageUrl(serverUrl);
        onImageChange(serverUrl);
        toast.success(`${title} با موفقیت آپلود شد`);
        
        // پاک کردن URL محلی
        URL.revokeObjectURL(localPreviewUrl);
      } else {
        // در صورت ناموفق بودن آپلود، نگه داشتن تصویر محلی
        onImageChange(localPreviewUrl);
        toast.error('آپلود به سرور ناموفق بود');
      }
    } catch (error) {
      console.error('خطا در انتخاب فایل:', error);
      setError('خطا در پردازش فایل');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // پاک کردن مقدار input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    console.log('حذف تصویر:', currentImageUrl);
    setCurrentImageUrl(null);
    onImageChange(null);
    setError(null);
    toast.success(`${title} حذف شد`);
  };

  const handleRefresh = () => {
    if (currentImageUrl) {
      const separator = currentImageUrl.includes('?') ? '&' : '?';
      const refreshedUrl = `${currentImageUrl}${separator}t=${Date.now()}`;
      console.log('بروزرسانی تصویر:', refreshedUrl);
      setCurrentImageUrl(refreshedUrl);
      onImageChange(refreshedUrl);
      toast.success('تصویر بروزرسانی شد');
    }
  };

  const openFileDialog = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handlePreview = () => {
    if (currentImageUrl) {
      window.open(currentImageUrl, '_blank');
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{title}</Label>
      
      {/* نمایش خطا */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      {currentImageUrl ? (
        <Card className="overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-0">
            <div className="relative group">
              <img
                src={currentImageUrl}
                alt={title}
                className={`w-full object-cover ${
                  aspectRatio === "1/1" ? 'h-40' : 'h-32'
                } transition-opacity duration-200`}
                loading="lazy"
                onLoad={() => console.log('تصویر با موفقیت بارگذاری شد:', currentImageUrl)}
                onError={(e) => {
                  console.error('خطا در بارگذاری تصویر:', e);
                  setError('خطا در نمایش تصویر');
                }}
              />
              
              {/* نوار پیشرفت آپلود */}
              {isUploading && uploadProgress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-white text-xs mt-1">آپلود: {uploadProgress}%</p>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isUploading}
                    className="bg-blue-500/90 hover:bg-blue-600 text-white border-0"
                    title="بروزرسانی تصویر"
                  >
                    <RefreshCw className="h-4 w-4 ml-1" />
                    بروزرسانی
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePreview}
                    disabled={isUploading}
                    className="bg-white/90 hover:bg-white text-gray-800 border-0"
                    title="مشاهده تصویر"
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    مشاهده
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    disabled={isUploading}
                    className="bg-red-500/90 hover:bg-red-600 border-0"
                    title="حذف تصویر"
                  >
                    <X className="h-4 w-4 ml-1" />
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                
                <div>
                  <p className="text-base font-medium text-gray-700 mb-1">
                    {title} را آپلود کنید
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    فرمت‌های مجاز: JPG, PNG, WEBP
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    تصاویر بزرگ به صورت خودکار کوچک می‌شوند
                  </p>
                  
                  <Button
                    variant="outline"
                    className="hover:bg-gray-50"
                    disabled={isUploading}
                    onClick={openFileDialog}
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                        در حال پردازش...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 ml-2" />
                        انتخاب فایل
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUploadSection;
