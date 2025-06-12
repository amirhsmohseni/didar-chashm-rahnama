
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react';
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

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  order_index: number;
  created_at: string;
}

const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    image_url: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', editingService.id);
        
        if (error) throw error;

        // Log activity
        await supabase.rpc('log_admin_activity', {
          action_name: 'update_service',
          resource_type_name: 'services',
          resource_id_value: editingService.id,
          details_data: formData
        });
        
        toast({
          title: "سرویس بروزرسانی شد",
          description: "اطلاعات سرویس با موفقیت بروزرسانی شد",
        });
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert([formData])
          .select()
          .single();
        
        if (error) throw error;

        // Log activity
        await supabase.rpc('log_admin_activity', {
          action_name: 'create_service',
          resource_type_name: 'services',
          resource_id_value: data.id,
          details_data: formData
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

      // Log activity
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

      // Log activity
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
      icon: service.icon || '',
      image_url: service.image_url || '',
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
      icon: '',
      image_url: '',
      is_active: true,
      is_featured: false,
      order_index: 0,
    });
    setEditingService(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            مدیریت سرویس‌ها
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                افزودن سرویس
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'ویرایش سرویس' : 'افزودن سرویس جدید'}
                </DialogTitle>
                <DialogDescription>
                  اطلاعات سرویس را وارد کنید
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">عنوان سرویس</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">توضیحات</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    rows={3}
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
                <div>
                  <label className="block text-sm font-medium mb-1">لینک تصویر</label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ترتیب نمایش</label>
                  <Input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
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
                <DialogFooter>
                  <Button type="submit">
                    {editingService ? 'بروزرسانی' : 'افزودن'}
                  </Button>
                </DialogFooter>
              </form>
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
                <TableHead>آیکون</TableHead>
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
                  <TableCell>{service.icon}</TableCell>
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

export default ServicesManager;
