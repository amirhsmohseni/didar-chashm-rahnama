
import { useState, useEffect } from 'react';
import { Save, RotateCcw, Settings, Image as ImageIcon, Type, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import ImageUploader from './ImageUploader';

interface HeaderSettings {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  logoUrl: string | null;
  backgroundImageUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
}

const HeaderSettingsManager = () => {
  const [settings, setSettings] = useState<HeaderSettings>({
    siteName: 'دیدار چشم رهنما',
    tagline: 'مشاوره تخصصی چشم',
    heroTitle: 'دیدار چشم رهنما',
    heroDescription: 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران',
    logoUrl: null,
    backgroundImageUrl: null,
    primaryColor: '#0ea5e9',
    secondaryColor: '#f1f5f9'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('Loading header settings from database...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) {
        console.error('Error loading settings:', error);
        toast.error('خطا در بارگذاری تنظیمات');
        return;
      }

      if (data) {
        const settingsMap = data.reduce((acc, item) => {
          let value = item.value;
          if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (typeof value !== 'string') {
            value = JSON.stringify(value).replace(/^"|"$/g, '');
          }
          acc[item.key] = value;
          return acc;
        }, {} as Record<string, string>);

        setSettings(prev => ({
          ...prev,
          siteName: settingsMap.site_title || prev.siteName,
          heroTitle: settingsMap.hero_title || prev.heroTitle,
          heroDescription: settingsMap.hero_description || prev.heroDescription,
          logoUrl: settingsMap.site_logo || null,
          backgroundImageUrl: settingsMap.site_background || null,
        }));
        
        console.log('Loaded settings:', settingsMap);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('خطا در بارگذاری تنظیمات');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('Saving header settings to database...');
      
      // Update site settings in database
      const updates = [
        { key: 'site_title', value: settings.siteName },
        { key: 'hero_title', value: settings.heroTitle },
        { key: 'hero_description', value: settings.heroDescription },
        { key: 'site_logo', value: settings.logoUrl || '' },
        { key: 'site_background', value: settings.backgroundImageUrl || '' }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ 
            value: update.value,
            updated_at: new Date().toISOString()
          })
          .eq('key', update.key);

        if (error) {
          console.error(`Error updating ${update.key}:`, error);
          throw error;
        }
      }

      // Log admin activity
      try {
        await supabase.rpc('log_admin_activity', {
          action_name: 'update_header_settings',
          resource_type_name: 'site_settings',
          details_data: { updated_keys: updates.map(u => u.key) }
        });
      } catch (logError) {
        console.warn('Failed to log admin activity:', logError);
      }
      
      // Apply settings to CSS variables for immediate effect
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
      
      setHasChanges(false);
      toast.success('تنظیمات با موفقیت ذخیره شد');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('خطا در ذخیره تنظیمات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    const defaultSettings: HeaderSettings = {
      siteName: 'دیدار چشم رهنما',
      tagline: 'مشاوره تخصصی چشم',
      heroTitle: 'دیدار چشم رهنما',
      heroDescription: 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران',
      logoUrl: null,
      backgroundImageUrl: null,
      primaryColor: '#0ea5e9',
      secondaryColor: '#f1f5f9'
    };
    
    setSettings(defaultSettings);
    setHasChanges(true);
    toast.success('تنظیمات به حالت پیش‌فرض برگردانده شد');
  };

  const updateSetting = (key: keyof HeaderSettings, value: string | null) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">تنظیمات هدر</h2>
            <p className="text-gray-600">مدیریت نمایش و محتوای بخش بالای سایت</p>
          </div>
        </div>
        
        {hasChanges && (
          <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
            تغییرات ذخیره نشده
          </Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Site Identity */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Type className="h-5 w-5 text-blue-600" />
              <CardTitle>هویت سایت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">نام سایت</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    placeholder="نام سایت..."
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">شعار</Label>
                  <Input
                    id="tagline"
                    value={settings.tagline}
                    onChange={(e) => updateSetting('tagline', e.target.value)}
                    placeholder="شعار سایت..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hero Section */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <ImageIcon className="h-5 w-5 text-green-600" />
              <CardTitle>بخش اصلی (Hero)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroTitle">عنوان اصلی</Label>
                <Input
                  id="heroTitle"
                  value={settings.heroTitle}
                  onChange={(e) => updateSetting('heroTitle', e.target.value)}
                  placeholder="عنوان اصلی..."
                />
              </div>
              <div>
                <Label htmlFor="heroDescription">توضیحات</Label>
                <Textarea
                  id="heroDescription"
                  value={settings.heroDescription}
                  onChange={(e) => updateSetting('heroDescription', e.target.value)}
                  placeholder="توضیحات بخش اصلی..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              <CardTitle>رنگ‌بندی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">رنگ اصلی</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="w-16 h-10 p-1 rounded-md"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      placeholder="#0ea5e9"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">رنگ فرعی</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                      className="w-16 h-10 p-1 rounded-md"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                      placeholder="#f1f5f9"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-indigo-600" />
                تصاویر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUploader
                label="لوگوی سایت"
                currentImage={settings.logoUrl}
                onImageChange={(url) => updateSetting('logoUrl', url)}
                aspectRatio="1/1"
                maxSize={2}
              />
              
              <Separator />
              
              <ImageUploader
                label="تصویر پس‌زمینه بخش اصلی"
                currentImage={settings.backgroundImageUrl}
                onImageChange={(url) => updateSetting('backgroundImageUrl', url)}
                aspectRatio="16/9"
                maxSize={5}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSave}
              disabled={isLoading || !hasChanges}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <Save className="h-5 w-5 ml-2" />
              {isLoading ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
            </Button>
            
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <RotateCcw className="h-5 w-5 ml-2" />
              بازگشت به پیش‌فرض
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSettingsManager;
