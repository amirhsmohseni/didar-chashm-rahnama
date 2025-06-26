
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

export interface Setting {
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

export const useSettingsManager = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category, sort_order');

      if (error) {
        console.error('Error loading settings:', error);
        toast.error('خطا در بارگذاری تنظیمات');
        return;
      }

      if (data) {
        const convertedSettings: Setting[] = data.map(item => ({
          id: item.id,
          key: item.key,
          value: item.value || '',
          category: item.category,
          type: ['text', 'textarea', 'boolean', 'number', 'image', 'color'].includes(item.type) 
            ? item.type as 'text' | 'textarea' | 'boolean' | 'number' | 'image' | 'color'
            : 'text',
          label: item.label,
          description: item.description,
          is_public: item.is_public,
          sort_order: item.sort_order
        }));
        
        setSettings(convertedSettings);
      }
    } catch (error) {
      console.error('Error in loadSettings:', error);
      toast.error('خطا در بارگذاری تنظیمات');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key);

      if (error) {
        console.error(`Error updating setting ${key}:`, error);
        toast.error('خطا در ذخیره تنظیم');
        return false;
      }

      // Update local state
      setSettings(prev => 
        prev.map(setting => 
          setting.key === key 
            ? { ...setting, value }
            : setting
        )
      );

      // اعمال فوری تنظیمات تم
      if (key.startsWith('theme_')) {
        applyThemeColor(key, value);
      }

      // اطلاع‌رسانی به سایر کامپوننت‌ها
      const settingsObj: Record<string, string> = {};
      settingsObj[key] = value;
      window.dispatchEvent(new CustomEvent('siteSettingsChanged', { 
        detail: settingsObj 
      }));

      toast.success('تنظیم با موفقیت ذخیره شد');
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('خطا در ذخیره تنظیم');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const applyThemeColor = (key: string, value: string) => {
    const themeColorMappings = {
      'theme_primary_color': '--primary',
      'theme_secondary_color': '--secondary', 
      'theme_accent_color': '--accent',
      'theme_background_color': '--background',
      'theme_text_primary': '--foreground',
      'theme_text_secondary': '--muted-foreground'
    };

    const cssVar = themeColorMappings[key as keyof typeof themeColorMappings];
    if (cssVar && value) {
      const hsl = hexToHsl(value);
      document.documentElement.style.setProperty(cssVar, hsl);
      console.log(`Applied ${cssVar}: ${hsl} from ${value}`);
    }
  };

  const hexToHsl = (hex: string) => {
    hex = hex.replace('#', '');
    
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.category === category);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    saving,
    loadSettings,
    updateSetting,
    getSettingsByCategory
  };
};
