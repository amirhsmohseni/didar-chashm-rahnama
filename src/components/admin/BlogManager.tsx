
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
import { Switch } from "@/components/ui/switch";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  slug: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    slug: '',
    is_published: false,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت مقالات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      slug: '',
      is_published: false,
    });
    setEditingPost(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        image_url: post.image_url || '',
        slug: post.slug || '',
        is_published: post.is_published,
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
    
    if (!formData.title || !formData.content) {
      toast({
        title: "خطا",
        description: "عنوان و محتوا الزامی است",
        variant: "destructive",
      });
      return;
    }

    const slug = formData.slug || generateSlug(formData.title);
    const dataToSave = {
      ...formData,
      slug,
      published_at: formData.is_published ? new Date().toISOString() : null,
    };

    try {
      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(dataToSave)
          .eq('id', editingPost.id);

        if (error) throw error;

        toast({
          title: "بروزرسانی موفق",
          description: "مقاله بروزرسانی شد",
        });
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([dataToSave]);

        if (error) throw error;

        toast({
          title: "ایجاد موفق",
          description: "مقاله جدید اضافه شد",
        });
      }

      fetchPosts();
      closeModal();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره مقاله",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('آیا از حذف این مقاله اطمینان دارید؟')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "حذف موفق",
        description: "مقاله حذف شد",
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف مقاله",
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          is_published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "بروزرسانی موفق",
        description: `مقاله ${!currentStatus ? 'منتشر' : 'پیش‌نویس'} شد`,
      });
      fetchPosts();
    } catch (error) {
      console.error('Error updating post status:', error);
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
        <CardTitle>مدیریت مقالات</CardTitle>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}>
              <Plus className="h-4 w-4 mr-2" />
              افزودن مقاله
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'ویرایش مقاله' : 'افزودن مقاله جدید'}
              </DialogTitle>
              <DialogDescription>
                اطلاعات مقاله را وارد کنید
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">عنوان</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="عنوان مقاله"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسلاگ (URL)</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="اسلاگ مقاله (اختیاری)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL تصویر</label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="لینک تصویر مقاله"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">خلاصه</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="خلاصه‌ای از مقاله"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">محتوا</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="محتوای مقاله"
                  rows={10}
                  required
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                />
                <label className="text-sm">انتشار مقاله</label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingPost ? 'بروزرسانی' : 'ایجاد'}
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
        {posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هیچ مقاله‌ای ثبت نشده است
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ ایجاد</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.is_published ? 'default' : 'secondary'}>
                      {post.is_published ? 'منتشر شده' : 'پیش‌نویس'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(post.created_at).toLocaleDateString('fa-IR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openModal(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublish(post.id, post.is_published)}
                      >
                        {post.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(post.id)}
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

export default BlogManager;
