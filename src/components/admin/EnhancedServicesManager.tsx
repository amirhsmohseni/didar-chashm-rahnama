
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Image, Video, FileText } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from './RichTextEditor';

interface Service {
  id: string;
  title: string;
  description: string;
  detailed_content: string | null;
  icon: string | null;
  image_url: string | null;
  featured_image: string | null;
  gallery_images: string[] | null;
  video_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  slug: string | null;
  reading_time: number | null;
  is_active: boolean;
  is_featured: boolean;
  order_index: number;
  created_at: string;
}

const EnhancedServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_content: '',
    icon: '',
    image_url: '',
    featured_image: '',
    gallery_images: [] as string[],
    video_url: '',
    meta_title: '',
    meta_description: '',
    slug: '',
    reading_time: 5,
    is_active: true,
    is_featured: false,
    order_index: 0,
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
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت سرویس‌ها",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9آ-ی\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        meta_title: formData.meta_title || formData.title + ' - دیدار چشم رهنما',
        gallery_images: formData.gallery_images.length > 0 ? formData.gallery_images : null,
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(submitData)
          .eq('id', editingService.id);
        
        if (error) throw error;

        await supabase.rpc('log_admin_activity', {
          action_name: 'update_service',
          resource_type_name: 'services',
          resource_id_value: editingService.id,
          details_data: submitData
        });
        
        toast({
          title: "سرویس بروزرسانی شد",
          description: "اطلاعات سرویس با موفقیت بروزرسانی شد",
        });
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert([submitData])
          .select()
          .single();
        
        if (error) throw error;

        await supabase.rpc('log_admin_activity', {
          action_name: 'create_service',
          resource_type_name: 'services',
          resource_id_value: data.id,
          details_data: submitData
        });
        
        toast({
          title: "سرویس اضافه شد",
          description: "سرویس جدید با موفقیت اضافه شد",
        });
      }
      
      setIsDialogOpen(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره اطلاعات سرویس",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این سرویس اطمینان دارید؟')) return;
    
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      await supabase.rpc('log_admin_activity', {
        action_name: 'delete_service',
        resource_type_name: 'services',
        resource_id_value: id
      });
      
      toast({
        title: "سرویس حذف شد",
        description: "سرویس با موفقیت حذف شد",
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف سرویس",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string, field: 'is_active' | 'is_featured', currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ [field]: !currentValue })
        .eq('id', id);
      
      if (error) throw error;

      await supabase.rpc('log_admin_activity', {
        action_name: `toggle_service_${field}`,
        resource_type_name: 'services',
        resource_id_value: id,
        details_data: { [field]: !currentValue }
      });
      
      toast({
        title: "وضعیت بروزرسانی شد",
        description: "وضعیت سرویس با موفقیت تغییر کرد",
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی وضعیت",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      detailed_content: service.detailed_content || '',
      icon: service.icon || '',
      image_url: service.image_url || '',
      featured_image: service.featured_image || '',
      gallery_images: service.gallery_images || [],
      video_url: service.video_url || '',
      meta_title: service.meta_title || '',
      meta_description: service.meta_description || '',
      slug: service.slug || '',
      reading_time: service.reading_time || 5,
      is_active: service.is_active,
      is_featured: service.is_featured,
      order_index: service.order_index,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      detailed_content: '',
      icon: '',
      image_url: '',
      featured_image: '',
      gallery_images: [],
      video_url: '',
      meta_title: '',
      meta_description: '',
      slug: '',
      reading_time: 5,
      is_active: true,
      is_featured: false,
      order_index: 0,
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

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            مدیریت خدمات پیشرفته
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                افزودن سرویس
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'ویرایش سرویس' : 'افزودن سرویس جدید'}
                </DialogTitle>
                <DialogDescription>
                  اطلاعات کامل سرویس را وارد کنید
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">اطلاعات پایه</TabsTrigger>
                  <TabsTrigger value="content">محتوا</TabsTrigger>
                  <TabsTrigger value="media">رسانه</TabsTrigger>
                  <TabsTrigger value="seo">سئو</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit}>
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">عنوان سرویس</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">آیکون (نام Lucide)</label>
                        <Input
                          value={formData.icon}
                          onChange={(e) => setFormData({...formData, icon: e.target.value})}
                          placeholder="Eye, Heart, Stethoscope..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">توضیحات کوتاه</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">ترتیب نمایش</label>
                        <Input
                          type="number"
                          value={formData.order_index}
                          onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">زمان مطالعه (دقیقه)</label>
                        <Input
                          type="number"
                          value={formData.reading_time}
                          onChange={(e) => setFormData({...formData, reading_time: parseInt(e.target.value) || 5})}
                          min="1"
                        />
                      </div>
                      <div className="flex items-center space-x-4 pt-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                          />
                          <label className="text-sm">فعال</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={formData.is_featured}
                            onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                          />
                          <label className="text-sm">ویژه</label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">محتوای تفصیلی</label>
                      <RichTextEditor
                        value={formData.detailed_content}
                        onChange={(content) => setFormData({...formData, detailed_content: content})}
                        placeholder="محتوای کامل سرویس را اینجا بنویسید..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">تصویر اصلی</label>
                      <Input
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">تصویر ویژه</label>
                      <Input
                        value={formData.featured_image}
                        onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                        placeholder="https://example.com/featured-image.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">ویدیو</label>
                      <Input
                        value={formData.video_url}
                        onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium">گالری تصاویر</label>
                        <Button type="button" variant="outline" size="sm" onClick={addGalleryImage}>
                          <Image className="h-4 w-4 mr-1" />
                          افزودن تصویر
                        </Button>
                      </div>
                      {formData.gallery_images.map((img, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={img}
                            onChange={(e) => updateGalleryImage(index, e.target.value)}
                            placeholder="https://example.com/gallery-image.jpg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">عنوان سئو</label>
                      <Input
                        value={formData.meta_title}
                        onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                        placeholder="عنوان برای موتورهای جستجو"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">توضیحات سئو</label>
                      <Textarea
                        value={formData.meta_description}
                        onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                        placeholder="توضیحاتی برای موتورهای جستجو"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">اسلاگ URL</label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        placeholder="service-url-slug"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        اگر خالی باشد، به طور خودکار از عنوان ایجاد می‌شود
                      </p>
                    </div>
                  </TabsContent>

                  <DialogFooter className="mt-6">
                    <Button type="submit">
                      {editingService ? 'بروزرسانی' : 'افزودن'}
                    </Button>
                  </DialogFooter>
                </form>
              </Tabs>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هیچ سرویسی ثبت نشده است
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>توضیحات</TableHead>
                <TableHead>محتوا</TableHead>
                <TableHead>ترتیب</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {service.detailed_content && (
                        <Badge variant="secondary" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          محتوا
                        </Badge>
                      )}
                      {service.video_url && (
                        <Badge variant="secondary" className="text-xs">
                          <Video className="h-3 w-3 mr-1" />
                          ویدیو
                        </Badge>
                      )}
                      {service.gallery_images && service.gallery_images.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Image className="h-3 w-3 mr-1" />
                          {service.gallery_images.length}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{service.order_index}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {service.is_active ? (
                        <Badge variant="default" className="flex items-center gap-1 w-fit">
                          <Eye className="h-3 w-3" />
                          فعال
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          <EyeOff className="h-3 w-3" />
                          غیرفعال
                        </Badge>
                      )}
                      {service.is_featured && (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <Star className="h-3 w-3" />
                          ویژه
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(service.id, 'is_active', service.is_active)}
                      >
                        {service.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(service.id, 'is_featured', service.is_featured)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedServicesManager;
