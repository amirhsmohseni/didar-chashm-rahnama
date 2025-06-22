
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Settings, Globe, Palette, Share2, Search, Shield, Home, Phone } from 'lucide-react';
import { useAdvancedSiteSettings } from '@/hooks/useAdvancedSiteSettings';
import SettingsCategory from './SettingsCategory';
import { toast } from 'sonner';

const AdvancedSettingsManager = () => {
  const { settings, isLoading, isSaving, error, saveMultipleSettings, loadSettings } = useAdvancedSiteSettings();
  const [changedSettings, setChangedSettings] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('general');

  const categoryConfig = {
    general: {
      label: 'عمومی',
      icon: <Globe className="h-5 w-5" />,
      description: 'تنظیمات کلی و اطلاعات پایه سایت'
    },
    header: {
      label: 'هدر',
      icon: <Settings className="h-5 w-5" />,
      description: 'تنظیمات نمایش و ظاهر هدر سایت'
    },
    homepage: {
      label: 'صفحه اصلی',
      icon: <Home className="h-5 w-5" />,
      description: 'تنظیمات بخش هیرو و صفحه اصلی'
    },
    contact: {
      label: 'تماس',
      icon: <Phone className="h-5 w-5" />,
      description: 'اطلاعات تماس و ارتباط'
    },
    social: {
      label: 'شبکه‌های اجتماعی',
      icon: <Share2 className="h-5 w-5" />,
      description: 'لینک‌های شبکه‌های اجتماعی'
    },
    seo: {
      label: 'سئو',
      icon: <Search className="h-5 w-5" />,
      description: 'تنظیمات بهینه‌سازی موتورهای جستجو'
    },
    appearance: {
      label: 'ظاهر',
      icon: <Palette className="h-5 w-5" />,
      description: 'تنظیمات رنگ‌ها و ظاهر قالب'
    },
    system: {
      label: 'سیستم',
      icon: <Shield className="h-5 w-5" />,
      description: 'تنظیمات امنیتی و سیستمی'
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setChangedSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveAll = async () => {
    if (Object.keys(changedSettings).length === 0) {
      toast.info('تغییری برای ذخیره وجود ندارد');
      return;
    }

    try {
      await saveMultipleSettings(changedSettings);
      setChangedSettings({});
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleRefresh = () => {
    loadSettings();
    setChangedSettings({});
  };

  const hasChanges = Object.keys(changedSettings).length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">در حال بارگذاری تنظیمات...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            تلاش مجدد
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مدیریت تنظیمات</h1>
            <p className="text-gray-600 mt-1">مدیریت کامل تنظیمات و پیکربندی سایت</p>
          </div>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {Object.keys(changedSettings).length} تغییر ذخیره نشده
            </div>
            <Button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 shadow-lg"
            >
              {isSaving ? 'در حال ذخیره...' : 'ذخیره همه تغییرات'}
            </Button>
          </div>
        )}
      </div>

      {/* Settings Tabs */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b bg-gray-50">
              <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
                <div className="flex flex-wrap gap-1 p-4">
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      {config.icon}
                      {config.label}
                      {settings[key] && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {settings[key].length}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>
            </div>

            {Object.entries(categoryConfig).map(([key, config]) => (
              <TabsContent key={key} value={key} className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {config.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{config.label}</h2>
                      <p className="text-gray-600 text-sm">{config.description}</p>
                    </div>
                  </div>
                </div>

                {settings[key] && settings[key].length > 0 ? (
                  <SettingsCategory
                    category={key}
                    settings={settings[key]}
                    changedSettings={changedSettings}
                    onSettingChange={handleSettingChange}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    هیچ تنظیمی در این بخش موجود نیست
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={isSaving}
          className="px-6"
        >
          بازخوانی
        </Button>
        
        <Button
          onClick={handleSaveAll}
          disabled={isSaving || !hasChanges}
          className="px-8 bg-green-600 hover:bg-green-700 shadow-lg"
        >
          {isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </Button>
      </div>
    </div>
  );
};

export default AdvancedSettingsManager;
