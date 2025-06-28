
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

  const handleImageUpload = async (file: File) => {
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
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `site-images/${fileName}`;

      console.log('Starting upload to Supabase Storage...');
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        
        // Fallback to local URL for immediate use
        const imageUrl = URL.createObjectURL(file);
        onImageChange(imageUrl);
        toast.success(`${title} آپلود شد (محلی)`);
        return;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(uploadData.path);

      if (urlData?.publicUrl) {
        console.log('Public URL generated:', urlData.publicUrl);
        onImageChange(urlData.publicUrl);
        toast.success(`${title} با موفقیت آپلود شد`);
      } else {
        throw new Error('Could not get public URL');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Always provide fallback for immediate use
      const imageUrl = URL.createObjectURL(file);
      onImageChange(imageUrl);
      toast.success(`${title} آپلود شد (محلی)`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    onImageChange(null);
    toast.success(`${title} حذف شد`);
  };

  const refreshImage = () => {
    if (currentImage) {
      // Force refresh by adding timestamp
      const separator = currentImage.includes('?') ? '&' : '?';
      const refreshedUrl = `${currentImage}${separator}t=${Date.now()}`;
      onImageChange(refreshedUrl);
      toast.success('تصویر بروزرسانی شد');
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
                } loading-lazy`}
                loading="lazy"
                onError={(e) => {
                  console.error('Image load error:', e);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={refreshImage}
                    className="bg-blue-500/90 hover:bg-blue-500 text-white"
                  >
                    <RefreshCw className="h-4 w-4 ml-1" />
                    بروزرسانی
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(currentImage, '_blank')}
                    className="bg-white/90 hover:bg-white text-gray-800"
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    مشاهده
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="bg-red-500/90 hover:bg-red-500"
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
                    className="relative hover:bg-gray-50"
                    disabled={isUploading}
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
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
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
