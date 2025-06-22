
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
        .select('key, value, is_public')
        .eq('is_public', true);

      if (error) {
        console.error('Error loading site settings:', error);
        return;
      }

      if (data && data.length > 0) {
        const settingsMap: Record<string, string> = {};
        data.forEach(setting => {
          settingsMap[setting.key] = setting.value;
        });

        applySettingsToPage(settingsMap);
        console.log('Site settings applied successfully');
      }
    } catch (error) {
      console.error('Error applying site settings:', error);
    }
  };

  const applySettingsToPage = (settings: Record<string, string>) => {
    // Apply site title
    if (settings.site_title) {
      document.title = settings.site_title;
    }

    // Apply favicon
    if (settings.site_favicon) {
      updateFavicon(settings.site_favicon);
    }

    // Apply theme colors
    if (settings.theme_primary_color) {
      document.documentElement.style.setProperty('--primary-color', settings.theme_primary_color);
    }

    if (settings.theme_secondary_color) {
      document.documentElement.style.setProperty('--secondary-color', settings.theme_secondary_color);
    }

    // Store settings for components to use
    localStorage.setItem('appliedSiteSettings', JSON.stringify(settings));
  };

  const updateFavicon = (faviconUrl: string) => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  return null;
};

export default SiteSettingsLoader;
