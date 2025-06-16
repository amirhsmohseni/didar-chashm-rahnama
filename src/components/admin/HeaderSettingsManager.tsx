
import { useState, useEffect } from 'react';
import { Save, Edit, Type, Upload, X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

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
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
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

      if (error) throw error;

      if (data && data.length > 0) {
        const settingsObj: any = {};
        data.forEach(setting => {
          settingsObj[setting.key] = setting.value;
        });
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
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        description: getSettingDescription(key)
      }));

      for (const setting of settingsArray) {
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

        if (error) throw error;
      }

      // Log activity - properly convert settings to JSON compatible format
      const settingsForLog: Record<string, string> = {
        site_title: settings.site_title,
        site_tagline: settings.site_tagline,
        hero_title: settings.hero_title,
        hero_description: settings.hero_description,
        cta_primary_text: settings.cta_primary_text,
        cta_secondary_text: settings.cta_secondary_text,
        site_logo: settings.site_logo,
        hero_background_image: settings.hero_background_image
      };

      await supabase.rpc('log_admin_activity', {
        action_name: 'update_header_settings',
        resource_type_name: 'site_settings',
        details_data: settingsForLog
      });

      toast({
        title: "تنظیمات ذخیره شد",
        description: "تنظیمات هدر با موفقیت بروزرسانی شد",
      });
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
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          تنظیمات هدر و متون صفحه اصلی
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* تنظیمات سایت */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Edit className="h-4 w-4" />
            اطلاعات کلی سایت
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">عنوان سایت</label>
              <Input
                value={settings.site_title}
                onChange={(e) => handleChange('site_title', e.target.value)}
                placeholder="دیدار چشم رهنما"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">شعار سایت</label>
              <Input
                value={settings.site_tagline}
                onChange={(e) => handleChange('site_tagline', e.target.value)}
                placeholder="چشم پزشکی"
              />
            </div>
          </div>

          {/* لوگو سایت */}
          <div>
            <label className="block text-sm font-medium mb-2">لوگوی سایت</label>
            <div className="flex items-center gap-4">
              {settings.site_logo && (
                <img src={settings.site_logo} alt="Site Logo" className="h-12 w-auto object-contain" />
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
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
            </div>
          </div>
        </div>

        <Separator />

        {/* تنظیمات بخش اصلی */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">بخش اصلی (Hero)</h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">عنوان اصلی</label>
            <Input
              value={settings.hero_title}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              placeholder="دیدار چشم رهنما"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">توضیحات</label>
            <Textarea
              value={settings.hero_description}
              onChange={(e) => handleChange('hero_description', e.target.value)}
              placeholder="مشاوره تخصصی و رایگان..."
              rows={3}
            />
          </div>

          {/* تصویر پس‌زمینه */}
          <div>
            <label className="block text-sm font-medium mb-2">تصویر پس‌زمینه بخش اصلی</label>
            <div className="flex items-center gap-4">
              {settings.hero_background_image && (
                <img src={settings.hero_background_image} alt="Hero Background" className="h-20 w-32 object-cover rounded" />
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
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
            </div>
          </div>
        </div>

        <Separator />

        {/* تنظیمات دکمه‌ها */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">متن دکمه‌ها</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">دکمه اصلی</label>
              <Input
                value={settings.cta_primary_text}
                onChange={(e) => handleChange('cta_primary_text', e.target.value)}
                placeholder="درخواست مشاوره رایگان"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">دکمه ثانویه</label>
              <Input
                value={settings.cta_secondary_text}
                onChange={(e) => handleChange('cta_secondary_text', e.target.value)}
                placeholder="مشاهده پزشکان"
              />
            </div>
          </div>
        </div>

        {/* دکمه ذخیره */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="min-w-[120px]"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeaderSettingsManager;
