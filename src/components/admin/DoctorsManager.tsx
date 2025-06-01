
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const doctorSchema = z.object({
  name: z.string().min(2, { message: "نام باید حداقل 2 حرف باشد" }),
  specialty: z.string().min(2, { message: "تخصص باید حداقل 2 حرف باشد" }),
  subspecialty: z.string().optional(),
  city: z.string().min(2, { message: "شهر باید حداقل 2 حرف باشد" }),
  experience: z.number().min(0, { message: "سابقه کار نمی‌تواند منفی باشد" }),
  bio: z.string().optional(),
  img_url: z.string().optional(),
  expertise: z.string().min(1, { message: "حداقل یک تخصص وارد کنید" }),
});

const DoctorsManager = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof doctorSchema>>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      specialty: "",
      subspecialty: "",
      city: "",
      experience: 0,
      bio: "",
      img_url: "",
      expertise: "",
    },
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت اطلاعات پزشکان",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof doctorSchema>) => {
    try {
      const expertise = data.expertise.split(',').map(item => item.trim());
      
      const doctorData = {
        ...data,
        expertise,
        experience: Number(data.experience),
      };

      if (editingDoctor) {
        const { error } = await supabase
          .from('doctors' as any)
          .update(doctorData)
          .eq('id', editingDoctor.id);

        if (error) throw error;

        toast({
          title: "ویرایش موفق",
          description: "اطلاعات پزشک با موفقیت ویرایش شد",
        });
      } else {
        const { error } = await supabase
          .from('doctors' as any)
          .insert([doctorData]);

        if (error) throw error;

        toast({
          title: "اضافه شد",
          description: "پزشک جدید با موفقیت اضافه شد",
        });
      }

      setIsDialogOpen(false);
      setEditingDoctor(null);
      form.reset();
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره اطلاعات",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (doctor: any) => {
    setEditingDoctor(doctor);
    form.reset({
      name: doctor.name,
      specialty: doctor.specialty,
      subspecialty: doctor.subspecialty || "",
      city: doctor.city,
      experience: doctor.experience,
      bio: doctor.bio || "",
      img_url: doctor.img_url || "",
      expertise: doctor.expertise?.join(', ') || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (doctorId: string) => {
    if (!confirm('آیا از حذف این پزشک مطمئن هستید؟')) return;

    try {
      const { error } = await supabase
        .from('doctors' as any)
        .delete()
        .eq('id', doctorId);

      if (error) throw error;

      toast({
        title: "حذف شد",
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

  const handleAddNew = () => {
    setEditingDoctor(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>مدیریت پزشکان</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="ml-2 h-4 w-4" />
                افزودن پزشک جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDoctor ? 'ویرایش پزشک' : 'افزودن پزشک جدید'}
                </DialogTitle>
                <DialogDescription>
                  اطلاعات پزشک را تکمیل کنید
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نام پزشک</FormLabel>
                          <FormControl>
                            <Input placeholder="دکتر ..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تخصص</FormLabel>
                          <FormControl>
                            <Input placeholder="متخصص چشم" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="subspecialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>فوق تخصص (اختیاری)</FormLabel>
                          <FormControl>
                            <Input placeholder="جراحی شبکیه" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>شهر</FormLabel>
                          <FormControl>
                            <Input placeholder="تهران" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>سابقه کار (سال)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="10" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="img_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL عکس (اختیاری)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="expertise"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تخصص‌ها (با کاما جدا کنید)</FormLabel>
                        <FormControl>
                          <Input placeholder="لازیک، آب مروارید، جراحی شبکیه" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>بیوگرافی (اختیاری)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="توضیحات کوتاه درباره پزشک..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      لغو
                    </Button>
                    <Button type="submit">
                      <Save className="ml-2 h-4 w-4" />
                      ذخیره
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
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
                <TableHead>شهر</TableHead>
                <TableHead>سابقه</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.city}</TableCell>
                  <TableCell>{doctor.experience} سال</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(doctor)}
                      >
                        <Edit className="h-4 w-4" />
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
