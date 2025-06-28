
import { useState, useRef } from 'react';
import { Upload, X, Eye, RefreshCw } from 'lucide-react';
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
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('فایل نباید بیشتر از 5 مگابایت باشد');
      return false;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً فقط فایل تصویری انتخاب کنید');
      return false;
    }

    return true;
  };

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `site-images/${fileName}`;

      console.log('شروع آپلود به Supabase:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('خطا در آپلود:', uploadError);
        toast.error('خطا در آپلود فایل به سرور');
        return null;
      }

      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(uploadData.path);

        if (urlData?.publicUrl) {
          console.log('URL عمومی دریافت شد:', urlData.publicUrl);
          return urlData.publicUrl;
        }
      }

      return null;
    } catch (error) {
      console.error('خطا در فرآیند آپلود:', error);
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('فایل انتخاب شد:', file.name, file.size, file.type);

    if (!validateFile(file)) return;

    setIsUploading(true);
    
    try {
      // ایجاد پیش‌نمایش محلی
      const localPreviewUrl = URL.createObjectURL(file);
      setCurrentImageUrl(localPreviewUrl);
      
      toast.success(`در حال آپلود ${title}...`);
      
      // آپلود به Supabase
      const serverUrl = await uploadToSupabase(file);
      
      if (serverUrl) {
        // بروزرسانی با URL سرور
        setCurrentImageUrl(serverUrl);
        onImageChange(serverUrl);
        toast.success(`${title} با موفقیت آپلود شد`);
        
        // پاک کردن URL محلی
        URL.revokeObjectURL(localPreviewUrl);
      } else {
        // در صورت ناموفق بودن آپلود، حفظ تصویر محلی
        onImageChange(localPreviewUrl);
        toast.error('آپلود به سرور ناموفق بود، فایل محلی ذخیره شد');
      }
    } catch (error) {
      console.error('خطا در انتخاب فایل:', error);
      toast.error('خطا در پردازش فایل');
    } finally {
      setIsUploading(false);
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
                  const target = e.target as HTMLImageElement;
                  target.style.opacity = '0.5';
                }}
              />
              
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
                  <p className="text-sm text-gray-500 mb-4">
                    فرمت‌های مجاز: JPG, PNG, WEBP - حداکثر 5 مگابایت
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
                        در حال آپلود...
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
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUploadSection;
