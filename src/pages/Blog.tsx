
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
  
  // Sample blog posts data with expanded content
  const allPosts = [
    {
      id: 1,
      title: "همه چیز درباره جراحی لازیک: مزایا، عوارض و روند بهبودی",
      excerpt: "در این مقاله به بررسی کامل جراحی لازیک، انواع آن، مزایا، عوارض احتمالی، روند بهبودی و نکات مهم قبل و بعد از عمل می‌پردازیم.",
      category: "جراحی‌های انکساری",
      date: "1402/04/15",
      imageUrl: "/lovable-uploads/d75e8494-d085-41f7-922f-4f066da0b842.png",
      readTime: 8
    },
    {
      id: 2,
      title: "مقایسه روش‌های مختلف جراحی اصلاح دید: لازیک، PRK، SMILE و ICL",
      excerpt: "آشنایی با روش‌های مختلف جراحی اصلاح دید و تفاوت‌های آنها، مزایا و معایب هر کدام و اینکه کدام روش برای شما مناسب‌تر است.",
      category: "جراحی‌های انکساری",
      date: "1402/03/22",
      imageUrl: "/lovable-uploads/96386b66-70a1-44b5-a521-2e81071b8186.png",
      readTime: 10
    },
    {
      id: 3,
      title: "آب مروارید (کاتاراکت): علائم، تشخیص و درمان‌های نوین",
      excerpt: "بررسی علائم آب مروارید، روش‌های تشخیص و انواع درمان‌های نوین با تمرکز بر جراحی‌های پیشرفته و لنزهای داخل چشمی.",
      category: "بیماری‌های چشم",
      date: "1402/02/18",
      imageUrl: "/lovable-uploads/86c49559-961b-406b-a5c4-9d47e1c50501.png",
      readTime: 7
    },
    {
      id: 4,
      title: "کراتوکونوس: آشنایی با علائم و روش‌های درمان",
      excerpt: "در این مقاله به بررسی بیماری کراتوکونوس، علائم، روش‌های تشخیص و درمان‌های موجود از کراس‌لینکینگ تا پیوند قرنیه می‌پردازیم.",
      category: "بیماری‌های چشم",
      date: "1402/01/30",
      imageUrl: "/lovable-uploads/7183b3ed-c0ee-4bc5-8705-53224a422b78.png",
      readTime: 9
    },
    {
      id: 5,
      title: "تغییر رنگ چشم با کراتوپیگمنتیشن: واقعیت‌ها و خطرات",
      excerpt: "بررسی کامل روش کراتوپیگمنتیشن برای تغییر رنگ چشم، مراحل جراحی، خطرات احتمالی و نکات مهمی که قبل از انجام آن باید بدانید.",
      category: "جراحی‌های زیبایی",
      date: "1401/12/10",
      imageUrl: "/lovable-uploads/af4748e4-e86a-4059-8c1e-21295741f2e8.png",
      readTime: 6
    },
    {
      id: 6,
      title: "مراقبت‌های پس از جراحی چشم: نکات طلایی برای بهبودی سریع‌تر",
      excerpt: "اصول مراقبت پس از انواع جراحی‌های چشم، توصیه‌های پزشکی، علائم هشداردهنده و نکات کاربردی برای بهبودی سریع‌تر و بهتر.",
      category: "مراقبت‌های چشم",
      date: "1401/11/25",
      imageUrl: "/lovable-uploads/7183b3ed-c0ee-4bc5-8705-53224a422b78.png",
      readTime: 5
    },
    {
      id: 7,
      title: "جراحی فمتو اسمایل: روشی مدرن برای اصلاح عیوب انکساری",
      excerpt: "معرفی جراحی فمتو اسمایل به عنوان پیشرفته‌ترین روش اصلاح عیوب انکساری، مزایای آن نسبت به سایر روش‌ها و مراحل انجام آن.",
      category: "جراحی‌های انکساری",
      date: "1401/10/12",
      imageUrl: "/lovable-uploads/ab10ef65-363e-47ed-a1a5-dceee84d1d9d.png",
      readTime: 8
    },
    {
      id: 8,
      title: "آستیگماتیسم چیست و چگونه درمان می‌شود؟",
      excerpt: "بررسی انواع آستیگماتیسم، علل ایجاد آن، روش‌های تشخیص و درمان با عینک، لنز تماسی یا جراحی‌های مختلف چشم.",
      category: "بیماری‌های چشم",
      date: "1401/09/05",
      imageUrl: "/lovable-uploads/96386b66-70a1-44b5-a521-2e81071b8186.png",
      readTime: 7
    },
    {
      id: 9,
      title: "نقش تغذیه در سلامت چشم: مواد غذایی مفید برای حفظ بینایی",
      excerpt: "بررسی انواع مواد غذایی مفید برای سلامت چشم، ویتامین‌ها و مواد معدنی ضروری و نقش تغذیه در پیشگیری از بیماری‌های چشمی.",
      category: "سلامت چشم",
      date: "1401/08/18",
      imageUrl: "/placeholder.svg",
      readTime: 6
    },
    {
      id: 10,
      title: "آشنایی با عفونت‌های چشمی رایج و راه‌های پیشگیری از آن‌ها",
      excerpt: "بررسی انواع عفونت‌های چشمی شایع مانند قرمزی، کنژکتیویت و بلفاریت، علل ایجاد آن‌ها و روش‌های درمان و پیشگیری.",
      category: "بیماری‌های چشم",
      date: "1401/07/22",
      imageUrl: "/placeholder.svg",
      readTime: 5
    },
    {
      id: 11,
      title: "خشکی چشم: علل، عوارض و روش‌های درمان",
      excerpt: "بررسی دلایل ایجاد خشکی چشم، تشخیص، درمان‌های دارویی و غیردارویی و راهکارهای پیشگیری از آن در زندگی روزمره.",
      category: "بیماری‌های چشم",
      date: "1401/06/15",
      imageUrl: "/placeholder.svg",
      readTime: 6
    },
    {
      id: 12,
      title: "نکات مهم برای انتخاب بهترین جراح چشم",
      excerpt: "راهنمای کامل برای انتخاب یک جراح چشم ماهر و قابل اعتماد، معیارهای ارزیابی تخصص و تجربه جراح و سؤالات مهمی که باید از او بپرسید.",
      category: "راهنمای بیماران",
      date: "1401/05/10",
      imageUrl: "/placeholder.svg",
      readTime: 7
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
