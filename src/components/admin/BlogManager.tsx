
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

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  slug: string | null;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    slug: '',
    image_url: '',
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const slug = formData.slug || generateSlug(formData.title);
      const postData = {
        ...formData,
        slug,
        published_at: formData.is_published ? new Date().toISOString() : null,
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);
        
        if (error) throw error;
        
        toast({
          title: "مقاله بروزرسانی شد",
          description: "مقاله با موفقیت بروزرسانی شد",
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);
        
        if (error) throw error;
        
        toast({
          title: "مقاله اضافه شد",
          description: "مقاله جدید با موفقیت اضافه شد",
        });
      }
      
      setIsDialogOpen(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره مقاله",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این مقاله اطمینان دارید؟')) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "مقاله حذف شد",
        description: "مقاله با موفقیت حذف شد",
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

  const togglePublished = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          is_published: !currentValue,
          published_at: !currentValue ? new Date().toISOString() : null
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "وضعیت انتشار بروزرسانی شد",
        description: "وضعیت انتشار مقاله با موفقیت تغییر کرد",
      });
      
      fetchPosts();
    } catch (error) {
      console.error('Error updating published status:', error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی وضعیت انتشار",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      slug: post.slug || '',
      image_url: post.image_url || '',
      is_published: post.is_published,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      slug: '',
      image_url: '',
      is_published: false,
    });
    setEditingPost(null);
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
            <FileText className="h-5 w-5" />
            مدیریت مقالات
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                افزودن مقاله
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  <label className="block text-sm font-medium mb-1">عنوان مقاله</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">خلاصه</label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">لینک مقاله (اختیاری)</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="article-url"
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
                  <label className="block text-sm font-medium mb-1">محتوای مقاله</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={10}
                    required
                  />
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
                    {editingPost ? 'بروزرسانی' : 'افزودن'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
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
                <TableHead>تاریخ انتشار</TableHead>
                <TableHead>تاریخ ایجاد</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{post.title}</div>
                      {post.excerpt && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {post.excerpt.substring(0, 100)}...
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.is_published ? (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        منتشر شده
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <EyeOff className="h-3 w-3" />
                        پیش‌نویس
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {post.published_at ? formatDate(post.published_at) : '-'}
                  </TableCell>
                  <TableCell>{formatDate(post.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublished(post.id, post.is_published)}
                      >
                        {post.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
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
