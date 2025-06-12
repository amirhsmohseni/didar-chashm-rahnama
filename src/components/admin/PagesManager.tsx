
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, FileText } from 'lucide-react';
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

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  featured_image: string | null;
  is_published: boolean | null;
  template: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const PagesManager = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    meta_title: '',
    meta_description: '',
    featured_image: '',
    is_published: true,
    template: 'default',
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت صفحات",
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
        meta_title: formData.meta_title || formData.title,
      };

      if (editingPage) {
        const { error } = await supabase
          .from('pages')
          .update(submitData)
          .eq('id', editingPage.id);
        
        if (error) throw error;

        await supabase.rpc('log_admin_activity', {
          action_name: 'update_page',
          resource_type_name: 'pages',
          resource_id_value: editingPage.id,
          details_data: submitData
        });
        
        toast({
          title: "صفحه بروزرسانی شد",
          description: "صفحه با موفقیت بروزرسانی شد",
        });
      } else {
        const { data, error } = await supabase
          .from('pages')
          .insert([submitData])
          .select()
          .single();
        
        if (error) throw error;

        await supabase.rpc('log_admin_activity', {
          action_name: 'create_page',
          resource_type_name: 'pages',
          resource_id_value: data.id,
          details_data: submitData
        });
        
        toast({
          title: "صفحه اضافه شد",
          description: "صفحه جدید با موفقیت اضافه شد",
        });
      }
      
      setIsDialogOpen(false);
      setEditingPage(null);
      resetForm();
      fetchPages();
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره صفحه",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    if (slug === 'about') {
      toast({
        title: "خطا",
        description: "صفحه درباره ما قابل حذف نیست",
        variant: "destructive",
      });
      return;
    }

    if (!confirm('آیا از حذف این صفحه اطمینان دارید؟')) return;
    
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      await supabase.rpc('log_admin_activity', {
        action_name: 'delete_page',
        resource_type_name: 'pages',
        resource_id_value: id
      });
      
      toast({
        title: "صفحه حذف شد",
        description: "صفحه با موفقیت حذف شد",
      });
      
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف صفحه",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (id: string, currentValue: boolean | null) => {
    try {
      const { error } = await supabase
        .from('pages')
        .update({ is_published: !currentValue })
        .eq('id', id);
      
      if (error) throw error;

      await supabase.rpc('log_admin_activity', {
        action_name: 'toggle_page_published',
        resource_type_name: 'pages',
        resource_id_value: id,
        details_data: { is_published: !currentValue }
      });
      
      toast({
        title: "وضعیت بروزرسانی شد",
        description: "وضعیت انتشار صفحه تغییر کرد",
      });
      
      fetchPages();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی وضعیت",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      excerpt: page.excerpt || '',
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      featured_image: page.featured_image || '',
      is_published: page.is_published !== false,
      template: page.template || 'default',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      meta_title: '',
      meta_description: '',
      featured_image: '',
      is_published: true,
      template: 'default',
    });
    setEditingPage(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
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
            <FileText className="h-5 w-5" />
            مدیریت صفحات
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                افزودن صفحه
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPage ? 'ویرایش صفحه' : 'افزودن صفحه جدید'}
                </DialogTitle>
                <DialogDescription>
                  اطلاعات کامل صفحه را وارد کنید
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">محتوا</TabsTrigger>
                  <TabsTrigger value="settings">تنظیمات</TabsTrigger>
                  <TabsTrigger value="seo">سئو</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit}>
                  <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">عنوان صفحه</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">اسلاگ URL</label>
                        <Input
                          value={formData.slug}
                          onChange={(e) => setFormData({...formData, slug: e.target.value})}
                          placeholder="page-slug"
                          disabled={editingPage?.slug === 'about'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">خلاصه</label>
                      <Textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                        rows={2}
                        placeholder="خلاصه‌ای از محتوای صفحه..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">محتوای صفحه</label>
                      <RichTextEditor
                        value={formData.content}
                        onChange={(content) => setFormData({...formData, content})}
                        placeholder="محتوای کامل صفحه را اینجا بنویسید..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">تصویر ویژه</label>
                      <Input
                        value={formData.featured_image}
                        onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                        placeholder="https://example.com/featured-image.jpg"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.is_published}
                        onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                      />
                      <label className="text-sm">منتشر شده</label>
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
                  </TabsContent>

                  <DialogFooter className="mt-6">
                    <Button type="submit">
                      {editingPage ? 'بروزرسانی' : 'افزودن'}
                    </Button>
                  </DialogFooter>
                </form>
              </Tabs>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {pages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هیچ صفحه‌ای ثبت نشده است
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>اسلاگ</TableHead>
                <TableHead>تاریخ ایجاد</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      /{page.slug}
                    </code>
                  </TableCell>
                  <TableCell>{formatDate(page.created_at)}</TableCell>
                  <TableCell>
                    {page.is_published ? (
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
                        onClick={() => openEditDialog(page)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {page.slug !== 'about' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePublished(page.id, page.is_published)}
                          >
                            {page.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(page.id, page.slug)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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

export default PagesManager;
