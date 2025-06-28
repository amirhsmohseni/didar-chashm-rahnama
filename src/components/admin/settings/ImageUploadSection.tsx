import { useState } from 'react';
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.size, file.type);

    // Validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error('فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً فقط فایل تصویری انتخاب کنید');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create immediate preview
      const previewUrl = URL.createObjectURL(file);
      console.log('Created preview URL:', previewUrl);
      
      // Update UI immediately for better UX
      onImageChange(previewUrl);
      toast.success(`${title} انتخاب شد، در حال آپلود...`);
      
      // Upload to Supabase in background
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `site-images/${fileName}`;

      console.log('Uploading to Supabase:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        // Keep the preview URL if upload fails
        toast.warning('فایل محلی بارگذاری شد ولی آپلود به سرور ناموفق بود');
        return;
      }

      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(uploadData.path);

        if (urlData?.publicUrl) {
          console.log('Got public URL:', urlData.publicUrl);
          // Update with server URL
          onImageChange(urlData.publicUrl);
          toast.success(`${title} با موفقیت آپلود شد`);
        }
      }
    } catch (error) {
      console.error('Error in upload process:', error);
      toast.error('خطا در آپلود فایل');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleRemove = () => {
    console.log('Removing image:', currentImage);
    onImageChange(null);
    toast.success(`${title} حذف شد`);
  };

  const handleRefresh = () => {
    if (currentImage) {
      const separator = currentImage.includes('?') ? '&' : '?';
      const refreshedUrl = `${currentImage}${separator}t=${Date.now()}`;
      console.log('Refreshing image:', refreshedUrl);
      onImageChange(refreshedUrl);
      toast.success('تصویر بروزرسانی شد');
    }
  };

  const handlePreview = () => {
    if (currentImage) {
      window.open(currentImage, '_blank');
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{title}</Label>
      
      {currentImage ? (
        <Card className="overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-0">
            <div className="relative group">
              <img
                src={currentImage}
                alt={title}
                className={`w-full object-cover ${
                  aspectRatio === "1/1" ? 'h-40' : 'h-32'
                } transition-opacity duration-200`}
                loading="lazy"
                onLoad={() => console.log('Image loaded successfully:', currentImage)}
                onError={(e) => {
                  console.error('Image load error:', e);
                  const target = e.target as HTMLImageElement;
                  target.style.opacity = '0.5';
                }}
              />
              
              {/* Overlay with action buttons */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRefresh}
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
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
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
                    className="relative hover:bg-gray-50 cursor-pointer"
                    disabled={isUploading}
                    asChild
                  >
                    <label className="cursor-pointer">
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
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                    </label>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUploadSection;
