
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Stethoscope, Upload } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string | null;
  education: string | null;
  experience_years: number;
  image_url: string | null;
  profile_description: string | null;
  consultation_fee: number | null;
  available_days: string[] | null;
  available_hours: string | null;
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
    profile_description: '',
    consultation_fee: 0,
    available_days: [] as string[],
    available_hours: '',
    is_active: true,
    is_featured: false,
  });

  const weekDays = [
    { value: 'saturday', label: 'شنبه' },
    { value: 'sunday', label: 'یکشنبه' },
    { value: 'monday', label: 'دوشنبه' },
    { value: 'tuesday', label: 'سه‌شنبه' },
    { value: 'wednesday', label: 'چهارشنبه' },
    { value: 'thursday', label: 'پنج‌شنبه' },
    { value: 'friday', label: 'جمعه' }
  ];

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
      const submitData = {
        ...formData,
        available_days: formData.available_days.length > 0 ? formData.available_days : null,
        consultation_fee: formData.consultation_fee || null
      };

      if (editingDoctor) {
        const { error } = await supabase
          .from('doctors')
          .update(submitData)
          .eq('id', editingDoctor.id);
        
        if (error) throw error;

        // Log activity
        await supabase.rpc('log_admin_activity', {
          action_name: 'update_doctor',
          resource_type_name: 'doctors',
          resource_id_value: editingDoctor.id,
          details_data: submitData
        });
        
        toast({
          title: "پزشک بروزرسانی شد",
          description: "اطلاعات پزشک با موفقیت بروزرسانی شد",
        });
      } else {
        const { data, error } = await supabase
          .from('doctors')
          .insert([submitData])
          .select()
          .single();
        
        if (error) throw error;

        // Log activity
        await supabase.rpc('log_admin_activity', {
          action_name: 'create_doctor',
          resource_type_name: 'doctors',
          resource_id_value: data.id,
          details_data: submitData
        });
        
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

      // Log activity
      await supabase.rpc('log_admin_activity', {
        action_name: 'delete_doctor',
        resource_type_name: 'doctors',
        resource_id_value: id
      });
      
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

      // Log activity
      await supabase.rpc('log_admin_activity', {
        action_name: `toggle_doctor_${field}`,
        resource_type_name: 'doctors',
        resource_id_value: id,
        details_data: { [field]: !currentValue }
      });
      
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
      profile_description: doctor.profile_description || '',
      consultation_fee: doctor.consultation_fee || 0,
      available_days: doctor.available_days || [],
      available_hours: doctor.available_hours || '',
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
      profile_description: '',
      consultation_fee: 0,
      available_days: [],
      available_hours: '',
      is_active: true,
      is_featured: false,
    });
    setEditingDoctor(null);
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter(d => d !== day)
        : [...prev.available_days, day]
    }));
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDoctor ? 'ویرایش پزشک' : 'افزودن پزشک جدید'}
                </DialogTitle>
                <DialogDescription>
                  اطلاعات کامل پزشک را وارد کنید
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium mb-1">هزینه ویزیت (تومان)</label>
                    <Input
                      type="number"
                      value={formData.consultation_fee}
                      onChange={(e) => setFormData({...formData, consultation_fee: parseInt(e.target.value) || 0})}
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">تحصیلات</label>
                  <Input
                    value={formData.education}
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">لینک تصویر پروفایل</label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image_url && (
                    <div className="mt-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={formData.image_url} alt="Preview" />
                        <AvatarFallback>{formData.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">بیوگرافی کوتاه</label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">توضیحات پروفایل</label>
                  <Textarea
                    value={formData.profile_description}
                    onChange={(e) => setFormData({...formData, profile_description: e.target.value})}
                    rows={4}
                    placeholder="توضیحات تکمیلی درباره پزشک، تجربیات، نظرات بیماران و ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">روزهای در دسترس</label>
                  <div className="grid grid-cols-3 gap-2">
                    {weekDays.map((day) => (
                      <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.available_days.includes(day.value)}
                          onChange={() => handleDayToggle(day.value)}
                          className="rounded"
                        />
                        <span className="text-sm">{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">ساعات کاری</label>
                  <Input
                    value={formData.available_hours}
                    onChange={(e) => setFormData({...formData, available_hours: e.target.value})}
                    placeholder="مثال: 9:00-17:00"
                  />
                </div>

                <div className="flex items-center space-x-4">
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
                <TableHead>تصویر</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>تخصص</TableHead>
                <TableHead>سابقه</TableHead>
                <TableHead>هزینه ویزیت</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ ثبت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={doctor.image_url || ''} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.experience_years} سال</TableCell>
                  <TableCell>
                    {doctor.consultation_fee ? `${doctor.consultation_fee.toLocaleString()} تومان` : 'مشخص نشده'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Switch
                        checked={doctor.is_active}
                        onCheckedChange={() => toggleStatus(doctor.id, 'is_active', doctor.is_active)}
                        size="sm"
                      />
                      <span className="text-xs">
                        {doctor.is_active ? 'فعال' : 'غیرفعال'}
                      </span>
                      {doctor.is_featured && (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit text-xs">
                          <Star className="h-3 w-3" />
                          ویژه
                        </Badge>
                      )}
                    </div>
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
                        onClick={() => toggleStatus(doctor.id, 'is_featured', doctor.is_featured)}
                        title={doctor.is_featured ? 'حذف از ویژه' : 'افزودن به ویژه'}
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
