
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Stethoscope } from 'lucide-react';
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

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string | null;
  education: string | null;
  experience_years: number;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

const DoctorsManager = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    bio: '',
    education: '',
    experience_years: 0,
    image_url: '',
    is_active: true,
    is_featured: false,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDoctor) {
        const { error } = await supabase
          .from('doctors')
          .update(formData)
          .eq('id', editingDoctor.id);
        
        if (error) throw error;
        
        toast({
          title: "پزشک بروزرسانی شد",
          description: "اطلاعات پزشک با موفقیت بروزرسانی شد",
        });
      } else {
        const { error } = await supabase
          .from('doctors')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "پزشک اضافه شد",
          description: "پزشک جدید با موفقیت اضافه شد",
        });
      }
      
      setIsDialogOpen(false);
      setEditingDoctor(null);
      resetForm();
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره اطلاعات پزشک",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این پزشک اطمینان دارید؟')) return;
    
    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "پزشک حذف شد",
        description: "پزشک با موفقیت حذف شد",
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

  const toggleStatus = async (id: string, field: 'is_active' | 'is_featured', currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ [field]: !currentValue })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "وضعیت بروزرسانی شد",
        description: "وضعیت پزشک با موفقیت تغییر کرد",
      });
      
      fetchDoctors();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی وضعیت",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      bio: doctor.bio || '',
      education: doctor.education || '',
      experience_years: doctor.experience_years,
      image_url: doctor.image_url || '',
      is_active: doctor.is_active,
      is_featured: doctor.is_featured,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      bio: '',
      education: '',
      experience_years: 0,
      image_url: '',
      is_active: true,
      is_featured: false,
    });
    setEditingDoctor(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            مدیریت پزشکان
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                افزودن پزشک
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingDoctor ? 'ویرایش پزشک' : 'افزودن پزشک جدید'}
                </DialogTitle>
                <DialogDescription>
                  اطلاعات پزشک را وارد کنید
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">نام پزشک</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">تخصص</label>
                  <Input
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">سابقه (سال)</label>
                  <Input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">تحصیلات</label>
                  <Input
                    value={formData.education}
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
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
                  <label className="block text-sm font-medium mb-1">بیوگرافی</label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={3}
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
                    {editingDoctor ? 'بروزرسانی' : 'افزودن'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
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
                <TableHead>سابقه</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>ویژه</TableHead>
                <TableHead>تاریخ ثبت</TableHead>
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
                    <div className="flex items-center gap-2">
                      {doctor.is_active ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          فعال
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          غیرفعال
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {doctor.is_featured && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        ویژه
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(doctor.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(doctor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(doctor.id, 'is_active', doctor.is_active)}
                      >
                        {doctor.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(doctor.id, 'is_featured', doctor.is_featured)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
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
