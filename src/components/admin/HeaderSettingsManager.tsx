
import { useState, useEffect } from 'react';
import { Save, Edit, Type } from 'lucide-react';
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
}

const HeaderSettingsManager = () => {
  const [settings, setSettings] = useState<HeaderSettings>({
    site_title: 'دیدار چشم رهنما',
    site_tagline: 'چشم پزشکی',
    hero_title: 'دیدار چشم رهنما',
    hero_description: 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران',
    cta_primary_text: 'درخواست مشاوره رایگان',
    cta_secondary_text: 'مشاهده پزشکان'
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
          'cta_secondary_text'
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

      // Log activity
      await supabase.rpc('log_admin_activity', {
        action_name: 'update_header_settings',
        resource_type_name: 'site_settings',
        details_data: settings
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
      cta_secondary_text: 'متن دکمه ثانویه'
    };
    return descriptions[key] || key;
  };

  const handleChange = (key: keyof HeaderSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
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
