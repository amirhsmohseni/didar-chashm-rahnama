
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, Eye } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
import { Badge } from "@/components/ui/badge";

const blogSchema = z.object({
  title: z.string().min(5, { message: "عنوان باید حداقل 5 حرف باشد" }),
  content: z.string().min(50, { message: "محتوا باید حداقل 50 حرف باشد" }),
  excerpt: z.string().min(20, { message: "خلاصه باید حداقل 20 حرف باشد" }),
  published: z.boolean().default(false),
});

const BlogManager = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      published: false,
    },
  });

  useEffect(() => {
    getCurrentUser();
    fetchPosts();
  }, []);

  const getCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user);
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts' as any)
        .select(`
          *,
          profiles:author_id (full_name)
        `)
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

  const onSubmit = async (data: z.infer<typeof blogSchema>) => {
    try {
      const postData = {
        ...data,
        author_id: user?.id,
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts' as any)
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;

        toast({
          title: "ویرایش موفق",
          description: "مقاله با موفقیت ویرایش شد",
        });
      } else {
        const { error } = await supabase
          .from('blog_posts' as any)
          .insert([postData]);

        if (error) throw error;

        toast({
          title: "اضافه شد",
          description: "مقاله جدید با موفقیت اضافه شد",
        });
      }

      setIsDialogOpen(false);
      setEditingPost(null);
      form.reset();
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

  const handleEdit = (post: any) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      published: post.published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('آیا از حذف این مقاله مطمئن هستید؟')) return;

    try {
      const { error } = await supabase
        .from('blog_posts' as any)
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "حذف شد",
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

  const togglePublished = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts' as any)
        .update({ published: !currentStatus })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "وضعیت تغییر کرد",
        description: `مقاله ${!currentStatus ? 'منتشر' : 'پیش‌نویس'} شد`,
      });
      fetchPosts();
    } catch (error) {
      console.error('Error toggling published status:', error);
      toast({
        title: "خطا",
        description: "خطا در تغییر وضعیت",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setEditingPost(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>مدیریت مقالات</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="ml-2 h-4 w-4" />
                افزودن مقاله جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? 'ویرایش مقاله' : 'افزودن مقاله جدید'}
                </DialogTitle>
                <DialogDescription>
                  اطلاعات مقاله را تکمیل کنید
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان مقاله</FormLabel>
                        <FormControl>
                          <Input placeholder="عنوان مقاله را وارد کنید..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>خلاصه مقاله</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="خلاصه کوتاهی از مقاله..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>محتوای مقاله</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="محتوای کامل مقاله را بنویسید..."
                            className="min-h-[300px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            انتشار مقاله
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            آیا این مقاله منتشر شود؟
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
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
        {posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هیچ مقاله‌ای ثبت نشده است
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>نویسنده</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.profiles?.full_name || 'نامشخص'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {post.published ? (
                        <Badge>منتشر شده</Badge>
                      ) : (
                        <Badge variant="secondary">پیش‌نویس</Badge>
                      )}
                      <Switch
                        checked={post.published}
                        onCheckedChange={() => togglePublished(post.id, post.published)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(post.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit className="h-4 w-4" />
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
