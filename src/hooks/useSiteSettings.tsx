
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

export interface SiteSettings {
  site_title: string;
  site_description: string;
  hero_title: string;
  hero_description: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  site_logo: string;
  site_background: string;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    site_title: 'دیدار چشم رهنما',
    site_description: 'مشاوره تخصصی چشم',
    hero_title: 'دیدار چشم رهنما',
    hero_description: 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم',
    contact_phone: '021-12345678',
    contact_email: 'info@clinic.com',
    contact_address: 'تهران، خیابان ولیعصر',
    site_logo: '',
    site_background: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading site settings...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) {
        console.error('Error loading settings:', error);
        toast.error('خطا در بارگذاری تنظیمات');
        return;
      }

      if (data && data.length > 0) {
        const settingsMap: Partial<SiteSettings> = {};
        
        data.forEach((setting) => {
          let value = setting.value;
          
          // Clean JSON quotes if present
          if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (typeof value !== 'string') {
            value = String(value).replace(/^"|"$/g, '');
          }
          
          settingsMap[setting.key as keyof SiteSettings] = value;
        });

        setSettings(prev => ({ ...prev, ...settingsMap }));
        console.log('Settings loaded successfully:', settingsMap);
      }
    } catch (error) {
      console.error('Error in loadSettings:', error);
      toast.error('خطا در بارگذاری تنظیمات');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    try {
      setIsSaving(true);
      console.log('Saving settings:', newSettings);

      // Update local state first
      setSettings(prev => ({ ...prev, ...newSettings }));

      // Save to database
      const promises = Object.entries(newSettings).map(async ([key, value]) => {
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            key,
            value: JSON.stringify(value || ''),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'key'
          });

        if (error) {
          console.error(`Error saving ${key}:`, error);
          throw error;
        }
      });

      await Promise.all(promises);

      // Apply settings immediately
      applySettings({ ...settings, ...newSettings });
      
      toast.success('تنظیمات با موفقیت ذخیره شد');
      console.log('Settings saved successfully');
      
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('خطا در ذخیره تنظیمات');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  const applySettings = useCallback((settingsToApply: SiteSettings) => {
    // Apply site title
    if (settingsToApply.site_title) {
      document.title = settingsToApply.site_title;
    }

    // Store settings for other components
    localStorage.setItem('appliedSiteSettings', JSON.stringify(settingsToApply));
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('siteSettingsChanged', { 
      detail: settingsToApply 
    }));
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    isSaving,
    loadSettings,
    saveSettings,
    applySettings
  };
};
