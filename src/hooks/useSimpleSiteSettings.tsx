
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
}

export interface SettingsData {
  [category: string]: SettingItem[];
}

export const useSimpleSiteSettings = () => {
  const [settings, setSettings] = useState<SettingsData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category, sort_order');

      if (error) {
        console.error('Error loading settings:', error);
        setError('خطا در بارگذاری تنظیمات');
        return;
      }

      if (data) {
        const groupedSettings: SettingsData = {};
        
        data.forEach((setting) => {
          if (!groupedSettings[setting.category]) {
            groupedSettings[setting.category] = [];
          }
          groupedSettings[setting.category].push({
            ...setting,
            type: setting.type as SettingItem['type']
          });
        });

        setSettings(groupedSettings);
        console.log('Settings loaded successfully');
      }
    } catch (error) {
      console.error('Error in loadSettings:', error);
      setError('خطا در بارگذاری تنظیمات');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSetting = useCallback(async (key: string, value: string) => {
    try {
      setIsSaving(true);
      
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
              ? { ...setting, value }
              : setting
          );
        });
        return updatedSettings;
      });

      toast.success('تنظیم با موفقیت ذخیره شد');
      
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
              ? { ...setting, value: settingsToSave[setting.key] }
              : setting
          );
        });
        return updatedSettings;
      });
      
      toast.success('تنظیمات با موفقیت ذخیره شد');
      
    } catch (error) {
      console.error('Error saving multiple settings:', error);
      toast.error('خطا در ذخیره تنظیمات');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

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
    saveMultipleSettings
  };
};
