
import { useState, useEffect } from 'react';
import { Save, Edit, Type, Upload, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface HeaderSettings {
  site_title: string;
  site_tagline: string;
  hero_title: string;
  hero_description: string;
  cta_primary_text: string;
  cta_secondary_text: string;
  site_logo: string;
  hero_background_image: string;
}

const HeaderSettingsManager = () => {
  const [settings, setSettings] = useState<HeaderSettings>({
    site_title: 'دیدار چشم رهنما',
    site_tagline: 'چشم پزشکی',
    hero_title: 'دیدار چشم رهنما',
    hero_description: 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران',
    cta_primary_text: 'درخواست مشاوره رایگان',
    cta_secondary_text: 'مشاهده پزشکان',
    site_logo: '',
    hero_background_image: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('Fetching header settings...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'site_title',
          'site_tagline', 
          'hero_title',
          'hero_description',
          'cta_primary_text',
          'cta_secondary_text',
          'site_logo',
          'hero_background_image'
        ]);

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }

      console.log('Raw settings data:', data);

      if (data && data.length > 0) {
        const settingsObj: any = {};
        data.forEach(setting => {
          let value = setting.value;
          // Handle JSON parsing for stored values
          if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (typeof value !== 'string') {
            try {
              value = JSON.parse(JSON.stringify(value)).replace(/^"|"$/g, '');
            } catch (e) {
              console.warn('Could not parse value for', setting.key, value);
            }
          }
          settingsObj[setting.key] = value;
        });
        
        console.log('Parsed settings:', settingsObj);
        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت تنظیمات هدر",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      console.log('Saving settings:', settings);
      
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        description: getSettingDescription(key)
      }));

      for (const setting of settingsArray) {
        console.log(`Upserting setting: ${setting.key} = ${setting.value}`);
        
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            key: setting.key,
            value: setting.value,
            description: setting.description,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'key'
          });

        if (error) {
          console.error(`Error saving ${setting.key}:`, error);
          throw error;
        }
      }

      // Log activity
      const settingsForLog: Record<string, string> = {};
      Object.entries(settings).forEach(([key, value]) => {
        settingsForLog[key] = String(value);
      });

      await supabase.rpc('log_admin_activity', {
        action_name: 'update_header_settings',
        resource_type_name: 'site_settings',
        details_data: settingsForLog
      });

      toast({
        title: "✅ تنظیمات ذخیره شد",
        description: "تنظیمات هدر با موفقیت بروزرسانی شد",
      });

      // Refresh to confirm save
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "❌ خطا",
        description: "خطا در ذخیره تنظیمات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSettingDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      site_title: 'عنوان اصلی سایت',
      site_tagline: 'شعار سایت', 
      hero_title: 'عنوان بخش اصلی',
      hero_description: 'توضیحات بخش اصلی',
      cta_primary_text: 'متن دکمه اصلی',
      cta_secondary_text: 'متن دکمه ثانویه',
      site_logo: 'لوگوی سایت',
      hero_background_image: 'تصویر پس‌زمینه بخش اصلی'
    };
    return descriptions[key] || key;
  };

  const handleChange = (key: keyof HeaderSettings, value: string) => {
    console.log(`Updating ${key} to:`, value);
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleImageUpload = async (key: keyof HeaderSettings, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطا",
        description: "لطفاً یک فایل تصویری انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطا",
        description: "حجم فایل نباید بیشتر از 5 مگابایت باشد",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          handleChange(key, e.target.result as string);
          toast({
            title: "✅ تصویر آپلود شد",
            description: "تصویر با موفقیت آپلود شد. فراموش نکنید تغییرات را ذخیره کنید.",
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('خطا در آپلود:', error);
      toast({
        title: "خطا",
        description: "خطا در آپلود تصویر",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="mr-3">در حال بارگذاری...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">تنظیمات هدر و متون</h1>
          <Badge variant="secondary">مدیریت محتوا</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {previewMode ? 'حالت ویرایش' : 'پیش‌نمایش'}
          </Button>
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Information */}
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Edit className="h-5 w-5" />
              اطلاعات کلی سایت
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="site_title" className="text-sm font-medium">عنوان سایت</Label>
              <Input
                id="site_title"
                value={settings.site_title}
                onChange={(e) => handleChange('site_title', e.target.value)}
                placeholder="دیدار چشم رهنما"
                className="focus:ring-2 focus:ring-blue-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="site_tagline" className="text-sm font-medium">شعار سایت</Label>
              <Input
                id="site_tagline"
                value={settings.site_tagline}
                onChange={(e) => handleChange('site_tagline', e.target.value)}
                placeholder="چشم پزشکی"
                className="focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Site Logo */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">لوگوی سایت</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center space-y-3">
                {settings.site_logo && (
                  <div className="flex justify-center">
                    <img src={settings.site_logo} alt="Site Logo" className="h-16 w-auto object-contain rounded" />
                  </div>
                )}
                <div className="flex justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('site-logo-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    انتخاب لوگو
                  </Button>
                  {settings.site_logo && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleChange('site_logo', '')}
                    >
                      <X className="h-4 w-4 mr-2" />
                      حذف
                    </Button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload('site_logo', file);
                  }}
                  className="hidden"
                  id="site-logo-upload"
                />
                <p className="text-xs text-gray-500">JPG, PNG یا GIF تا 5MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Type className="h-5 w-5" />
              بخش اصلی صفحه (Hero)
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="hero_title" className="text-sm font-medium">عنوان اصلی</Label>
              <Input
                id="hero_title"
                value={settings.hero_title}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                placeholder="دیدار چشم رهنما"
                className="focus:ring-2 focus:ring-green-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hero_description" className="text-sm font-medium">توضیحات</Label>
              <Textarea
                id="hero_description"
                value={settings.hero_description}
                onChange={(e) => handleChange('hero_description', e.target.value)}
                placeholder="مشاوره تخصصی و رایگان..."
                rows={3}
                className="focus:ring-2 focus:ring-green-200"
              />
            </div>

            {/* Hero Background Image */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">تصویر پس‌زمینه</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center space-y-3">
                {settings.hero_background_image && (
                  <div className="flex justify-center">
                    <img src={settings.hero_background_image} alt="Hero Background" className="h-20 w-32 object-cover rounded" />
                  </div>
                )}
                <div className="flex justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('hero-bg-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    انتخاب تصویر
                  </Button>
                  {settings.hero_background_image && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleChange('hero_background_image', '')}
                    >
                      <X className="h-4 w-4 mr-2" />
                      حذف
                    </Button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload('hero_background_image', file);
                  }}
                  className="hidden"
                  id="hero-bg-upload"
                />
                <p className="text-xs text-gray-500">JPG, PNG یا GIF تا 5MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action Buttons */}
      <Card className="shadow-sm border-l-4 border-l-purple-500">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Edit className="h-5 w-5" />
            متن دکمه‌های عملیات
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cta_primary_text" className="text-sm font-medium">دکمه اصلی</Label>
              <Input
                id="cta_primary_text"
                value={settings.cta_primary_text}
                onChange={(e) => handleChange('cta_primary_text', e.target.value)}
                placeholder="درخواست مشاوره رایگان"
                className="focus:ring-2 focus:ring-purple-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cta_secondary_text" className="text-sm font-medium">دکمه ثانویه</Label>
              <Input
                id="cta_secondary_text"
                value={settings.cta_secondary_text}
                onChange={(e) => handleChange('cta_secondary_text', e.target.value)}
                placeholder="مشاهده پزشکان"
                className="focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {previewMode && (
        <Card className="shadow-sm border-l-4 border-l-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Eye className="h-5 w-5" />
              پیش‌نمایش تغییرات
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="bg-gradient-to-b from-primary to-primary/80 text-white p-8 rounded-lg">
              <div className="text-center space-y-4">
                {settings.site_logo && (
                  <img src={settings.site_logo} alt="Logo" className="h-12 w-auto mx-auto" />
                )}
                <h1 className="text-3xl font-bold">{settings.hero_title}</h1>
                <p className="text-lg opacity-90">{settings.hero_description}</p>
                <div className="flex gap-4 justify-center">
                  <Button variant="secondary" className="text-primary">
                    {settings.cta_primary_text}
                  </Button>
                  <Button variant="outline" className="border-white text-white">
                    {settings.cta_secondary_text}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HeaderSettingsManager;
