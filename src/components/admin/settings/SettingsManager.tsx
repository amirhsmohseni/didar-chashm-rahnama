
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Globe, Palette, Share2, Search, Shield, Home, Phone, Brush } from 'lucide-react';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import SettingInput from './SettingInput';
import ThemeSettingsForm from './ThemeSettingsForm';

const SettingsManager = () => {
  const { settings, loading, updateSetting, getSettingsByCategory } = useSettingsManager();

  const categories = [
    { key: 'general', label: 'عمومی', icon: Globe, description: 'تنظیمات کلی سایت' },
    { key: 'theme', label: 'تم و ظاهر', icon: Brush, description: 'تنظیمات رنگ و ظاهر', isCustom: true },
    { key: 'header', label: 'هدر', icon: Settings, description: 'تنظیمات هدر' },
    { key: 'homepage', label: 'صفحه اصلی', icon: Home, description: 'تنظیمات صفحه اصلی' },
    { key: 'contact', label: 'تماس', icon: Phone, description: 'اطلاعات تماس' },
    { key: 'social', label: 'شبکه‌های اجتماعی', icon: Share2, description: 'لینک‌های اجتماعی' },
    { key: 'seo', label: 'سئو', icon: Search, description: 'تنظیمات SEO' },
    { key: 'appearance', label: 'ظاهر', icon: Palette, description: 'تنظیمات ظاهری' },
    { key: 'system', label: 'سیستم', icon: Shield, description: 'تنظیمات سیستم' }
  ];

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
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت تنظیمات</h1>
          <p className="text-gray-600 mt-1">مدیریت تنظیمات سایت</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <Tabs defaultValue="general" className="w-full">
            <div className="border-b bg-gray-50">
              <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
                <div className="flex flex-wrap gap-1 p-4">
                  {categories.map((category) => {
                    const categorySettings = getSettingsByCategory(category.key);
                    const Icon = category.icon;
                    
                    return (
                      <TabsTrigger
                        key={category.key}
                        value={category.key}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <Icon className="h-4 w-4" />
                        {category.label}
                        {!category.isCustom && categorySettings.length > 0 && (
                          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                            {categorySettings.length}
                          </span>
                        )}
                        {category.isCustom && (
                          <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                            جدید
                          </span>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </div>
              </TabsList>
            </div>

            {categories.map((category) => {
              const categorySettings = getSettingsByCategory(category.key);
              const Icon = category.icon;
              
              return (
                <TabsContent key={category.key} value={category.key} className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{category.label}</h2>
                        <p className="text-gray-600 text-sm">{category.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Custom Theme Settings */}
                  {category.key === 'theme' ? (
                    <ThemeSettingsForm />
                  ) : (
                    <>
                      {categorySettings.length > 0 ? (
                        <div className="grid gap-6">
                          {categorySettings.map((setting) => (
                            <SettingInput
                              key={setting.id}
                              setting={setting}
                              onUpdate={updateSetting}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          هیچ تنظیمی در این بخش موجود نیست
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsManager;
