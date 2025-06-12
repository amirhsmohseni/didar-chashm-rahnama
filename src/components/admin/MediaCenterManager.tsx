
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Image, Video, FileText, Play } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  file_url: string;
  thumbnail_url: string | null;
  category: string | null;
  duration: string | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  order_index: number | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

const MediaCenterManager = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'image',
    file_url: '',
    thumbnail_url: '',
    category: 'general',
    duration: '',
    is_featured: false,
    is_published: true,
    order_index: 0,
    tags: [] as string[],
  });

  const mediaTypes = [
    { value: 'video', label: 'ویدیو', icon: Video },
    { value: 'image', label: 'تصویر', icon: Image },
    { value: 'document', label: 'سند', icon: FileText }
  ];

  const categories = [
    { value: 'general', label: 'عمومی' },
    { value: 'educational', label: 'آموزشی' },
    { value: 'results', label: 'نتایج جراحی' },
    { value: 'testimonials', label: 'تجربیات بیماران' },
    { value: 'procedures', label: 'روش‌های جراحی' },
    { value: 'equipment', label: 'تجهیزات' }
  ];

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media items:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت رسانه‌ها",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        tags: formData.tags.length > 0 ? formData.tags : null,
        duration: formData.type === 'video' ? formData.duration : null,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('media_items')
          .update(submitData)
          .eq('id', editingItem.id);
        
        if (error) throw error;

        await supabase.rpc('log_admin_activity', {
          action_name: 'update_media',
          resource_type_name: 'media_items',
          resource_id_value: editingItem.id,
          details_data: submitData
        });
        
        toast({
          title: "رسانه بروزرسانی شد",
          description: "اطلاعات رسانه با موفقیت بروزرسانی شد",
        });
      } else {
        const { data, error } = await supabase
          .from('media_items')
          .insert([submitData])
          .select()
          .single();
        
        if (error) throw error;

        await supabase.rpc('log_admin_activity', {
          action_name: 'create_media',
          resource_type_name: 'media_items',
          resource_id_value: data.id,
          details_data: submitData
        });
        
        toast({
          title: "رسانه اضافه شد",
          description: "رسانه جدید با موفقیت اضافه شد",
        });
      }
      
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchMediaItems();
    } catch (error) {
      console.error('Error saving media:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره رسانه",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این رسانه اطمینان دارید؟')) return;
    
    try {
      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      await supabase.rpc('log_admin_activity', {
        action_name: 'delete_media',
        resource_type_name: 'media_items',
        resource_id_value: id
      });
      
      toast({
        title: "رسانه حذف شد",
        description: "رسانه با موفقیت حذف شد",
      });
      
      fetchMediaItems();
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف رسانه",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string, field: 'is_published' | 'is_featured', currentValue: boolean | null) => {
    try {
      const { error } = await supabase
        .from('media_items')
        .update({ [field]: !currentValue })
        .eq('id', id);
      
      if (error) throw error;

      await supabase.rpc('log_admin_activity', {
        action_name: `toggle_media_${field}`,
        resource_type_name: 'media_items',
        resource_id_value: id,
        details_data: { [field]: !currentValue }
      });
      
      toast({
        title: "وضعیت بروزرسانی شد",
        description: "وضعیت رسانه با موفقیت تغییر کرد",
      });
      
      fetchMediaItems();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی وضعیت",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (item: MediaItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      file_url: item.file_url,
      thumbnail_url: item.thumbnail_url || '',
      category: item.category || 'general',
      duration: item.duration || '',
      is_featured: item.is_featured !== false,
      is_published: item.is_published !== false,
      order_index: item.order_index || 0,
      tags: item.tags || [],
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'image',
      file_url: '',
      thumbnail_url: '',
      category: 'general',
      duration: '',
      is_featured: false,
      is_published: true,
      order_index: 0,
      tags: [],
    });
    setEditingItem(null);
  };

  const getTypeIcon = (type: string) => {
    const typeData = mediaTypes.find(t => t.value === type);
    if (!typeData) return Image;
    return typeData.icon;
  };

  const getCategoryLabel = (category: string | null) => {
    return categories.find(c => c.value === category)?.label || 'عمومی';
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData({...formData, tags});
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            مدیریت مرکز رسانه
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                افزودن رسانه
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'ویرایش رسانه' : 'افزودن رسانه جدید'}
                </DialogTitle>
                <DialogDescription>
                  اطلاعات رسانه را وارد کنید
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">عنوان</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">نوع رسانه</label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
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
                  <label className="block text-sm font-medium mb-1">توضیحات</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">لینک فایل</label>
                  <Input
                    value={formData.file_url}
                    onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                    required
                    placeholder="https://example.com/file.mp4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">تصویر پیش‌نمایش</label>
                  <Input
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">دسته‌بندی</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
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
                  
                  {formData.type === 'video' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">مدت زمان</label>
                      <Input
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        placeholder="4:30"
                      />
                    </div>
                  )}
                  
                  {formData.type !== 'video' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">ترتیب نمایش</label>
                      <Input
                        type="number"
                        value={formData.order_index}
                        onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                        min="0"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">برچسب‌ها (با کاما جدا کنید)</label>
                  <Input
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="جراحی, لازیک, چشم"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                    />
                    <label className="text-sm">منتشر شده</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                    />
                    <label className="text-sm">ویژه</label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">
                    {editingItem ? 'بروزرسانی' : 'افزودن'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {mediaItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هیچ رسانه‌ای ثبت نشده است
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نوع</TableHead>
                <TableHead>عنوان</TableHead>
                <TableHead>دسته‌بندی</TableHead>
                <TableHead>مدت زمان</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mediaItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4" />
                        <span className="text-sm">
                          {mediaTypes.find(t => t.value === item.type)?.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getCategoryLabel(item.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.duration || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {item.is_published ? (
                          <Badge variant="default" className="flex items-center gap-1 w-fit">
                            <Eye className="h-3 w-3" />
                            منتشر شده
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            <EyeOff className="h-3 w-3" />
                            پیش‌نویس
                          </Badge>
                        )}
                        {item.is_featured && (
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
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(item.id, 'is_published', item.is_published)}
                        >
                          {item.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(item.id, 'is_featured', item.is_featured)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaCenterManager;
