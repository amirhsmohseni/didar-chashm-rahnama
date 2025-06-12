
import { useState, useEffect } from 'react';
import { Save, Settings, RefreshCw } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SiteSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
}

const SiteSettingsManager = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching site settings...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }
      
      console.log('Site settings data:', data);
      setSettings(data || []);
      
      // Initialize form data
      const initialData: Record<string, string> = {};
      data?.forEach(setting => {
        let value = setting.value;
        if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1); // Remove surrounding quotes
        } else if (typeof value !== 'string') {
          value = JSON.stringify(value).replace(/^"|"$/g, '');
        }
        initialData[setting.key] = value;
      });
      console.log('Initialized form data:', initialData);
      setFormData(initialData);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت تنظیمات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('Saving settings with data:', formData);
      
      const updatePromises = settings.map(async (setting) => {
        const newValue = JSON.stringify(formData[setting.key] || '');
        console.log(`Updating ${setting.key} with value:`, newValue);
        
        const { error } = await supabase
          .from('site_settings')
          .update({ 
            value: newValue,
            updated_at: new Date().toISOString()
          })
          .eq('key', setting.key);
          
        if (error) {
          console.error(`Error updating ${setting.key}:`, error);
          throw error;
        }
      });

      await Promise.all(updatePromises);

      // Log activity
      try {
        await supabase.rpc('log_admin_activity', {
          action_name: 'update_site_settings',
          resource_type_name: 'site_settings',
          details_data: { updated_settings: Object.keys(formData) }
        });
      } catch (logError) {
        console.warn('Failed to log admin activity:', logError);
      }

      toast({
        title: "تنظیمات ذخیره شد",
        description: "تنظیمات سایت با موفقیت بروزرسانی شد",
      });

      // Refresh settings to confirm save
      await fetchSettings();
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

  const handleInputChange = (key: string, value: string) => {
    console.log(`Changing ${key} to:`, value);
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getSettingLabel = (key: string) => {
    const labels: Record<string, string> = {
      'site_title': 'عنوان سایت',
      'site_description': 'توضیحات سایت',
      'hero_title': 'عنوان صفحه اصلی',
      'hero_description': 'توضیحات صفحه اصلی',
      'contact_phone': 'شماره تماس',
      'contact_email': 'ایمیل تماس',
      'contact_address': 'آدرس'
    };
    return labels[key] || key;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>در حال بارگذاری تنظیمات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          تنظیمات سایت
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {settings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هیچ تنظیماتی یافت نشد
          </div>
        ) : (
          settings.map((setting) => (
            <div key={setting.id} className="space-y-2">
              <label className="block text-sm font-medium">
                {getSettingLabel(setting.key)}
              </label>
              {setting.description && (
                <p className="text-xs text-muted-foreground">{setting.description}</p>
              )}
              {['hero_description', 'site_description'].includes(setting.key) ? (
                <Textarea
                  value={formData[setting.key] || ''}
                  onChange={(e) => handleInputChange(setting.key, e.target.value)}
                  rows={3}
                  className="w-full"
                  placeholder={`وارد کردن ${getSettingLabel(setting.key)}`}
                />
              ) : (
                <Input
                  value={formData[setting.key] || ''}
                  onChange={(e) => handleInputChange(setting.key, e.target.value)}
                  className="w-full"
                  placeholder={`وارد کردن ${getSettingLabel(setting.key)}`}
                />
              )}
            </div>
          ))
        )}

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            onClick={fetchSettings} 
            variant="outline"
            disabled={isLoading || isSaving}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            بازخوانی
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteSettingsManager;
