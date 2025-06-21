
import { useState, useEffect } from 'react';
import { Play, Image, FileText, Eye, Calendar, Clock, Tag } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  file_url: string;
  thumbnail_url: string | null;
  category: string | null;
  duration: string | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  tags: string[] | null;
  created_at: string | null;
}

const MediaCenter = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = [
    { value: 'all', label: 'همه دسته‌ها' },
    { value: 'general', label: 'عمومی' },
    { value: 'educational', label: 'آموزشی' },
    { value: 'results', label: 'نتایج جراحی' },
    { value: 'testimonials', label: 'تجربیات بیماران' },
    { value: 'procedures', label: 'روش‌های جراحی' },
    { value: 'equipment', label: 'تجهیزات' }
  ];

  const mediaTypes = [
    { value: 'all', label: 'همه انواع' },
    { value: 'video', label: 'ویدیو', icon: Play },
    { value: 'image', label: 'تصویر', icon: Image },
    { value: 'document', label: 'سند', icon: FileText }
  ];

  useEffect(() => {
    fetchMediaItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [mediaItems, searchTerm, selectedCategory, selectedType]);

  const fetchMediaItems = async () => {
    try {
      console.log('Fetching media items...');
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching media items:', error);
        throw error;
      }

      console.log('Media items fetched:', data?.length || 0);
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media items:', error);
      setMediaItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = mediaItems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    setFilteredItems(filtered);
  };

  const getTypeIcon = (type: string) => {
    const typeData = mediaTypes.find(t => t.value === type);
    if (!typeData || !typeData.icon) return Image;
    return typeData.icon;
  };

  const getCategoryLabel = (category: string | null) => {
    return categories.find(c => c.value === category)?.label || 'عمومی';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری رسانه‌ها...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">مرکز رسانه</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            مجموعه‌ای از ویدیوها، تصاویر و اسناد آموزشی در زمینه چشم‌پزشکی
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="جستجو در رسانه‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="نوع رسانه" />
                </SelectTrigger>
                <SelectContent>
                  {mediaTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredItems.length} رسانه یافت شد
          </p>
        </div>

        {/* Media Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Play className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              هیچ رسانه‌ای یافت نشد
            </h3>
            <p className="text-gray-500">
              لطفاً فیلترهای جستجو را تغییر دهید یا دوباره تلاش کنید
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-100">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <TypeIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {item.is_featured && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          ویژه
                        </Badge>
                      </div>
                    )}

                    {/* Duration for videos */}
                    {item.type === 'video' && item.duration && (
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.duration}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                      <Badge variant="outline" className="flex items-center gap-1 ml-2">
                        <TypeIcon className="h-3 w-3" />
                        {mediaTypes.find(t => t.value === item.type)?.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {item.description && (
                      <CardDescription className="mb-4 line-clamp-3">
                        {item.description}
                      </CardDescription>
                    )}

                    <div className="space-y-3">
                      {/* Category */}
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {getCategoryLabel(item.category)}
                        </span>
                      </div>

                      {/* Date */}
                      {item.created_at && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="pt-2">
                        <Button 
                          className="w-full" 
                          onClick={() => window.open(item.file_url, '_blank')}
                          disabled={!item.file_url}
                        >
                          <TypeIcon className="h-4 w-4 mr-2" />
                          {item.type === 'video' ? 'تماشا' : item.type === 'image' ? 'مشاهده' : 'دانلود'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MediaCenter;
