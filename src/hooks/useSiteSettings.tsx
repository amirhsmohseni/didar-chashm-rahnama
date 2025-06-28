
import { useSettingsManager } from './useSettingsManager';

export const useSiteSettings = () => {
  const { settings, loading, updateSetting, loadSettings } = useSettingsManager();

  // تبدیل آرایه تنظیمات به شی برای سازگاری
  const settingsObject = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);

  const siteSettings = {
    site_title: settingsObject.site_title || 'دیدار چشم رهنما',
    site_description: settingsObject.site_description || 'مشاوره تخصصی چشم',
    hero_title: settingsObject.hero_title || 'دیدار چشم رهنما',
    hero_description: settingsObject.hero_subtitle || settingsObject.hero_description || 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم',
    contact_phone: settingsObject.contact_phone || '021-12345678',
    contact_email: settingsObject.contact_email || 'info@clinic.com',
    contact_address: settingsObject.contact_address || 'تهران، خیابان ولیعصر',
    site_logo: settingsObject.site_logo || '',
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
