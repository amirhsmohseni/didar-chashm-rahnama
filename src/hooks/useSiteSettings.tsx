
import { useAdvancedSiteSettings } from './useAdvancedSiteSettings';

// Compatibility wrapper for old useSiteSettings hook
export const useSiteSettings = () => {
  const {
    settings: settingsGrouped,
    getSetting,
    getSettingValue,
    saveMultipleSettings,
    isLoading,
    isSaving,
    loadSettings,
    applyPublicSettings
  } = useAdvancedSiteSettings();

  // Convert grouped settings to flat object for backward compatibility
  const settings = {
    site_title: getSettingValue('site_title', 'دیدار چشم رهنما'),
    site_description: getSettingValue('site_description', 'مشاوره تخصصی چشم'),
    hero_title: getSettingValue('hero_title', 'دیدار چشم رهنما'),
    hero_description: getSettingValue('hero_subtitle', 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم'),
    contact_phone: getSettingValue('contact_phone', '021-12345678'),
    contact_email: getSettingValue('contact_email', 'info@clinic.com'),
    contact_address: getSettingValue('contact_address', 'تهران، خیابان ولیعصر'),
    site_logo: getSettingValue('site_logo', ''),
    site_background: getSettingValue('hero_background_image', '')
  };

  const saveSettings = async (newSettings: Record<string, string>) => {
    await saveMultipleSettings(newSettings);
  };

  return {
    settings,
    isLoading,
    isSaving,
    loadSettings,
    saveSettings,
    applySettings: applyPublicSettings
  };
};

export * from './useAdvancedSiteSettings';
