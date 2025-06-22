
import { useState, useRef } from 'react';
import { Upload, X, Eye, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';

interface AdvancedImageUploadProps {
  currentImage: string;
  onImageChange: (url: string) => void;
  label: string;
  description?: string;
  aspectRatio?: string;
  maxSize?: number; // MB
}

const AdvancedImageUpload = ({
  currentImage,
  onImageChange,
  label,
  description,
  aspectRatio = "16/9",
  maxSize = 5
}: AdvancedImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`فایل نباید بیشتر از ${maxSize} مگابایت باشد`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً فقط فایل تصویری انتخاب کنید');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create object URL for immediate preview
      const imageUrl = URL.createObjectURL(file);
      onImageChange(imageUrl);
      toast.success(`${label} با موفقیت آپلود شد`);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('خطا در آپلود تصویر');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    onImageChange('');
    toast.success(`${label} حذف شد`);
  };

  return (
    <div className="mt-2">
      {currentImage ? (
        <Card className="overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
          <CardContent className="p-0">
            <div className="relative group">
              <div className={`w-full ${aspectRatio === "1/1" ? 'aspect-square' : 'aspect-video'} overflow-hidden`}>
                <img
                  src={currentImage}
                  alt={label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                <div className="flex gap-2">
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
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/90 hover:bg-white text-gray-800 border-white/50"
                  >
                    <Upload className="h-4 w-4 ml-1" />
                    تغییر
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
        <Card 
          className={`border-2 border-dashed transition-all cursor-pointer ${
            dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className={`p-4 rounded-full transition-colors ${
                  dragOver ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  ) : (
                    <ImageIcon className={`h-8 w-8 ${dragOver ? 'text-blue-600' : 'text-gray-400'}`} />
                  )}
                </div>
                
                <div>
                  <p className="text-base font-medium text-gray-700 mb-1">
                    {dragOver ? `رها کردن برای آپلود ${label}` : `آپلود ${label}`}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {description || `فرمت‌های مجاز: JPG, PNG - حداکثر ${maxSize} مگابایت`}
                  </p>
                  
                  <Button
                    variant="outline"
                    className="relative hover:bg-gray-50"
                    disabled={isUploading}
                    type="button"
                  >
                    <Upload className="h-4 w-4 ml-2" />
                    {isUploading ? 'در حال آپلود...' : 'انتخاب فایل'}
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
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default AdvancedImageUpload;
