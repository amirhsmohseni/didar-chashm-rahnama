import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Image, Video, FileText } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  image_url: string | null;
  detailed_content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  slug: string | null;
  featured_image: string | null;
  gallery_images: string[] | null;
  video_url: string | null;
  reading_time: number | null;
  is_active: boolean;
  is_featured: boolean;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

const EnhancedServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_content: '',
    icon: '',
    image_url: '',
    featured_image: '',
    video_url: '',
    meta_title: '',
    meta_description: '',
    slug: '',
    reading_time: 5,
    is_active: true,
    is_featured: false,
    order_index: 0,
    gallery_images: [] as string[]
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(service => ({
        ...service,
        gallery_images: Array.isArray(service.gallery_images) 
          ? service.gallery_images 
          : service.gallery_images 
            ? JSON.parse(service.gallery_images as string)
            : []
      }));
      
      setServices(transformedData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('خطا در دریافت خدمات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        ...formData,
        gallery_images: JSON.stringify(formData.gallery_images)
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;
        toast.success('خدمت با موفقیت به‌روزرسانی شد');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);

        if (error) throw error;
        toast.success('خدمت جدید با موفقیت اضافه شد');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('خطا در ذخیره خدمت');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      detailed_content: service.detailed_content || '',
      icon: service.icon || '',
      image_url: service.image_url || '',
      featured_image: service.featured_image || '',
      video_url: service.video_url || '',
      meta_title: service.meta_title || '',
      meta_description: service.meta_description || '',
      slug: service.slug || '',
      reading_time: service.reading_time || 5,
      is_active: service.is_active,
      is_featured: service.is_featured,
      order_index: service.order_index || 0,
      gallery_images: service.gallery_images || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این خدمت را حذف کنید؟')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('خدمت با موفقیت حذف شد');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('خطا در حذف خدمت');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      detailed_content: '',
      icon: '',
      image_url: '',
      featured_image: '',
      video_url: '',
      meta_title: '',
      meta_description: '',
      slug: '',
      reading_time: 5,
      is_active: true,
      is_featured: false,
      order_index: 0,
      gallery_images: []
    });
    setEditingService(null);
  };

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, '']
    }));
  };

  const updateGalleryImage = (index: number, url: string) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.map((img, i) => i === index ? url : img)
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">مدیریت خدمات</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              افزودن خدمت جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}
              </DialogTitle>
              <DialogDescription>
                اطلاعات کامل خدمت را وارد کنید
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">عنوان خدمت</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">نامک (Slug)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="lasik-surgery"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">توضیحات کوتاه</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="detailed_content">محتوای تفصیلی</Label>
                <RichTextEditor
                  value={formData.detailed_content}
                  onChange={(value) => setFormData(prev => ({ ...prev, detailed_content: value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">آیکون</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب آیکون" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Eye">چشم</SelectItem>
                      <SelectItem value="Heart">قلب</SelectItem>
                      <SelectItem value="Stethoscope">گوشی طبی</SelectItem>
                      <SelectItem value="User">کاربر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reading_time">زمان مطالعه (دقیقه)</Label>
                  <Input
                    id="reading_time"
                    type="number"
                    value={formData.reading_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, reading_time: parseInt(e.target.value) || 5 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">تصویر اصلی</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="URL تصویر"
                  />
                </div>

                <div>
                  <Label htmlFor="featured_image">تصویر شاخص</Label>
                  <Input
                    id="featured_image"
                    value={formData.featured_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="URL تصویر شاخص"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="video_url">لینک ویدیو</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="YouTube یا Vimeo URL"
                />
              </div>

              <div>
                <Label>گالری تصاویر</Label>
                <div className="space-y-2">
                  {formData.gallery_images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={image}
                        onChange={(e) => updateGalleryImage(index, e.target.value)}
                        placeholder="URL تصویر"
                      />
                      <Button type="button" variant="outline" onClick={() => removeGalleryImage(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addGalleryImage}>
                    <Plus className="h-4 w-4 mr-2" />
                    افزودن تصویر
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meta_title">عنوان SEO</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="order_index">ترتیب نمایش</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="meta_description">توضیحات SEO</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label>فعال</Label>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label>شاخص</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  انصراف
                </Button>
                <Button type="submit">
                  {editingService ? 'به‌روزرسانی' : 'افزودن'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 space-x-reverse">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="جستجو در خدمات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription className="mt-2">{service.description}</CardDescription>
                </div>
                <div className="flex space-x-1 space-x-reverse">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {service.is_active ? (
                    <Badge variant="default">فعال</Badge>
                  ) : (
                    <Badge variant="secondary">غیرفعال</Badge>
                  )}
                  {service.is_featured && <Badge variant="outline">شاخص</Badge>}
                  {service.slug && <Badge variant="outline">/{service.slug}</Badge>}
                </div>
                
                <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                  {service.image_url && <Image className="h-4 w-4" />}
                  {service.video_url && <Video className="h-4 w-4" />}
                  {service.detailed_content && <FileText className="h-4 w-4" />}
                  {service.gallery_images && service.gallery_images.length > 0 && (
                    <span>{service.gallery_images.length} تصویر</span>
                  )}
                </div>
                
                {service.reading_time && (
                  <div className="text-sm text-gray-500">
                    زمان مطالعه: {service.reading_time} دقیقه
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          هیچ خدمتی یافت نشد
        </div>
      )}
    </div>
  );
};

export default EnhancedServicesManager;
