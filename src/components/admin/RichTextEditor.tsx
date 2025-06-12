
import { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload file to Supabase Storage
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('blog-media')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-media')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "خطا در آپلود",
        description: "خطا در آپلود فایل. لطفا دوباره تلاش کنید.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file selection and upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "فایل بزرگ",
        description: "حداکثر اندازه فایل 10 مگابایت است.",
        variant: "destructive",
      });
      return;
    }

    const url = await uploadFile(file);
    if (url && quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();

      if (file.type.startsWith('image/')) {
        quill.insertEmbed(index, 'image', url);
      } else if (file.type.startsWith('video/')) {
        quill.insertEmbed(index, 'video', url);
      } else {
        // For other files, insert as link
        quill.insertText(index, file.name);
        quill.setSelection(index, file.name.length);
        quill.format('link', url);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Custom image handler
  const imageHandler = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.click();
    }
  };

  // Custom video handler
  const videoHandler = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'video/*';
      fileInputRef.current.click();
    }
  };

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        video: videoHandler,
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  // Quill formats
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'direction',
    'code-block', 'script'
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Custom upload buttons */}
      <div className="border-b bg-gray-50 p-2 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={imageHandler}
          disabled={isUploading}
          className="flex items-center gap-1"
        >
          <Image className="h-4 w-4" />
          آپلود عکس
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={videoHandler}
          disabled={isUploading}
          className="flex items-center gap-1"
        >
          <Video className="h-4 w-4" />
          آپلود ویدیو
        </Button>
        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-4 w-4 animate-spin" />
            در حال آپلود...
          </div>
        )}
      </div>

      {/* Quill Editor */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "محتوای مقاله را بنویسید..."}
        style={{ minHeight: '300px' }}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default RichTextEditor;
