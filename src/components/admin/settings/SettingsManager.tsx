
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Palette, Globe, Info, Monitor } from 'lucide-react';
import SiteSettingsForm from './SiteSettingsForm';
import ThemeSettingsForm from './ThemeSettingsForm';
import SystemSettingsForm from './SystemSettingsForm';
import AboutSettingsForm from './AboutSettingsForm';

const SettingsManager = () => {
  const [activeTab, setActiveTab] = useState('site');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">مدیریت تنظیمات</h1>
        <p className="text-gray-600 mt-2">تنظیمات سایت، تم و سیستم را مدیریت کنید</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="site" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            تنظیمات سایت
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            درباره ما
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            تم و ظاهر
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            سیستم
          </TabsTrigger>
        </TabsList>

        <TabsContent value="site" className="space-y-6">
          <SiteSettingsForm />
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <AboutSettingsForm />
        </TabsContent>

        <TabsContent value="theme" className="space-y-6">
          <ThemeSettingsForm />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <SystemSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManager;
