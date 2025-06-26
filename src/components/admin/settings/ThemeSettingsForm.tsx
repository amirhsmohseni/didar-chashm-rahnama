
import { useState, useEffect } from 'react';
import { Palette, Monitor, Sun, Moon, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import ColorPicker from './ColorPicker';
import { toast } from 'sonner';

const ThemeSettingsForm = () => {
  const { settings, updateSetting, loading } = useSettingsManager();
  const [previewMode, setPreviewMode] = useState(false);
  const [tempColors, setTempColors] = useState<Record<string, string>>({});

  // دریافت رنگ‌های فعلی
  const getCurrentColor = (key: string, defaultColor: string) => {
    if (previewMode && tempColors[key]) return tempColors[key];
    const setting = settings.find(s => s.key === key);
    return setting?.value || defaultColor;
  };

  // پیش‌نمایش تم
  const applyPreview = () => {
    Object.entries(tempColors).forEach(([key, color]) => {
      const cssVar = key.replace('theme_', '--').replace('_', '-');
      document.documentElement.style.setProperty(cssVar, color);
    });
  };

  // بازگردانی تم
  const resetPreview = () => {
    settings.forEach(setting => {
      if (setting.key.startsWith('theme_')) {
        const cssVar = setting.key.replace('theme_', '--').replace('_', '-');
        document.documentElement.style.setProperty(cssVar, setting.value);
      }
    });
    setTempColors({});
    setPreviewMode(false);
  };

  // ذخیره تم
  const saveTheme = async () => {
    try {
      const promises = Object.entries(tempColors).map(([key, color]) => 
        updateSetting(key, color)
      );
      
      await Promise.all(promises);
      setTempColors({});
      setPreviewMode(false);
      toast.success('تم با موفقیت ذخیره شد');
      
      // اعمال تغییرات به CSS
      applyPreview();
    } catch (error) {
      toast.error('خطا در ذخیره تم');
    }
  };

  // تم‌های پیش‌ساخته
  const predefinedThemes = [
    {
      name: 'آبی کلاسیک',
      description: 'تم پیش‌فرض برای چشم‌پزشکی',
      colors: {
        theme_primary_color: '#0ea5e9',
        theme_secondary_color: '#0284c7',
        theme_accent_color: '#06b6d4',
        theme_background_color: '#f8fafc'
      }
    },
    {
      name: 'سبز پزشکی',
      description: 'تم سبز برای حس طبیعی',
      colors: {
        theme_primary_color: '#10b981',
        theme_secondary_color: '#059669',
        theme_accent_color: '#06d6a0',
        theme_background_color: '#f0fdf4'
      }
    },
    {
      name: 'بنفش مدرن',
      description: 'تم بنفش برای ظاهر مدرن',
      colors: {
        theme_primary_color: '#8b5cf6',
        theme_secondary_color: '#7c3aed',
        theme_accent_color: '#a855f7',
        theme_background_color: '#faf5ff'
      }
    },
    {
      name: 'خاکستری حرفه‌ای',
      description: 'تم خاکستری برای ظاهر جدی',
      colors: {
        theme_primary_color: '#4b5563',
        theme_secondary_color: '#374151',
        theme_accent_color: '#6b7280',
        theme_background_color: '#f9fafb'
      }
    }
  ];

  const applyPredefinedTheme = (theme: typeof predefinedThemes[0]) => {
    setTempColors(theme.colors);
    setPreviewMode(true);
    
    // اعمال فوری برای پیش‌نمایش
    Object.entries(theme.colors).forEach(([key, color]) => {
      const cssVar = key.replace('theme_', '--').replace('_', '-');
      document.documentElement.style.setProperty(cssVar, color);
    });
    
    toast.success(`تم "${theme.name}" اعمال شد`);
  };

  const handleColorChange = (key: string, color: string) => {
    setTempColors(prev => ({ ...prev, [key]: color }));
    setPreviewMode(true);
    
    // اعمال فوری برای پیش‌نمایش
    const cssVar = key.replace('theme_', '--').replace('_', '-');
    document.documentElement.style.setProperty(cssVar, color);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">در حال بارگذاری...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تنظیمات تم</h1>
            <p className="text-gray-600">طراحی و شخصی‌سازی ظاهر سایت</p>
          </div>
        </div>
        
        {previewMode && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
              <Sparkles className="h-3 w-3 mr-1" />
              حالت پیش‌نمایش
            </Badge>
            <Button variant="outline" size="sm" onClick={resetPreview}>
              لغو
            </Button>
            <Button size="sm" onClick={saveTheme} className="bg-green-600 hover:bg-green-700">
              ذخیره تم
            </Button>
          </div>
        )}
      </div>

      {/* Predefined Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            تم‌های پیش‌ساخته
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predefinedThemes.map((theme, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => applyPredefinedTheme(theme)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                  <div className="flex gap-1">
                    {Object.values(theme.colors).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{theme.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            تنظیمات رنگ سفارشی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Colors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">رنگ‌های اصلی</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">رنگ اصلی</Label>
                <ColorPicker
                  value={getCurrentColor('theme_primary_color', '#0ea5e9')}
                  onChange={(color) => handleColorChange('theme_primary_color', color)}
                  label="رنگ اصلی"
                />
              </div>
              
              <div>
                <Label className="text-base font-medium">رنگ ثانویه</Label>
                <ColorPicker
                  value={getCurrentColor('theme_secondary_color', '#0284c7')}
                  onChange={(color) => handleColorChange('theme_secondary_color', color)}
                  label="رنگ ثانویه"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Accent & Background */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">رنگ‌های تکمیلی</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">رنگ لهجه</Label>
                <ColorPicker
                  value={getCurrentColor('theme_accent_color', '#06b6d4')}
                  onChange={(color) => handleColorChange('theme_accent_color', color)}
                  label="رنگ لهجه"
                />
              </div>
              
              <div>
                <Label className="text-base font-medium">رنگ پس‌زمینه</Label>
                <ColorPicker
                  value={getCurrentColor('theme_background_color', '#f8fafc')}
                  onChange={(color) => handleColorChange('theme_background_color', color)}
                  label="رنگ پس‌زمینه"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Text Colors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">رنگ‌های متن</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">متن اصلی</Label>
                <ColorPicker
                  value={getCurrentColor('theme_text_primary', '#1f2937')}
                  onChange={(color) => handleColorChange('theme_text_primary', color)}
                  label="متن اصلی"
                />
              </div>
              
              <div>
                <Label className="text-base font-medium">متن ثانویه</Label>
                <ColorPicker
                  value={getCurrentColor('theme_text_secondary', '#6b7280')}
                  onChange={(color) => handleColorChange('theme_text_secondary', color)}
                  label="متن ثانویه"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {previewMode && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                شما در حالت پیش‌نمایش هستید
              </h3>
              <p className="text-orange-700 mb-4">
                تغییرات شما فقط برای شما قابل مشاهده است. برای اعمال دائمی، روی "ذخیره تم" کلیک کنید.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={resetPreview}>
                  بازگشت به تم قبلی
                </Button>
                <Button onClick={saveTheme} className="bg-green-600 hover:bg-green-700">
                  ذخیره و اعمال تم
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ThemeSettingsForm;
