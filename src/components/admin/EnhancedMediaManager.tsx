
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  Video,
  File,
  Eye,
  EyeOff,
  Save,
  X,
  Play
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdvancedFileUploader from './AdvancedFileUploader';

interface MediaItem {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  thumbnail_url?: string;
  type: string;
  category: string;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  duration?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

const EnhancedMediaManager = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_url: '',
    thumbnail_url: '',
    type: 'image',
    category: 'general',
    tags: '',
    is_published: true,
    is_featured: false,
    duration: ''
  });

  const categories = [
    { value: 'general', label: 'عمومی' },
    { value: 'surgery', label: 'جراحی' },
    { value: 'consultation', label: 'مشاوره' },
    { value: 'equipment', label: 'تجهیزات' },
    { value: 'education', label: 'آموزشی' },
    { value: 'testimonial', label: 'نظرات بیماران' }
  ];

  const mediaTypes = [
    { value: 'image', label: 'تصویر' },
    { value: 'video', label: 'ویدیو' },
    { value: 'document', label: 'مدرک' }
  ];

  useEffect(() => {
    loadMediaItems();
  }, []);

  const loadMediaItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error loading media items:', error);
        toast.error('خطا در بارگذاری رسانه‌ها');
        return;
      }

      setMediaItems((data as unknown as MediaItem[]) || []);
    } catch (error) {
      console.error('Error in loadMediaItems:', error);
      toast.error('خطا در بارگذاری رسانه‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.file_url) {
      toast.error('لطفا فیلدهای ضروری را پر کنید');
      return;
    }

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const itemData = {
        ...formData,
        tags: tagsArray,
        order_index: editingItem ? editingItem.order_index : mediaItems.length
      };

      if (editingItem) {
        const { error } = await supabase
          .from('media_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('رسانه با موفقیت به‌روزرسانی شد');
      } else {
        const { error } = await supabase
          .from('media_items')
          .insert([itemData]);

        if (error) throw error;
        toast.success('رسانه جدید با موفقیت اضافه شد');
      }

      resetForm();
      loadMediaItems();
    } catch (error) {
      console.error('Error saving media item:', error);
      toast.error('خطا در ذخیره رسانه');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این رسانه مطمئن هستید؟')) return;

    try {
      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('رسانه با موفقیت حذف شد');
      loadMediaItems();
    } catch (error) {
      console.error('Error deleting media item:', error);
      toast.error('خطا در حذف رسانه');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('media_items')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`رسانه ${!currentStatus ? 'منتشر' : 'پنهان'} شد`);
      loadMediaItems();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('خطا در تغییر وضعیت انتشار');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      file_url: '',
      thumbnail_url: '',
      type: 'image',
      category: 'general',
      tags: '',
      is_published: true,
      is_featured: false,
      duration: ''
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const startEdit = (item: MediaItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      file_url: item.file_url,
      thumbnail_url: item.thumbnail_url || '',
      type: item.type,
      category: item.category,
      tags: item.tags.join(', '),
      is_published: item.is_published,
      is_featured: item.is_featured,
      duration: item.duration || ''
    });
    setShowAddForm(true);
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getMediaPreview = (item: MediaItem) => {
    if (item.type === 'image') {
      return (
        <img
          src={item.file_url}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      );
    } else if (item.type === 'video') {
      return (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <Play className="h-8 w-8 text-white" />
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <File className="h-8 w-8 text-gray-400" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">در حال بارگذاری...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
            <ImageIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مدیریت رسانه‌ها</h1>
            <p className="text-gray-600 mt-1">مدیریت تصاویر، ویدیوها و مدارک</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          افزودن رسانه جدید
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center justify-between">
              <span>{editingItem ? 'ویرایش رسانه' : 'افزودن رسانه جدید'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">عنوان *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="عنوان رسانه"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">نوع رسانه</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="نوع رسانه را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {mediaTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">توضیحات</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="توضیحات رسانه"
                  rows={3}
                />
              </div>

              <div>
                <Label>فایل اصلی *</Label>
                <AdvancedFileUploader
                  onUploadComplete={(url) => setFormData({...formData, file_url: url})}
                  acceptedTypes={
                    formData.type === 'image' ? ['image/*'] :
                    formData.type === 'video' ? ['video/*'] :
                    ['*/*']
                  }
                  folderPath={formData.category}
                />
                {formData.file_url && (
                  <div className="mt-2">
                    <div className="w-32 h-20 bg-gray-100 rounded border overflow-hidden">
                      {/* Create proper MediaItem object for preview */}
                      {getMediaPreview({
                        id: 'preview',
                        title: formData.title,
                        file_url: formData.file_url,
                        type: formData.type,
                        category: formData.category,
                        tags: [],
                        is_published: formData.is_published,
                        is_featured: formData.is_featured,
                        order_index: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        description: formData.description,
                        thumbnail_url: formData.thumbnail_url,
                        duration: formData.duration
                      })}
                    </div>
                  </div>
                )}
              </div>

              {formData.type === 'video' && (
                <div>
                  <Label>تصویر بندانگشتی</Label>
                  <AdvancedFileUploader
                    onUploadComplete={(url) => setFormData({...formData, thumbnail_url: url})}
                    acceptedTypes={['image/*']}
                    folderPath={`${formData.category}/thumbnails`}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">دسته‌بندی</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">برچسب‌ها</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="برچسب‌ها را با کاما جدا کنید"
                  />
                </div>
              </div>

              {formData.type === 'video' && (
                <div>
                  <Label htmlFor="duration">مدت زمان</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="مثال: 5:30"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingItem ? 'به‌روزرسانی' : 'افزودن'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  انصراف
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mediaItems.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-8 text-center">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">هنوز رسانه‌ای اضافه نشده</h3>
              <p className="text-gray-600 mb-4">اولین رسانه خود را اضافه کنید</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                افزودن رسانه
              </Button>
            </Card>
          </div>
        ) : (
          mediaItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100">
                {getMediaPreview(item)}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm truncate flex-1">{item.title}</h3>
                  <div className="flex gap-1 ml-2">
                    <Badge variant="outline" className="text-xs">
                      {getMediaIcon(item.type)}
                      <span className="ml-1">{mediaTypes.find(t => t.value === item.type)?.label}</span>
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={item.is_published ? "default" : "secondary"} className="text-xs">
                    {item.is_published ? 'منتشر شده' : 'پنهان'}
                  </Badge>
                  {item.is_featured && (
                    <Badge variant="outline" className="text-xs">ویژه</Badge>
                  )}
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublished(item.id, item.is_published)}
                    title={item.is_published ? 'پنهان کردن' : 'منتشر کردن'}
                  >
                    {item.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(item)}
                    title="ویرایش"
                  >
                    <Edit className="h-3 w-3 text-blue-600" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    title="حذف"
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EnhancedMediaManager;
