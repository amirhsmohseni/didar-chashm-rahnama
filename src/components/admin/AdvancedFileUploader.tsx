
import { useState, useRef } from 'react';
import { Upload, X, Image, Video, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdvancedFileUploaderProps {
  onUploadComplete: (url: string) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  bucketName?: string;
  folderPath?: string;
  className?: string;
}

const AdvancedFileUploader = ({
  onUploadComplete,
  acceptedTypes = ['image/*', 'video/*'],
  maxSize = 50,
  bucketName = 'media-files',
  folderPath = '',
  className = ''
}: AdvancedFileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`فایل نباید بیشتر از ${maxSize} مگابایت باشد`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      toast.success('فایل با موفقیت آپلود شد');
    } catch (error) {
      console.error('خطا در آپلود فایل:', error);
      toast.error('خطا در آپلود فایل');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadFile(files[0]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error('لطفاً آدرس فایل را وارد کنید');
      return;
    }
    onUploadComplete(urlInput.trim());
    setUrlInput('');
    toast.success('لینک با موفقیت اضافه شد');
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="h-8 w-8" />;
    if (type.includes('video')) return <Video className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={uploadMode === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('file')}
        >
          آپلود فایل
        </Button>
        <Button
          type="button"
          variant={uploadMode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('url')}
        >
          لینک فایل
        </Button>
      </div>

      {uploadMode === 'file' ? (
        <Card className={`border-2 border-dashed transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}>
          <CardContent className="p-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className="text-center"
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full text-gray-400">
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    getFileIcon(acceptedTypes[0] || 'file')
                  )}
                </div>
                
                {uploading ? (
                  <div className="w-full max-w-xs">
                    <div className="text-sm text-gray-600 mb-2">
                      در حال آپلود... {Math.round(uploadProgress)}%
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      فایل را اینجا بکشید یا کلیک کنید
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      حداکثر {maxSize} مگابایت
                    </p>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="relative"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 ml-2" />
                      انتخاب فایل
                    </Button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={acceptedTypes.join(',')}
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                      disabled={uploading}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label>آدرس فایل</Label>
              <div className="flex gap-2">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                >
                  اضافه کردن
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedFileUploader;
