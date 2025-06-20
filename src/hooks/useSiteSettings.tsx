
import { useState, useEffect } from 'react';
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

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    site_title: 'دیدار چشم رهنما',
    site_description: 'مشاوره تخصصی چشم',
    hero_title: 'دیدار چشم رهنما',
    hero_description: 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران',
    contact_phone: '021-12345678',
    contact_email: 'info@clinic.com',
    contact_address: 'تهران، خیابان ولیعصر',
    site_logo: '',
    site_background: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) {
        console.error('Error fetching site settings:', error);
        return;
      }

      if (data) {
        const settingsObject: Partial<SiteSettings> = {};
        data.forEach(item => {
          let value = item.value;
          if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (typeof value !== 'string') {
            value = JSON.stringify(value).replace(/^"|"$/g, '');
          }
          settingsObject[item.key as keyof SiteSettings] = value;
        });
        
        setSettings(prev => ({ ...prev, ...settingsObject }));
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { settings, isLoading, refetch: fetchSettings };
};
