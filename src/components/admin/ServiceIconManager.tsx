
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, Edit, Save, X, Palette, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/loading';

interface ServiceIcon {
  id: string;
  title: string;
  icon: string;
  color?: string;
  description?: string;
}

const ServiceIconManager = () => {
  const [services, setServices] = useState<ServiceIcon[]>([]);
  const [editingService, setEditingService] = useState<ServiceIcon | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Available Lucide React icons for selection
  const availableIcons = [
    'eye', 'eye-off', 'glasses', 'scan', 'zap', 'heart', 'shield',
    'star', 'check', 'plus', 'user', 'users', 'calendar', 'clock',
    'phone', 'mail', 'map-pin', 'award', 'thumbs-up', 'settings'
  ];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('id, title, icon, description')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;

      const serviceIcons: ServiceIcon[] = data?.map(service => ({
        id: service.id,
        title: service.title,
        icon: service.icon || 'eye',
        description: service.description
      })) || [];

      setServices(serviceIcons);
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: "خطا",
        description: "خطا در بارگذاری خدمات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIcon = async (service: ServiceIcon) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ 
          icon: service.icon,
          title: service.title 
        })
        .eq('id', service.id);

      if (error) throw error;

      setServices(prev => 
        prev.map(s => s.id === service.id ? service : s)
      );
      setEditingService(null);
      toast({ 
        title: "موفق", 
        description: "آیکون خدمت با موفقیت ذخیره شد" 
      });
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره آیکون",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">در حال بارگذاری خدمات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
          <Palette className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">مدیریت آیکون‌های خدمات</h2>
          <p className="text-gray-600">ویرایش آیکون‌ها و نمایش خدمات</p>
        </div>
      </div>

      {/* Available Icons Reference */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Package className="h-5 w-5" />
            آیکون‌های در دسترس
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {availableIcons.map(iconName => (
              <div 
                key={iconName}
                className="flex flex-col items-center p-2 bg-white rounded-lg border hover:border-blue-300 transition-colors cursor-pointer"
                title={iconName}
              >
                <Eye className="h-5 w-5 text-blue-600 mb-1" />
                <span className="text-xs text-gray-600">{iconName}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {editingService?.id === service.id ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>عنوان خدمت</Label>
                      <Input
                        value={editingService.title}
                        onChange={(e) => setEditingService(prev => 
                          prev ? { ...prev, title: e.target.value } : null
                        )}
                      />
                    </div>
                    <div>
                      <Label>نام آیکون</Label>
                      <Input
                        value={editingService.icon}
                        onChange={(e) => setEditingService(prev => 
                          prev ? { ...prev, icon: e.target.value } : null
                        )}
                        placeholder="مثل: eye, glasses, heart"
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-sm text-gray-600 mb-2 block">پیش‌نمایش آیکون:</Label>
                    <div className="flex items-center gap-3">
                      <Eye className="h-8 w-8 text-blue-600" />
                      <span className="font-medium">{editingService.title}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleSaveIcon(editingService)} 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      ذخیره
                    </Button>
                    <Button variant="outline" onClick={() => setEditingService(null)}>
                      <X className="h-4 w-4 mr-2" />
                      لغو
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{service.title}</h3>
                      <p className="text-sm text-gray-600">آیکون: {service.icon}</p>
                      {service.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingService(service)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    ویرایش
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">خدمتی یافت نشد</h3>
            <p className="text-gray-600">ابتدا خدمات را از بخش مدیریت خدمات اضافه کنید</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServiceIconManager;
