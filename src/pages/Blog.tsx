
import { useState, useEffect } from 'react';
import { Calendar, User, Eye, BookOpen } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, limit: number = 150) => {
    if (content.length <= limit) return content;
    return content.substring(0, limit) + '...';
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-secondary flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="bg-secondary min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary to-primary/80 text-white py-16">
          <div className="container text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">مقالات و اخبار</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              آخرین مقالات تخصصی در حوزه سلامت چشم و جراحی‌های چشم
            </p>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="container py-16">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">هیچ مقاله‌ای یافت نشد</h3>
              <p className="text-muted-foreground">در حال حاضر هیچ مقاله منتشر شده‌ای وجود ندارد.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
                  {post.image_url && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                    </div>
                    
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    
                    {post.excerpt ? (
                      <p className="text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    ) : (
                      <p className="text-muted-foreground line-clamp-3">
                        {truncateContent(post.content.replace(/<[^>]*>/g, ''))}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        مطالعه
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Blog;
