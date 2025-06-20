
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
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value');

        if (error) {
          console.error('Error loading site settings:', error);
          return;
        }

        // Convert array to object
        const settingsObj: any = {};
        data?.forEach(setting => {
          let value = setting.value;
          if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1); // Remove surrounding quotes
          } else if (typeof value !== 'string') {
            value = JSON.stringify(value).replace(/^"|"$/g, '');
          }
          settingsObj[setting.key] = value;
        });

        // Set default values if not found
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

        const finalSettings = { ...defaultSettings, ...settingsObj };
        onSettingsLoad(finalSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [onSettingsLoad]);

  return null; // This component doesn't render anything
};

export default SiteSettingsLoader;
