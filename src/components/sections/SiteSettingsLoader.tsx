
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

const SiteSettingsLoader = () => {
  useEffect(() => {
    loadAndApplySettings();
    
    // Listen for settings changes
    const handleSettingsChange = (event: CustomEvent) => {
      const settings = event.detail;
      applySettingsToPage(settings);
    };

    window.addEventListener('siteSettingsChanged', handleSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('siteSettingsChanged', handleSettingsChange as EventListener);
    };
  }, []);

  const loadAndApplySettings = async () => {
    try {
      console.log('Loading site settings for application...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

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
            value = String(value).replace(/^"|"$/g, '');
          }
          settingsMap[setting.key] = value;
        });

        applySettingsToPage(settingsMap);
        console.log('Site settings applied successfully');
      }
    } catch (error) {
      console.error('Error applying site settings:', error);
    }
  };

  const applySettingsToPage = (settings: Record<string, any>) => {
    // Apply site title
    if (settings.site_title) {
      document.title = settings.site_title;
    }

    // Store settings for components to use
    localStorage.setItem('appliedSiteSettings', JSON.stringify(settings));
  };

  return null;
};

export default SiteSettingsLoader;
