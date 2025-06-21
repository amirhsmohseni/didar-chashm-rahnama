
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

const SiteSettingsLoader = () => {
  useEffect(() => {
    loadAndApplySettings();
  }, []);

  const loadAndApplySettings = async () => {
    try {
      console.log('Loading site settings for application...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) {
        console.error('Error loading site settings:', error);
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

        // Apply site title
        if (settingsMap.site_title) {
          document.title = settingsMap.site_title;
        }

        // Apply custom colors if available
        const savedSettings = localStorage.getItem('headerSettings');
        if (savedSettings) {
          try {
            const headerSettings = JSON.parse(savedSettings);
            if (headerSettings.primaryColor) {
              document.documentElement.style.setProperty('--primary-color', headerSettings.primaryColor);
            }
            if (headerSettings.secondaryColor) {
              document.documentElement.style.setProperty('--secondary-color', headerSettings.secondaryColor);
            }
          } catch (parseError) {
            console.warn('Failed to parse header settings from localStorage:', parseError);
          }
        }
        
        console.log('Site settings applied successfully');
      }
    } catch (error) {
      console.error('Error applying site settings:', error);
    }
  };

  return null;
};

export default SiteSettingsLoader;
