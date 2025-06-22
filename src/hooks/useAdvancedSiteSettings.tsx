
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

export interface SettingItem {
  id: string;
  key: string;
  value: string;
  category: string;
  type: 'text' | 'textarea' | 'boolean' | 'number' | 'image' | 'color';
  label: string;
  description?: string;
  is_public: boolean;
  sort_order: number;
  validation_rules: any;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface SettingsGroup {
  [category: string]: SettingItem[];
}

export const useAdvancedSiteSettings = () => {
  const [settings, setSettings] = useState<SettingsGroup>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading advanced site settings...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category, sort_order');

      if (error) {
        console.error('Error loading settings:', error);
        setError('خطا در بارگذاری تنظیمات');
        toast.error('خطا در بارگذاری تنظیمات');
        return;
      }

      if (data) {
        const groupedSettings: SettingsGroup = {};
        
        data.forEach((setting) => {
          // Type assertion to ensure compatibility
          const typedSetting: SettingItem = {
            ...setting,
            type: (setting.type as SettingItem['type']) || 'text'
          };
          
          if (!groupedSettings[setting.category]) {
            groupedSettings[setting.category] = [];
          }
          groupedSettings[setting.category].push(typedSetting);
        });

        setSettings(groupedSettings);
        console.log('Settings loaded successfully:', groupedSettings);
        
        // Apply public settings to page
        const publicSettings = data.filter(s => s.is_public).map(s => ({
          ...s,
          type: (s.type as SettingItem['type']) || 'text'
        }));
        applyPublicSettings(publicSettings);
      }
    } catch (error) {
      console.error('Error in loadSettings:', error);
      setError('خطا در بارگذاری تنظیمات');
      toast.error('خطا در بارگذاری تنظیمات');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSetting = useCallback(async (key: string, value: string) => {
    try {
      setIsSaving(true);
      console.log(`Saving setting ${key}:`, value);

      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value,
          updated_at: new Date().toISOString()
        })
        .eq('key', key);

      if (error) {
        console.error(`Error saving ${key}:`, error);
        toast.error(`خطا در ذخیره ${key}`);
        throw error;
      }

      // Update local state
      setSettings(prev => {
        const updatedSettings = { ...prev };
        Object.keys(updatedSettings).forEach(category => {
          updatedSettings[category] = updatedSettings[category].map(setting => 
            setting.key === key 
              ? { ...setting, value, updated_at: new Date().toISOString() }
              : setting
          );
        });
        return updatedSettings;
      });

      toast.success(`تنظیم ${key} با موفقیت ذخیره شد`);
      console.log(`Setting ${key} saved successfully`);
      
    } catch (error) {
      console.error('Error saving setting:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const saveMultipleSettings = useCallback(async (settingsToSave: Record<string, string>) => {
    try {
      setIsSaving(true);
      console.log('Saving multiple settings:', settingsToSave);

      // Save all settings to database
      const promises = Object.entries(settingsToSave).map(async ([key, value]) => {
        const { error } = await supabase
          .from('site_settings')
          .update({ 
            value,
            updated_at: new Date().toISOString()
          })
          .eq('key', key);

        if (error) {
          console.error(`Error saving ${key}:`, error);
          throw error;
        }
      });

      await Promise.all(promises);

      // Update local state
      setSettings(prev => {
        const updatedSettings = { ...prev };
        Object.keys(updatedSettings).forEach(category => {
          updatedSettings[category] = updatedSettings[category].map(setting => 
            settingsToSave[setting.key] !== undefined
              ? { ...setting, value: settingsToSave[setting.key], updated_at: new Date().toISOString() }
              : setting
          );
        });
        return updatedSettings;
      });

      // Apply public settings after state update
      setTimeout(() => {
        setSettings(currentSettings => {
          const publicSettings = Object.keys(currentSettings).flatMap(category => 
            currentSettings[category].filter(s => s.is_public)
          );
          applyPublicSettings(publicSettings);
          return currentSettings;
        });
      }, 0);
      
      toast.success('تنظیمات با موفقیت ذخیره شد');
      console.log('Multiple settings saved successfully');
      
    } catch (error) {
      console.error('Error saving multiple settings:', error);
      toast.error('خطا در ذخیره تنظیمات');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const getSetting = useCallback((key: string): SettingItem | null => {
    for (const category of Object.keys(settings)) {
      const setting = settings[category].find(s => s.key === key);
      if (setting) return setting;
    }
    return null;
  }, [settings]);

  const getSettingValue = useCallback((key: string, defaultValue: string = ''): string => {
    const setting = getSetting(key);
    return setting?.value || defaultValue;
  }, [getSetting]);

  const applyPublicSettings = useCallback((publicSettings: SettingItem[]) => {
    console.log('Applying public settings to page:', publicSettings);
    
    publicSettings.forEach(setting => {
      switch (setting.key) {
        case 'site_title':
          if (setting.value) {
            document.title = setting.value;
          }
          break;
        case 'site_favicon':
          if (setting.value) {
            updateFavicon(setting.value);
          }
          break;
        case 'theme_primary_color':
          if (setting.value) {
            document.documentElement.style.setProperty('--primary-color', setting.value);
          }
          break;
        case 'theme_secondary_color':
          if (setting.value) {
            document.documentElement.style.setProperty('--secondary-color', setting.value);
          }
          break;
      }
    });

    // Store settings for components to use
    localStorage.setItem('appliedSiteSettings', JSON.stringify(
      publicSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>)
    ));
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('siteSettingsChanged', { 
      detail: publicSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>)
    }));
  }, []);

  const updateFavicon = (faviconUrl: string) => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    loadSettings,
    saveSetting,
    saveMultipleSettings,
    getSetting,
    getSettingValue,
    applyPublicSettings
  };
};
