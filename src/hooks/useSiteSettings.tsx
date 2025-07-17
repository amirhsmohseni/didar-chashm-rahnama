
import { useSettingsManager } from './useSettingsManager';

export const useSiteSettings = () => {
  const { settings, loading, updateSetting, loadSettings } = useSettingsManager();

  // تبدیل آرایه تنظیمات به شی برای سازگاری
  const settingsObject = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);

  const siteSettings = {
    site_title: settingsObject.site_title || 'Ceritamed',
    site_description: settingsObject.site_description || 'تغییر رنگ چشم - مشاوره تخصصی',
    hero_title: settingsObject.hero_title || 'Ceritamed',
    hero_description: settingsObject.hero_subtitle || settingsObject.hero_description || 'مرکز تخصصی تغییر رنگ چشم و خدمات پزشکی',
    contact_phone: settingsObject.contact_phone || '021-12345678',
    contact_email: settingsObject.contact_email || 'info@ceritamed.com',
    contact_address: settingsObject.contact_address || 'تهران، خیابان ولیعصر',
    site_logo: settingsObject.site_logo || '/lovable-uploads/0cc32d95-fb28-4a91-b57a-368d4a45b365.png',
    site_background: settingsObject.hero_background_image || settingsObject.site_background || ''
  };

  const saveSettings = async (newSettings: Record<string, string>) => {
    console.log('شروع ذخیره تنظیمات:', newSettings);
    
    try {
      const promises = Object.entries(newSettings).map(([key, value]) => {
        console.log(`ذخیره تنظیم ${key}:`, value);
        return updateSetting(key, value);
      });
      
      const results = await Promise.all(promises);
      console.log('نتایج ذخیره:', results);
      
      // بارگذاری مجدد تنظیمات برای اطمینان از بروزرسانی UI
      await loadSettings();
      
      const allSuccessful = results.every(result => result === true);
      
      if (allSuccessful) {
        console.log('همه تنظیمات با موفقیت ذخیره شدند');
        
        // اطلاع‌رسانی به کامپوننت‌های دیگر
        window.dispatchEvent(new CustomEvent('siteSettingsChanged', { 
          detail: newSettings 
        }));
        
        return true;
      } else {
        console.error('برخی تنظیمات ذخیره نشدند');
        return false;
      }
    } catch (error) {
      console.error('خطا در ذخیره تنظیمات:', error);
      return false;
    }
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
