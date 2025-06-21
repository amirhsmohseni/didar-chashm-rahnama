
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
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

interface SiteSettingsLoaderProps {
  onSettingsLoad: (settings: SiteSettings) => void;
}

const SiteSettingsLoader = ({ onSettingsLoad }: SiteSettingsLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        console.log('Loading site settings...');
        
        // Set default values first
        const defaultSettings: SiteSettings = {
          site_title: 'دیدار چشم رهنما',
          site_description: 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم',
          hero_title: 'دیدار چشم رهنما',
          hero_description: 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران',
          contact_phone: '021-12345678',
          contact_email: 'info@clinic.com',
          contact_address: 'تهران، خیابان ولیعصر',
          site_logo: '',
          site_background: ''
        };

        try {
          const { data, error } = await supabase
            .from('site_settings')
            .select('key, value');

          if (error) {
            console.error('Error loading site settings:', error);
            onSettingsLoad(defaultSettings);
            return;
          }

          if (!data || !Array.isArray(data)) {
            console.log('No settings data found, using defaults');
            onSettingsLoad(defaultSettings);
            return;
          }

          // Convert array to object safely
          const settingsObj: Record<string, string> = {};
          
          data.forEach(setting => {
            if (setting && setting.key && setting.value !== undefined) {
              try {
                let value = setting.value;
                
                // Handle different value types
                if (typeof value === 'string') {
                  // Remove surrounding quotes if present
                  if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                  }
                } else if (typeof value === 'object' && value !== null) {
                  // If it's an object, try to stringify and clean
                  value = JSON.stringify(value).replace(/^"|"$/g, '');
                } else {
                  // Convert other types to string
                  value = String(value);
                }
                
                settingsObj[setting.key] = value;
              } catch (processError) {
                console.error('Error processing setting:', setting.key, processError);
                // Skip this setting if there's an error
              }
            }
          });

          console.log('Processed settings:', settingsObj);

          // Safely merge with defaults
          const finalSettings: SiteSettings = {
            site_title: settingsObj.site_title || defaultSettings.site_title,
            site_description: settingsObj.site_description || defaultSettings.site_description,
            hero_title: settingsObj.hero_title || defaultSettings.hero_title,
            hero_description: settingsObj.hero_description || defaultSettings.hero_description,
            contact_phone: settingsObj.contact_phone || defaultSettings.contact_phone,
            contact_email: settingsObj.contact_email || defaultSettings.contact_email,
            contact_address: settingsObj.contact_address || defaultSettings.contact_address,
            site_logo: settingsObj.site_logo || defaultSettings.site_logo,
            site_background: settingsObj.site_background || defaultSettings.site_background
          };

          console.log('Final settings:', finalSettings);
          onSettingsLoad(finalSettings);

        } catch (dbError) {
          console.error('Database error loading settings:', dbError);
          onSettingsLoad(defaultSettings);
        }

      } catch (error) {
        console.error('Error in loadSettings function:', error);
        // Always call onSettingsLoad with defaults to prevent undefined state
        const defaultSettings: SiteSettings = {
          site_title: 'دیدار چشم رهنما',
          site_description: 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم',
          hero_title: 'دیدار چشم رهنما',
          hero_description: 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران',
          contact_phone: '021-12345678',
          contact_email: 'info@clinic.com',
          contact_address: 'تهران، خیابان ولیعصر',
          site_logo: '',
          site_background: ''
        };
        onSettingsLoad(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [onSettingsLoad]);

  if (isLoading) {
    return null;
  }

  return null; // This component doesn't render anything
};

export default SiteSettingsLoader;
