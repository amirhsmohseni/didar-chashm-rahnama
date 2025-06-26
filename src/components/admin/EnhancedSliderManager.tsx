
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Eye,
  EyeOff,
  Save,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdvancedFileUploader from './AdvancedFileUploader';

interface SliderImage {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  alt_text: string;
  is_active: boolean;
  order_index: number;
  cta_text?: string;
  cta_link?: string;
  created_at: string;
  updated_at: string;
}

const EnhancedSliderManager = () => {
  const [images, setImages] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    alt_text: '',
    is_active: true,
    cta_text: '',
    cta_link: ''
  });

  useEffect(() => {
    loadSliderImages();
  }, []);

  const loadSliderImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('slider_images')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error loading slider images:', error);
        toast.error('خطا در بارگذاری تصاویر اسلایدر');
        return;
      }

      setImages((data as unknown as SliderImage[]) || []);
    } catch (error) {
      console.error('Error in loadSliderImages:', error);
      toast.error('خطا در بارگذاری تصاویر اسلایدر');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image_url || !formData.alt_text) {
      toast.error('لطفا فیلدهای ضروری را پر کنید');
      return;
    }

    try {
      const imageData = {
        ...formData,
        order_index: editingImage ? editingImage.order_index : images.length
      };

      if (editingImage) {
        const { error } = await supabase
          .from('slider_images')
          .update(imageData)
          .eq('id', editingImage.id);

        if (error) throw error;
        toast.success('تصویر با موفقیت به‌روزرسانی شد');
      } else {
        const { error } = await supabase
          .from('slider_images')
          .insert([imageData]);

        if (error) throw error;
        toast.success('تصویر جدید با موفقیت اضافه شد');
      }

      resetForm();
      loadSliderImages();
    } catch (error) {
      console.error('Error saving slider image:', error);
      toast.error('خطا در ذخیره تصویر');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این تصویر مطمئن هستید؟')) return;

    try {
      const { error } = await supabase
        .from('slider_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('تصویر با موفقیت حذف شد');
      loadSliderImages();
    } catch (error) {
      console.error('Error deleting slider image:', error);
      toast.error('خطا در حذف تصویر');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('slider_images')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`تصویر ${!currentStatus ? 'فعال' : 'غیرفعال'} شد`);
      loadSliderImages();
    } catch (error) {
      console.error('Error toggling image status:', error);
      toast.error('خطا در تغییر وضعیت تصویر');
    }
  };

  const updateOrder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    try {
      const currentImage = images[currentIndex];
      const swapImage = images[newIndex];

      await supabase
        .from('slider_images')
        .update({ order_index: swapImage.order_index })
        .eq('id', currentImage.id);

      await supabase
        .from('slider_images')
        .update({ order_index: currentImage.order_index })
        .eq('id', swapImage.id);

      loadSliderImages();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('خطا در تغییر ترتیب');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image_url: '',
      alt_text: '',
      is_active: true,
      cta_text: '',
      cta_link: ''
    });
    setEditingImage(null);
    setShowAddForm(false);
  };

  const startEdit = (image: SliderImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      subtitle: image.subtitle || '',
      description: image.description || '',
      image_url: image.image_url,
      alt_text: image.alt_text,
      is_active: image.is_active,
      cta_text: image.cta_text || '',
      cta_link: image.cta_link || ''
    });
    setShowAddForm(true);
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
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
            <ImageIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مدیریت اسلایدر</h1>
            <p className="text-gray-600 mt-1">مدیریت تصاویر اسلایدر صفحه اصلی</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          افزودن تصویر جدید
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center justify-between">
              <span>{editingImage ? 'ویرایش تصویر' : 'افزودن تصویر جدید'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">عنوان تصویر *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="عنوان تصویر را وارد کنید"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="subtitle">زیرعنوان</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    placeholder="زیرعنوان تصویر"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">توضیحات</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="توضیحات تصویر"
                  rows={3}
                />
              </div>

              <div>
                <Label>تصویر اسلایدر *</Label>
                <AdvancedFileUploader
                  onUploadComplete={(url) => setFormData({...formData, image_url: url})}
                  acceptedTypes={['image/*']}
                  folderPath="slider"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.image_url} 
                      alt="پیش‌نمایش" 
                      className="w-32 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="alt_text">متن جایگزین *</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({...formData, alt_text: e.target.value})}
                  placeholder="متن جایگزین برای تصویر"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cta_text">متن دکمه</Label>
                  <Input
                    id="cta_text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
                    placeholder="مثال: رزرو نوبت"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cta_link">لینک دکمه</Label>
                  <Input
                    id="cta_link"
                    value={formData.cta_link}
                    onChange={(e) => setFormData({...formData, cta_link: e.target.value})}
                    placeholder="/consultation"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label>فعال</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingImage ? 'به‌روزرسانی' : 'افزودن'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  انصراف
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Images List */}
      <div className="grid gap-4">
        {images.length === 0 ? (
          <Card className="p-8 text-center">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">هنوز تصویری اضافه نشده</h3>
            <p className="text-gray-600 mb-4">تصویر اول خود را برای اسلایدر اضافه کنید</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              افزودن تصویر
            </Button>
          </Card>
        ) : (
          images.map((image, index) => (
            <Card key={image.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Image Preview */}
                  <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={image.image_url}
                      alt={image.alt_text}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* Image Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{image.title}</h3>
                      <Badge variant={image.is_active ? "default" : "secondary"}>
                        {image.is_active ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </div>
                    {image.subtitle && (
                      <p className="text-sm text-gray-600 mb-1">{image.subtitle}</p>
                    )}
                    {image.description && (
                      <p className="text-sm text-gray-500 mb-2 line-clamp-1">{image.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>ترتیب: {image.order_index + 1}</span>
                      <span>آخرین ویرایش: {new Date(image.updated_at).toLocaleDateString('fa-IR')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(image.id, image.is_active)}
                      title={image.is_active ? 'غیرفعال کردن' : 'فعال کردن'}
                    >
                      {image.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateOrder(image.id, 'up')}
                        disabled={index === 0}
                        title="انتقال به بالا"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateOrder(image.id, 'down')}
                        disabled={index === images.length - 1}
                        title="انتقال به پایین"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(image)}
                      title="ویرایش"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(image.id)}
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EnhancedSliderManager;
