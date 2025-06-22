
import { useState, useEffect } from 'react';
import { Shield, Bell, Users, Lock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch";
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SettingsLayout from './SettingsLayout';
import { toast } from 'sonner';

interface SystemSettings {
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  twoFactorAuth: boolean;
  autoBackup: boolean;
}

const SystemSettingsForm = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    autoBackup: true,
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key: keyof SystemSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for now
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      
      toast.success('تنظیمات سیستم با موفقیت ذخیره شد');
      setHasChanges(false);
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات سیستم');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = () => {
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setHasChanges(false);
  };

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const SettingCard = ({ 
    icon, 
    title, 
    children 
  }: { 
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-blue-100 rounded-lg">
            {icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );

  const SettingItem = ({
    label,
    description,
    checked,
    onChange,
    dangerous = false
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    dangerous?: boolean;
  }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <Label className={`font-medium ${dangerous ? 'text-red-700' : 'text-gray-900'}`}>
          {label}
        </Label>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className={dangerous ? 'data-[state=checked]:bg-red-600' : ''}
      />
    </div>
  );

  return (
    <SettingsLayout
      title="تنظیمات سیستم"
      description="مدیریت تنظیمات امنیتی و عملکردی سیستم"
      icon={<Shield className="h-6 w-6 text-white" />}
      onSave={handleSave}
      onRefresh={handleRefresh}
      isSaving={isSaving}
      hasChanges={hasChanges}
    >
      <div className="grid gap-6">
        {/* تنظیمات امنیتی */}
        <SettingCard
          icon={<Lock className="h-5 w-5 text-blue-600" />}
          title="تنظیمات امنیتی"
        >
          <SettingItem
            label="حالت تعمیر"
            description="سایت برای کاربران عادی غیرقابل دسترس باشد"
            checked={settings.maintenanceMode}
            onChange={(checked) => handleSettingChange('maintenanceMode', checked)}
            dangerous={true}
          />
          
          <SettingItem
            label="احراز هویت دو مرحله‌ای"
            description="فعال‌سازی امنیت اضافی برای ورود ادمین‌ها"
            checked={settings.twoFactorAuth}
            onChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
          />
        </SettingCard>

        {/* تنظیمات کاربران */}
        <SettingCard
          icon={<Users className="h-5 w-5 text-green-600" />}
          title="تنظیمات کاربران"
        >
          <SettingItem
            label="امکان ثبت‌نام"
            description="کاربران جدید بتوانند در سایت ثبت‌نام کنند"
            checked={settings.allowRegistration}
            onChange={(checked) => handleSettingChange('allowRegistration', checked)}
          />
        </SettingCard>

        {/* تنظیمات اعلان‌ها */}
        <SettingCard
          icon={<Bell className="h-5 w-5 text-purple-600" />}
          title="تنظیمات اعلان‌ها"
        >
          <SettingItem
            label="اعلان‌های ایمیل"
            description="ارسال اعلان‌های مهم از طریق ایمیل"
            checked={settings.emailNotifications}
            onChange={(checked) => handleSettingChange('emailNotifications', checked)}
          />
          
          <SettingItem
            label="اعلان‌های پیامک"
            description="ارسال اعلان‌های فوری از طریق پیامک"
            checked={settings.smsNotifications}
            onChange={(checked) => handleSettingChange('smsNotifications', checked)}
          />
        </SettingCard>

        {/* تنظیمات سیستم */}
        <SettingCard
          icon={<Shield className="h-5 w-5 text-orange-600" />}
          title="تنظیمات سیستم"
        >
          <SettingItem
            label="پشتیبان‌گیری خودکار"
            description="ایجاد پشتیبان خودکار از اطلاعات مهم سیستم"
            checked={settings.autoBackup}
            onChange={(checked) => handleSettingChange('autoBackup', checked)}
          />
        </SettingCard>
      </div>
    </SettingsLayout>
  );
};

export default SystemSettingsForm;
