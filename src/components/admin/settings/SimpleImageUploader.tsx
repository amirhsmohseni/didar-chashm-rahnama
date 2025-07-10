import { useState, useRef } from 'react';
import { Upload, X, Eye, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface SimpleImageUploaderProps {
  title: string;
  currentImage: string | null;
  onImageChange: (url: string | null) => void;
  aspectRatio?: string;
}

const SimpleImageUploader = ({
  title,
  currentImage,
  onImageChange,
  aspectRatio = "16/9"
}: SimpleImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // التحقق من صحة الملف
  const validateFile = (file: File): boolean => {
    setError(null);
    
    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('نوع الملف غير مدعوم. الأنواع المسموحة: JPG, PNG, WEBP');
      return false;
    }

    // التحقق من حجم الملف (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت');
      return false;
    }

    return true;
  };

  // ضغط الصورة إذا لزم الأمر
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      if (!ctx) {
        reject(new Error('لا يمكن إنشاء Canvas context'));
        return;
      }

      img.onload = () => {
        const maxWidth = aspectRatio === "1/1" ? 800 : 1200;
        const maxHeight = aspectRatio === "1/1" ? 800 : 800;
        
        let { width, height } = img;
        
        // حساب الأبعاد الجديدة مع الحفاظ على النسبة
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // رسم الصورة
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('فشل في ضغط الصورة'));
          }
        }, 'image/jpeg', 0.85);
      };

      img.onerror = () => reject(new Error('فشل في تحميل الصورة'));
      img.src = URL.createObjectURL(file);
    });
  };

  // رفع الملف إلى Supabase
  const uploadToSupabase = async (file: Blob): Promise<string | null> => {
    try {
      // إنشاء اسم ملف فريد
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const fileName = `images/${timestamp}-${random}.jpg`;

      console.log('رفع الملف:', fileName);

      // رفع الملف
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('خطأ في الرفع:', error);
        throw new Error(error.message);
      }

      if (data?.path) {
        // الحصول على الرابط العام
        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(data.path);

        return urlData?.publicUrl || null;
      }

      throw new Error('لم يتم الحصول على مسار الملف');
    } catch (error) {
      console.error('خطأ في رفع الملف:', error);
      throw error;
    }
  };

  // معالج اختيار الملف
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('تم اختيار الملف:', file.name, file.size);

    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      let processedFile: Blob = file;

      // ضغط الصورة إذا كانت كبيرة
      if (file.size > 1024 * 1024) { // 1MB
        console.log('ضغط الصورة...');
        processedFile = await compressImage(file);
        console.log('تم ضغط الصورة من', file.size, 'إلى', processedFile.size);
      }

      // رفع الملف
      const url = await uploadToSupabase(processedFile);
      
      if (url) {
        onImageChange(url);
        toast.success(`تم رفع ${title} بنجاح`);
      } else {
        throw new Error('فشل في الحصول على رابط الصورة');
      }

    } catch (error) {
      console.error('خطأ في العملية:', error);
      const message = error instanceof Error ? error.message : 'خطأ غير معروف';
      setError(`خطأ في الرفع: ${message}`);
      toast.error('فشل في رفع الصورة');
    } finally {
      setIsUploading(false);
      // إعادة تعيين input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // حذف الصورة
  const handleRemove = () => {
    onImageChange(null);
    setError(null);
    toast.success(`تم حذف ${title}`);
  };

  // فتح مربع حوار اختيار الملف
  const openFileDialog = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{title}</Label>
      
      {/* عرض الخطأ */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      {currentImage ? (
        // عرض الصورة الحالية
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
                onError={() => setError('خطأ في عرض الصورة')}
              />
              
              {/* أدوات التحكم */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(currentImage, '_blank')}
                    disabled={isUploading}
                    className="bg-white/90 hover:bg-white text-gray-800 border-0"
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    عرض
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
        // منطقة رفع الصورة
        <Card 
          className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer" 
          onClick={openFileDialog}
        >
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                
                <div>
                  <p className="text-base font-medium text-gray-700 mb-1">
                    رفع {title}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    اختر ملف صورة من جهازك
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    الأنواع المدعومة: JPG, PNG, WEBP (حتى 5 ميجابايت)
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
                        <Upload className="h-4 w-4 ml-2 animate-spin" />
                        جاري الرفع...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 ml-2" />
                        اختيار ملف
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Input مخفي لاختيار الملف */}
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

export default SimpleImageUploader;