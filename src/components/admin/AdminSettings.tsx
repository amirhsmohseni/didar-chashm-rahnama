
import { useState, useEffect } from 'react';
import { Save, Upload, Download, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'کلینیک چشم',
    siteDescription: 'بهترین خدمات چشم‌پزشکی',
    contactEmail: 'info@clinic.com',
    contactPhone: '021-12345678',
    address: 'تهران، خیابان ولیعصر',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      console.log('Loading admin settings...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) {
        console.error('Error loading settings:', error);
        toast.error('خطا در بارگذاری تنظیمات');
        return;
      }

      if (data && data.length > 0) {
        const settingsMap: Record<string, any> = {};
        data.forEach(setting => {
          let value = setting.value;
          if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (typeof value !== 'string') {
            value = JSON.stringify(value).replace(/^"|"$/g, '');
          }
          settingsMap[setting.key] = value;
        });

        setSettings(prev => ({
          ...prev,
          siteName: settingsMap.site_title || prev.siteName,
          siteDescription: settingsMap.site_description || prev.siteDescription,
          contactEmail: settingsMap.contact_email || prev.contactEmail,
          contactPhone: settingsMap.contact_phone || prev.contactPhone,
          address: settingsMap.contact_address || prev.address,
        }));
        console.log('Settings loaded successfully');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('خطا در بارگذاری تنظیمات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('Saving admin settings...', settings);
      
      const settingsToSave = [
        { key: 'site_title', value: settings.siteName },
        { key: 'site_description', value: settings.siteDescription },
        { key: 'contact_email', value: settings.contactEmail },
        { key: 'contact_phone', value: settings.contactPhone },
        { key: 'contact_address', value: settings.address },
      ];

      // Save each setting individually
      for (const setting of settingsToSave) {
        console.log(`Saving ${setting.key}:`, setting.value);
        
        const { error: upsertError } = await supabase
          .from('site_settings')
          .upsert({
            key: setting.key,
            value: JSON.stringify(setting.value),
            updated_at: new Date().toISOString()
          });

        if (upsertError) {
          console.error(`Error saving ${setting.key}:`, upsertError);
          throw upsertError;
        }
      }

      // Try to log activity, but don't fail if it doesn't work
      try {
        await supabase.rpc('log_admin_activity', {
          action_name: 'update_admin_settings',
          resource_type_name: 'site_settings',
          details_data: { updated_settings: Object.keys(settings) }
        });
      } catch (logError) {
        console.warn('Failed to log admin activity:', logError);
      }

      toast.success('تنظیمات با موفقیت ذخیره شد');
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('خطا در ذخیره تنظیمات: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    toast.success('خروجی داده‌ها در حال آماده‌سازی');
  };

  const handleImportData = () => {
    toast.info('لطفا فایل را انتخاب کنید');
  };

  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success('کش سیستم با موفقیت پاک شد');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">در حال بارگذاری تنظیمات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تنظیمات سیستم</h2>
        <p className="text-gray-600">تنظیمات کلی سایت و سیستم</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* تنظیمات عمومی */}
        <Card>
          <CardHeader>
            <CardTitle>تنظیمات عمومی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">نام سایت</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">توضیحات سایت</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">ایمیل تماس</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">شماره تماس</Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="address">آدرس</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* تنظیمات سیستم */}
        <Card>
          <CardHeader>
            <CardTitle>تنظیمات سیستم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>حالت تعمیر</Label>
                <p className="text-sm text-gray-500">سایت در دسترس کاربران نباشد</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>امکان ثبت‌نام</Label>
                <p className="text-sm text-gray-500">کاربران جدید بتوانند ثبت‌نام کنند</p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>اعلان‌های ایمیل</Label>
                <p className="text-sm text-gray-500">ارسال اعلان‌ها از طریق ایمیل</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>اعلان‌های پیامک</Label>
                <p className="text-sm text-gray-500">ارسال اعلان‌ها از طریق پیامک</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* ابزارهای سیستم */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>ابزارهای سیستم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                onClick={handleSave} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
              </Button>
              <Button onClick={handleExportData} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                خروجی داده‌ها
              </Button>
              <Button onClick={handleImportData} variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                وارد کردن داده‌ها
              </Button>
              <Button onClick={handleClearCache} variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                پاک کردن کش
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
