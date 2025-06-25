
import { useSettingsManager } from './useSettingsManager';

// Compatibility wrapper for old useSiteSettings hook
export const useSiteSettings = () => {
  const { settings, loading, updateSetting, loadSettings } = useSettingsManager();

  // Convert settings array to object for backward compatibility
  const settingsObject = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);

  const siteSettings = {
    site_title: settingsObject.site_title || 'دیدار چشم رهنما',
    site_description: settingsObject.site_description || 'مشاوره تخصصی چشم',
    hero_title: settingsObject.hero_title || 'دیدار چشم رهنما',
    hero_description: settingsObject.hero_subtitle || 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم',
    contact_phone: settingsObject.contact_phone || '021-12345678',
    contact_email: settingsObject.contact_email || 'info@clinic.com',
    contact_address: settingsObject.contact_address || 'تهران، خیابان ولیعصر',
    site_logo: settingsObject.site_logo || '',
    site_background: settingsObject.hero_background_image || ''
  };

  const saveSettings = async (newSettings: Record<string, string>) => {
    const promises = Object.entries(newSettings).map(([key, value]) => 
      updateSetting(key, value)
    );
    
    const results = await Promise.all(promises);
    return results.every(result => result === true);
  };

  return {
    settings: siteSettings,
    isLoading: loading,
    isSaving: false,
    loadSettings,
    saveSettings,
    applySettings: loadSettings
  };
};
