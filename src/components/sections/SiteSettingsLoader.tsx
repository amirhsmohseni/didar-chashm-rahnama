
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

    // Apply theme colors with proper CSS variable names
    const themeColorMappings = {
      'theme_primary_color': '--primary',
      'theme_secondary_color': '--secondary', 
      'theme_accent_color': '--accent',
      'theme_background_color': '--background',
      'theme_text_primary': '--foreground',
      'theme_text_secondary': '--muted-foreground'
    };

    Object.entries(themeColorMappings).forEach(([settingKey, cssVar]) => {
      if (settings[settingKey]) {
        // Convert hex to HSL for better CSS variable support
        const hsl = hexToHsl(settings[settingKey]);
        document.documentElement.style.setProperty(cssVar, hsl);
        console.log(`Applied ${cssVar}: ${hsl}`);
      }
    });

    // Store settings for components to use
    localStorage.setItem('appliedSiteSettings', JSON.stringify(settings));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('siteSettingsApplied', { detail: settings }));
  };

  const updateFavicon = (faviconUrl: string) => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  const hexToHsl = (hex: string) => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
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

  return null;
};

export default SiteSettingsLoader;
