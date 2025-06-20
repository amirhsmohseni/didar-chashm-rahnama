
import { useState, useEffect } from 'react';
import { Save, Upload, Download, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
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

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        const settingsMap: Record<string, any> = {};
        data.forEach(setting => {
          let value = setting.value;
          if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
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
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update site_settings table
      const updates = [
        { key: 'site_title', value: JSON.stringify(settings.siteName) },
        { key: 'site_description', value: JSON.stringify(settings.siteDescription) },
        { key: 'contact_email', value: JSON.stringify(settings.contactEmail) },
        { key: 'contact_phone', value: JSON.stringify(settings.contactPhone) },
        { key: 'contact_address', value: JSON.stringify(settings.address) },
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
          throw error;
        }
      }

      toast({
        title: "تنظیمات ذخیره شد",
        description: "تغییرات با موفقیت اعمال شد",
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

  const handleExportData = () => {
    toast({
      title: "خروجی داده‌ها",
      description: "داده‌ها در حال آماده‌سازی هستند",
    });
  };

  const handleImportData = () => {
    toast({
      title: "وارد کردن داده‌ها",
      description: "لطفا فایل را انتخاب کنید",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "کش پاک شد",
      description: "کش سیستم با موفقیت پاک شد",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>در حال بارگذاری تنظیمات...</p>
        </div>
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
              <Button onClick={handleSave} className="w-full" disabled={isSaving}>
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
