
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Sample blog posts data
  const allPosts = [
    {
      id: 1,
      title: "همه چیز درباره جراحی لازیک: مزایا، عوارض و روند بهبودی",
      excerpt: "در این مقاله به بررسی کامل جراحی لازیک، انواع آن، مزایا، عوارض احتمالی، روند بهبودی و نکات مهم قبل و بعد از عمل می‌پردازیم.",
      category: "جراحی‌های انکساری",
      date: "1402/04/15",
      imageUrl: "/placeholder.svg",
      readTime: 8
    },
    {
      id: 2,
      title: "مقایسه روش‌های مختلف جراحی اصلاح دید: لازیک، PRK، SMILE و ICL",
      excerpt: "آشنایی با روش‌های مختلف جراحی اصلاح دید و تفاوت‌های آنها، مزایا و معایب هر کدام و اینکه کدام روش برای شما مناسب‌تر است.",
      category: "جراحی‌های انکساری",
      date: "1402/03/22",
      imageUrl: "/placeholder.svg",
      readTime: 10
    },
    {
      id: 3,
      title: "آب مروارید (کاتاراکت): علائم، تشخیص و درمان‌های نوین",
      excerpt: "بررسی علائم آب مروارید، روش‌های تشخیص و انواع درمان‌های نوین با تمرکز بر جراحی‌های پیشرفته و لنزهای داخل چشمی.",
      category: "بیماری‌های چشم",
      date: "1402/02/18",
      imageUrl: "/placeholder.svg",
      readTime: 7
    },
    {
      id: 4,
      title: "کراتوکونوس: آشنایی با علائم و روش‌های درمان",
      excerpt: "در این مقاله به بررسی بیماری کراتوکونوس، علائم، روش‌های تشخیص و درمان‌های موجود از کراس‌لینکینگ تا پیوند قرنیه می‌پردازیم.",
      category: "بیماری‌های چشم",
      date: "1402/01/30",
      imageUrl: "/placeholder.svg",
      readTime: 9
    },
    {
      id: 5,
      title: "تغییر رنگ چشم با کراتوپیگمنتیشن: واقعیت‌ها و خطرات",
      excerpt: "بررسی کامل روش کراتوپیگمنتیشن برای تغییر رنگ چشم، مراحل جراحی، خطرات احتمالی و نکات مهمی که قبل از انجام آن باید بدانید.",
      category: "جراحی‌های زیبایی",
      date: "1401/12/10",
      imageUrl: "/placeholder.svg",
      readTime: 6
    },
    {
      id: 6,
      title: "مراقبت‌های پس از جراحی چشم: نکات طلایی برای بهبودی سریع‌تر",
      excerpt: "اصول مراقبت پس از انواع جراحی‌های چشم، توصیه‌های پزشکی، علائم هشداردهنده و نکات کاربردی برای بهبودی سریع‌تر و بهتر.",
      category: "مراقبت‌های چشم",
      date: "1401/11/25",
      imageUrl: "/placeholder.svg",
      readTime: 5
    }
  ];

  // Extract unique categories for filter
  const categories = Array.from(new Set(allPosts.map(post => post.category)));

  // Filter posts based on search and category
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />

      <div className="bg-secondary">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">مقالات آموزشی</h1>
          <p className="text-muted-foreground">
            مطالب آموزشی در مورد جراحی‌های چشم، بیماری‌ها و مراقبت‌های چشمی
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="md:w-3/4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="جستجو در مقالات..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-1/4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">همه دسته‌بندی‌ها</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Blog Posts */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[16/9] relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs bg-secondary rounded-full px-3 py-1">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{post.readTime} دقیقه مطالعه</span>
                      <Button variant="link" className="p-0" asChild>
                        <a href={`/blog/${post.id}`}>ادامه مطلب</a>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">مقاله‌ای یافت نشد</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('');
                }}
              >
                پاک کردن فیلترها
              </Button>
            </div>
          )}
          
          {/* Coming Soon Note */}
          <div className="mt-16 bg-secondary p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-3">به زودی مقالات بیشتری اضافه خواهند شد</h3>
            <p className="text-muted-foreground mb-6">
              ما مرتباً مقالات جدید آموزشی در مورد جراحی‌های چشم، بیماری‌ها و سلامت چشم منتشر می‌کنیم.
            </p>
            <Button variant="outline" asChild>
              <Link to="/consultation">دریافت مشاوره تخصصی</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Blog;
