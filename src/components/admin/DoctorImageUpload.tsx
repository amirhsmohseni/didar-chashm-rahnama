
import { useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface DoctorImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  doctorName?: string;
}

const DoctorImageUpload = ({ currentImage, onImageChange, doctorName }: DoctorImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری انتخاب کنید');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    setIsUploading(true);
    
    // شبیه‌سازی آپلود - در عمل می‌توانید از Supabase Storage استفاده کنید
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('خطا در آپلود:', error);
      alert('خطا در آپلود تصویر');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            تصویر پروفایل پزشک
          </label>
          
          {/* نمایش تصویر فعلی */}
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 border-4 border-gray-200">
              <AvatarImage src={currentImage} alt={doctorName} />
              <AvatarFallback className="bg-gray-100 text-2xl">
                {doctorName ? doctorName.slice(0, 2) : <Camera className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* منطقه آپلود */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="doctor-image-upload"
              disabled={isUploading}
            />
            
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                تصویر را اینجا بکشید یا کلیک کنید
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, GIF تا 5MB
              </p>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => document.getElementById('doctor-image-upload')?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'در حال آپلود...' : 'انتخاب فایل'}
            </Button>
          </div>

          {/* دکمه حذف تصویر */}
          {currentImage && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onImageChange('')}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              حذف تصویر
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorImageUpload;
