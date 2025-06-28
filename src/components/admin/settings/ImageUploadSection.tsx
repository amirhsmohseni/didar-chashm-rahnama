
import { useState, useRef } from 'react';
import { Upload, X, Eye, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
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
  const [fileInfo, setFileInfo] = useState<{original: number; compressed: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // کوچک‌سازی تصویر با کیفیت بالا
  const resizeImage = (file: File, maxWidth: number, maxHeight: number, quality: number = 0.8): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      if (!ctx) {
        console.error('Canvas context not available');
        resolve(null);
        return;
      }
      
      img.onload = () => {
        try {
          let { width, height } = img;
          const imageAspectRatio = width / height;
          
          // محاسبه ابعاد جدید
          if (width > maxWidth) {
            width = maxWidth;
            height = width / imageAspectRatio;
          }
          
          if (height > maxHeight) {
            height = maxHeight;
            width = height * imageAspectRatio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // تنظیمات کیفیت
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', quality);
        } catch (error) {
          console.error('خطا در پردازش تصویر:', error);
          resolve(null);
        }
      };
      
      img.onerror = () => {
        console.error('خطا در بارگذاری تصویر');
        resolve(null);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // اعتبارسنجی فایل
  const validateAndProcessFile = async (file: File): Promise<{ processedFile: Blob; originalSize: number; newSize: number } | null> => {
    setError(null);
    setFileInfo(null);
    
    console.log('پردازش فایل:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    });
    
    // بررسی نوع فایل
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError(`نوع فایل پشتیبانی نمی‌شود. فرمت‌های مجاز: JPG, PNG, WEBP`);
      return null;
    }

    const originalSize = file.size;
    const maxSizeBytes = 3 * 1024 * 1024; // 3MB
    
    let processedFile: Blob = file;
    
    // کوچک‌سازی در صورت نیاز
    if (originalSize > maxSizeBytes) {
      toast.info(`فایل ${(originalSize / 1024 / 1024).toFixed(1)}MB است، در حال کوچک‌سازی...`);
      
      try {
        const maxWidth = aspectRatio === "1/1" ? 600 : 1200;
        const maxHeight = aspectRatio === "1/1" ? 600 : 800;
        
        let resizedBlob = await resizeImage(file, maxWidth, maxHeight, 0.7);
        
        if (!resizedBlob) {
          setError('خطا در پردازش تصویر. لطفاً فایل دیگری انتخاب کنید.');
          return null;
        }
        
        // اگر هنوز بزرگ است
        if (resizedBlob.size > maxSizeBytes) {
          resizedBlob = await resizeImage(file, maxWidth * 0.7, maxHeight * 0.7, 0.5);
          
          if (!resizedBlob || resizedBlob.size > maxSizeBytes) {
            setError('فایل خیلی بزرگ است. لطفاً تصویر کوچک‌تری انتخاب کنید.');
            return null;
          }
        }
        
        processedFile = resizedBlob;
        const newSize = processedFile.size;
        
        setFileInfo({ original: originalSize, compressed: newSize });
        toast.success(`تصویر از ${(originalSize / 1024 / 1024).toFixed(1)}MB به ${(newSize / 1024 / 1024).toFixed(1)}MB کوچک شد`);
      } catch (error) {
        console.error('خطا در کوچک‌سازی:', error);
        setError('خطا در پردازش تصویر');
        return null;
      }
    }
    
    return {
      processedFile,
      originalSize,
      newSize: processedFile.size
    };
  };

  // آپلود به Supabase
  const uploadToSupabase = async (file: Blob): Promise<string | null> => {
    try {
      setUploadProgress(10);
      
      // تست اتصال به bucket
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error('خطا در دسترسی به storage:', bucketError);
        setError('خطا در اتصال به سرور ذخیره‌سازی');
        return null;
      }
      
      const uploadsExists = buckets?.some(bucket => bucket.id === 'uploads');
      if (!uploadsExists) {
        setError('Bucket مورد نظر یافت نشد. لطفاً با مدیر سیستم تماس بگیرید.');
        return null;
      }
      
      setUploadProgress(20);
      
      // نام فایل منحصر به فرد
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2);
      const fileName = `site-images/${timestamp}-${random}.jpg`;

      console.log('آپلود فایل:', fileName, `${(file.size / 1024 / 1024).toFixed(2)}MB`);
      
      // آپلود فایل
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg'
        });

      if (uploadError) {
        console.error('خطا در آپلود:', uploadError);
        
        if (uploadError.message.includes('Payload too large')) {
          setError('حجم فایل بیش از حد مجاز است');
        } else if (uploadError.message.includes('Bucket not found')) {
          setError('Bucket یافت نشد. لطفاً صفحه را تازه‌سازی کنید');
        } else {
          setError(`خطا در آپلود: ${uploadError.message}`);
        }
        return null;
      }

      setUploadProgress(80);

      if (uploadData?.path) {
        // دریافت لینک عمومی
        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(uploadData.path);

        if (urlData?.publicUrl) {
          setUploadProgress(100);
          console.log('آپلود موفق:', urlData.publicUrl);
          return urlData.publicUrl;
        }
      }

      setError('خطا در دریافت لینک تصویر');
      return null;
    } catch (error) {
      console.error('خطای کلی:', error);
      setError(`خطای غیرمنتظره: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
      return null;
    }
  };

  // انتخاب فایل
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('فایل انتخاب شد:', file.name);
    
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const result = await validateAndProcessFile(file);
      if (!result) {
        setIsUploading(false);
        return;
      }

      const serverUrl = await uploadToSupabase(result.processedFile);
      
      if (serverUrl) {
        setCurrentImageUrl(serverUrl);
        onImageChange(serverUrl);
        toast.success(`${title} با موفقیت آپلود شد`);
        setError(null);
      } else {
        toast.error('آپلود ناموفق بود');
      }
    } catch (error) {
      console.error('خطا در فرآیند آپلود:', error);
      setError(`خطا در آپلود: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // حذف تصویر
  const handleRemove = () => {
    setCurrentImageUrl(null);
    onImageChange(null);
    setError(null);
    setFileInfo(null);
    toast.success(`${title} حذف شد`);
  };

  // بروزرسانی
  const handleRefresh = () => {
    if (currentImageUrl) {
      const refreshedUrl = `${currentImageUrl}?t=${Date.now()}`;
      setCurrentImageUrl(refreshedUrl);
      onImageChange(refreshedUrl);
      toast.success('تصویر بروزرسانی شد');
    }
  };

  // باز کردن انتخاب فایل
  const openFileDialog = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  // نمایش تصویر در تب جدید
  const handlePreview = () => {
    if (currentImageUrl) {
      window.open(currentImageUrl, '_blank');
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{title}</Label>
      
      {/* نمایش اطلاعات کوچک‌سازی */}
      {fileInfo && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs">
            فایل از {(fileInfo.original / 1024 / 1024).toFixed(1)}MB به {(fileInfo.compressed / 1024 / 1024).toFixed(1)}MB کاهش یافت
          </span>
        </div>
      )}
      
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
                onLoad={() => console.log('تصویر نمایش داده شد')}
                onError={() => setError('خطا در نمایش تصویر')}
              />
              
              {/* نوار پیشرفت */}
              {isUploading && uploadProgress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-white text-xs mt-1 text-center">
                    آپلود: {uploadProgress}%
                  </p>
                </div>
              )}
              
              {/* دکمه‌های عملیات */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isUploading}
                    className="bg-blue-500/90 hover:bg-blue-600 text-white border-0"
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
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer" onClick={openFileDialog}>
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
                    حداکثر 3 مگابایت - تصاویر بزرگ خودکار کوچک می‌شوند
                  </p>
                  
                  <Button
                    variant="outline"
                    className="hover:bg-gray-50"
                    disabled={isUploading}
                    onClick={(e) => {
                      e.stopPropagation();
                      openFileDialog();
                    }}
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
