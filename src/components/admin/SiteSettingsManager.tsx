
import { useState, useEffect } from 'react';
import { Save, Settings, RefreshCw, Upload, X, Eye } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SiteSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
}

const SiteSettingsManager = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching site settings...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }
      
      console.log('Site settings data:', data);
      setSettings(data || []);
      
      // Initialize form data
      const initialData: Record<string, string> = {};
      data?.forEach(setting => {
        let value = setting.value;
        if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1); // Remove surrounding quotes
        } else if (typeof value !== 'string') {
          value = JSON.stringify(value).replace(/^"|"$/g, '');
        }
        initialData[setting.key] = value;
        
        // Set image states
        if (setting.key === 'site_logo') {
          setLogoImage(value || null);
        }
        if (setting.key === 'site_background') {
          setBackgroundImage(value || null);
        }
      });
      console.log('Initialized form data:', initialData);
      setFormData(initialData);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت تنظیمات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'background') => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطا",
        description: "فایل نباید بیشتر از 5 مگابایت باشد",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطا",
        description: "لطفاً فقط فایل تصویری انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    const setUploading = type === 'logo' ? setIsUploadingLogo : setIsUploadingBackground;
    setUploading(true);
    
    try {
      // Create a temporary URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      
      if (type === 'logo') {
        setLogoImage(imageUrl);
        setFormData(prev => ({ ...prev, site_logo: imageUrl }));
      } else {
        setBackgroundImage(imageUrl);
        setFormData(prev => ({ ...prev, site_background: imageUrl }));
      }
      
      toast({
        title: "موفق",
        description: `${type === 'logo' ? 'لوگو' : 'تصویر پس‌زمینه'} با موفقیت آپلود شد`,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "خطا",
        description: "خطا در آپلود تصویر",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (type: 'logo' | 'background') => {
    if (type === 'logo') {
      setLogoImage(null);
      setFormData(prev => ({ ...prev, site_logo: '' }));
    } else {
      setBackgroundImage(null);
      setFormData(prev => ({ ...prev, site_background: '' }));
    }
    
    toast({
      title: "موفق",
      description: `${type === 'logo' ? 'لوگو' : 'تصویر پس‌زمینه'} حذف شد`,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('Saving settings with data:', formData);
      
      const updatePromises = settings.map(async (setting) => {
        const newValue = JSON.stringify(formData[setting.key] || '');
        console.log(`Updating ${setting.key} with value:`, newValue);
        
        const { error } = await supabase
          .from('site_settings')
          .update({ 
            value: newValue,
            updated_at: new Date().toISOString()
          })
          .eq('key', setting.key);
          
        if (error) {
          console.error(`Error updating ${setting.key}:`, error);
          throw error;
        }
      });

      await Promise.all(updatePromises);

      // Log activity
      try {
        await supabase.rpc('log_admin_activity', {
          action_name: 'update_site_settings',
          resource_type_name: 'site_settings',
          details_data: { updated_settings: Object.keys(formData) }
        });
      } catch (logError) {
        console.warn('Failed to log admin activity:', logError);
      }

      toast({
        title: "تنظیمات ذخیره شد",
        description: "تنظیمات سایت با موفقیت بروزرسانی شد",
      });

      // Refresh settings to confirm save
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره تنظیمات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    console.log(`Changing ${key} to:`, value);
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getSettingLabel = (key: string) => {
    const labels: Record<string, string> = {
      'site_title': 'عنوان سایت',
      'site_description': 'توضیحات سایت',
      'hero_title': 'عنوان صفحه اصلی',
      'hero_description': 'توضیحات صفحه اصلی',
      'contact_phone': 'شماره تماس',
      'contact_email': 'ایمیل تماس',
      'contact_address': 'آدرس',
      'site_logo': 'لوگوی سایت',
      'site_background': 'تصویر پس‌زمینه'
    };
    return labels[key] || key;
  };

  const ImageUploadSection = ({ 
    title, 
    currentImage, 
    onUpload, 
    onRemove, 
    isUploading, 
    type 
  }: {
    title: string;
    currentImage: string | null;
    onUpload: (file: File) => void;
    onRemove: () => void;
    isUploading: boolean;
    type: 'logo' | 'background';
  }) => (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{title}</Label>
      
      {currentImage ? (
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="relative group">
              <img
                src={currentImage}
                alt={title}
                className={`w-full object-cover rounded-lg ${
                  type === 'logo' ? 'h-32' : 'h-48'
                }`}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(currentImage, '_blank')}
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    مشاهده
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onRemove}
                  >
                    <X className="h-4 w-4 ml-1" />
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {title} را آپلود کنید
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    فرمت‌های مجاز: JPG, PNG - حداکثر 5 مگابایت
                  </p>
                  
                  <Button
                    variant="outline"
                    className="relative"
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 ml-2" />
                    {isUploading ? 'در حال آپلود...' : 'انتخاب فایل'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUpload(file);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>در حال بارگذاری تنظیمات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            تنظیمات سایت
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Image Upload Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">تصاویر سایت</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <ImageUploadSection
                title="لوگوی سایت"
                currentImage={logoImage}
                onUpload={(file) => handleImageUpload(file, 'logo')}
                onRemove={() => removeImage('logo')}
                isUploading={isUploadingLogo}
                type="logo"
              />
              
              <ImageUploadSection
                title="تصویر پس‌زمینه"
                currentImage={backgroundImage}
                onUpload={(file) => handleImageUpload(file, 'background')}
                onRemove={() => removeImage('background')}
                isUploading={isUploadingBackground}
                type="background"
              />
            </div>
          </div>

          <Separator />

          {/* Text Settings Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">تنظیمات متنی</h3>
            
            {settings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                هیچ تنظیماتی یافت نشد
              </div>
            ) : (
              <div className="space-y-6">
                {settings
                  .filter(setting => !['site_logo', 'site_background'].includes(setting.key))
                  .map((setting) => (
                    <div key={setting.id} className="space-y-2">
                      <label className="block text-sm font-medium">
                        {getSettingLabel(setting.key)}
                      </label>
                      {setting.description && (
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      )}
                      {['hero_description', 'site_description'].includes(setting.key) ? (
                        <Textarea
                          value={formData[setting.key] || ''}
                          onChange={(e) => handleInputChange(setting.key, e.target.value)}
                          rows={3}
                          className="w-full"
                          placeholder={`وارد کردن ${getSettingLabel(setting.key)}`}
                        />
                      ) : (
                        <Input
                          value={formData[setting.key] || ''}
                          onChange={(e) => handleInputChange(setting.key, e.target.value)}
                          className="w-full"
                          placeholder={`وارد کردن ${getSettingLabel(setting.key)}`}
                        />
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button 
              onClick={fetchSettings}
              variant="outline"
              disabled={isLoading || isSaving}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              بازخوانی
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsManager;
