
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience_years: number;
  education: string | null;
  image_url: string | null;
  bio: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

const DoctorsManager = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    experience_years: 0,
    education: '',
    image_url: '',
    bio: '',
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت پزشکان",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      experience_years: 0,
      education: '',
      image_url: '',
      bio: '',
      is_featured: false,
      is_active: true,
    });
    setEditingDoctor(null);
  };

  const openModal = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        specialty: doctor.specialty,
        experience_years: doctor.experience_years,
        education: doctor.education || '',
        image_url: doctor.image_url || '',
        bio: doctor.bio || '',
        is_featured: doctor.is_featured,
        is_active: doctor.is_active,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.specialty) {
      toast({
        title: "خطا",
        description: "نام و تخصص الزامی است",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingDoctor) {
        // Update existing doctor
        const { error } = await supabase
          .from('doctors')
          .update(formData)
          .eq('id', editingDoctor.id);

        if (error) throw error;

        toast({
          title: "بروزرسانی موفق",
          description: "اطلاعات پزشک بروزرسانی شد",
        });
      } else {
        // Create new doctor
        const { error } = await supabase
          .from('doctors')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "ایجاد موفق",
          description: "پزشک جدید اضافه شد",
        });
      }

      fetchDoctors();
      closeModal();
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره اطلاعات",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (doctorId: string) => {
    if (!confirm('آیا از حذف این پزشک اطمینان دارید؟')) return;

    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', doctorId);

      if (error) throw error;

      toast({
        title: "حذف موفق",
        description: "پزشک حذف شد",
      });
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف پزشک",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (doctorId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ is_active: !currentStatus })
        .eq('id', doctorId);

      if (error) throw error;

      toast({
        title: "بروزرسانی موفق",
        description: `وضعیت پزشک ${!currentStatus ? 'فعال' : 'غیرفعال'} شد`,
      });
      fetchDoctors();
    } catch (error) {
      console.error('Error updating doctor status:', error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی وضعیت",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>مدیریت پزشکان</CardTitle>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}>
              <Plus className="h-4 w-4 mr-2" />
              افزودن پزشک
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDoctor ? 'ویرایش پزشک' : 'افزودن پزشک جدید'}
              </DialogTitle>
              <DialogDescription>
                اطلاعات پزشک را وارد کنید
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">نام</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="نام پزشک"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">تخصص</label>
                  <Input
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    placeholder="تخصص"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">سال تجربه</label>
                  <Input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value) || 0})}
                    placeholder="سال تجربه"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">تحصیلات</label>
                  <Input
                    value={formData.education}
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                    placeholder="تحصیلات"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL تصویر</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="لینک تصویر پزشک"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">بیوگرافی</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="بیوگرافی پزشک"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                  />
                  <label className="text-sm">پزشک برجسته</label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <label className="text-sm">فعال</label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingDoctor ? 'بروزرسانی' : 'ایجاد'}
                </Button>
                <Button type="button" variant="outline" onClick={closeModal}>
                  انصراف
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {doctors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هیچ پزشکی ثبت نشده است
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>تخصص</TableHead>
                <TableHead>تجربه</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>برجسته</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.experience_years} سال</TableCell>
                  <TableCell>
                    <Badge variant={doctor.is_active ? 'default' : 'secondary'}>
                      {doctor.is_active ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={doctor.is_featured ? 'destructive' : 'outline'}>
                      {doctor.is_featured ? 'برجسته' : 'عادی'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openModal(doctor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(doctor.id, doctor.is_active)}
                      >
                        {doctor.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(doctor.id)}
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

export default DoctorsManager;
