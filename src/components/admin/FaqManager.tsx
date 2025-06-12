
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, HelpCircle } from 'lucide-react';
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

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  is_published: boolean | null;
  order_index: number | null;
  created_at: string | null;
  updated_at: string | null;
}

const FaqManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    is_published: true,
    order_index: 0,
  });

  const categories = [
    { value: 'general', label: 'عمومی' },
    { value: 'surgery', label: 'جراحی' },
    { value: 'consultation', label: 'مشاوره' },
    { value: 'insurance', label: 'بیمه' },
    { value: 'aftercare', label: 'مراقبت پس از جراحی' },
    { value: 'costs', label: 'هزینه‌ها' }
  ];

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت سوالات متداول",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFaq) {
        const { error } = await supabase
          .from('faqs')
          .update(formData)
          .eq('id', editingFaq.id);
        
        if (error) throw error;

        await supabase.rpc('log_admin_activity', {
          action_name: 'update_faq',
          resource_type_name: 'faqs',
          resource_id_value: editingFaq.id,
          details_data: formData
        });
        
        toast({
          title: "سوال بروزرسانی شد",
          description: "سوال متداول با موفقیت بروزرسانی شد",
        });
      } else {
        const { data, error } = await supabase
          .from('faqs')
          .insert([formData])
          .select()
          .single();
        
        if (error) throw error;

        await supabase.rpc('log_admin_activity', {
          action_name: 'create_faq',
          resource_type_name: 'faqs',
          resource_id_value: data.id,
          details_data: formData
        });
        
        toast({
          title: "سوال اضافه شد",
          description: "سوال متداول جدید با موفقیت اضافه شد",
        });
      }
      
      setIsDialogOpen(false);
      setEditingFaq(null);
      resetForm();
      fetchFaqs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره سوال متداول",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این سوال اطمینان دارید؟')) return;
    
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      await supabase.rpc('log_admin_activity', {
        action_name: 'delete_faq',
        resource_type_name: 'faqs',
        resource_id_value: id
      });
      
      toast({
        title: "سوال حذف شد",
        description: "سوال متداول با موفقیت حذف شد",
      });
      
      fetchFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف سوال متداول",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (id: string, currentValue: boolean | null) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({ is_published: !currentValue })
        .eq('id', id);
      
      if (error) throw error;

      await supabase.rpc('log_admin_activity', {
        action_name: 'toggle_faq_published',
        resource_type_name: 'faqs',
        resource_id_value: id,
        details_data: { is_published: !currentValue }
      });
      
      toast({
        title: "وضعیت بروزرسانی شد",
        description: "وضعیت انتشار سوال تغییر کرد",
      });
      
      fetchFaqs();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی وضعیت",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'general',
      is_published: faq.is_published !== false,
      order_index: faq.order_index || 0,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      is_published: true,
      order_index: 0,
    });
    setEditingFaq(null);
  };

  const getCategoryLabel = (category: string | null) => {
    return categories.find(c => c.value === category)?.label || 'عمومی';
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            مدیریت سوالات متداول
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                افزودن سوال
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingFaq ? 'ویرایش سوال' : 'افزودن سوال جدید'}
                </DialogTitle>
                <DialogDescription>
                  سوال و پاسخ را وارد کنید
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">سوال</label>
                  <Input
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    required
                    placeholder="سوال شما..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">پاسخ</label>
                  <Textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({...formData, answer: e.target.value})}
                    required
                    rows={4}
                    placeholder="پاسخ تفصیلی..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">دسته‌بندی</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
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
                    <label className="block text-sm font-medium mb-1">ترتیب نمایش</label>
                    <Input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                  />
                  <label className="text-sm">منتشر شده</label>
                </div>

                <DialogFooter>
                  <Button type="submit">
                    {editingFaq ? 'بروزرسانی' : 'افزودن'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {faqs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هیچ سوالی ثبت نشده است
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>سوال</TableHead>
                <TableHead>پاسخ</TableHead>
                <TableHead>دسته‌بندی</TableHead>
                <TableHead>ترتیب</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium max-w-xs truncate">{faq.question}</TableCell>
                  <TableCell className="max-w-sm truncate">{faq.answer}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getCategoryLabel(faq.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>{faq.order_index}</TableCell>
                  <TableCell>
                    {faq.is_published ? (
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
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(faq)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublished(faq.id, faq.is_published)}
                      >
                        {faq.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(faq.id)}
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

export default FaqManager;
