
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, ArrowLeft, Share2, Clock } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from 'react-helmet-async';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';

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
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  reading_time: number | null;
  views_count: number | null;
  featured_image_alt: string | null;
  category_id: string | null;
  blog_categories?: {
    name: string;
    slug: string;
  };
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string | null;
  image_url: string | null;
  excerpt: string | null;
  published_at: string | null;
}

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      
      setPost(data);
      
      // Update view count
      await supabase
        .from('blog_posts')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', data.id);

      // Fetch related posts with proper typing
      if (data.category_id) {
        const { data: related } = await supabase
          .from('blog_posts')
          .select('id, title, slug, image_url, excerpt, published_at')
          .eq('category_id', data.category_id)
          .eq('is_published', true)
          .neq('id', data.id)
          .limit(3);
        
        setRelatedPosts(related || []);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/blog');
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

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt || post?.meta_description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
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

  if (!post) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-secondary flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">مقاله یافت نشد</h1>
            <Button onClick={() => navigate('/blog')}>بازگشت به مقالات</Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt || ''} />
        <meta name="keywords" content={post.meta_keywords || ''} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.meta_description || ''} />
        <meta property="og:image" content={post.image_url || ''} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.meta_description || ''} />
        <meta name="twitter:image" content={post.image_url || ''} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Header />
      
      <div className="bg-secondary min-h-screen">
        <div className="container py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <button onClick={() => navigate('/')} className="hover:text-primary">خانه</button>
            <span>/</span>
            <button onClick={() => navigate('/blog')} className="hover:text-primary">مقالات</button>
            <span>/</span>
            <span>{post.title}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  {post.blog_categories && (
                    <Badge variant="secondary" className="mb-4 w-fit">
                      {post.blog_categories.name}
                    </Badge>
                  )}
                  
                  <CardTitle className="text-3xl leading-relaxed">
                    {post.title}
                  </CardTitle>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                    </div>
                    {post.reading_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.reading_time} دقیقه مطالعه
                      </div>
                    )}
                    {post.views_count && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views_count} بازدید
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {post.image_url && (
                    <div className="mb-8">
                      <img
                        src={post.image_url}
                        alt={post.featured_image_alt || post.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  <div className="mt-8 pt-8 border-t flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/blog')}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      بازگشت به مقالات
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={sharePost}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      اشتراک‌گذاری
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">مقالات مرتبط</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.id} className="flex gap-3">
                        {relatedPost.image_url && (
                          <img
                            src={relatedPost.image_url}
                            alt={relatedPost.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <button
                            onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                            className="text-sm font-medium hover:text-primary text-right block"
                          >
                            {relatedPost.title}
                          </button>
                          <p className="text-xs text-muted-foreground mt-1">
                            {relatedPost.published_at && formatDate(relatedPost.published_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPost;
