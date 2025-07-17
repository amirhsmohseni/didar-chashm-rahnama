
import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import SettingsLayout from './SettingsLayout';
import SimpleImageUploader from './SimpleImageUploader';

interface FormData {
  site_title: string;
  contact_phone: string;
  contact_email: string;
  site_description: string;
  contact_address: string;
  hero_title: string;
  hero_description: string;
  site_logo: string;
  site_background: string;
  [key: string]: string;
}

const SiteSettingsForm = () => {
  const { settings, isLoading, isSaving, saveSettings, loadSettings } = useSiteSettings();
  const [formData, setFormData] = useState<FormData>({
    site_title: '',
    contact_phone: '',
    contact_email: '',
    site_description: '',
    contact_address: '',
    hero_title: '',
    hero_description: '',
    site_logo: '',
    site_background: ''
  });
  const [initialData, setInitialData] = useState<FormData>({
    site_title: '',
    contact_phone: '',
    contact_email: '',
    site_description: '',
    contact_address: '',
    hero_title: '',
    hero_description: '',
    site_logo: '',
    site_background: ''
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      console.log('تنظیمات در فرم بارگذاری شد:', settings);
      const newData: FormData = {
        site_title: settings.site_title || '',
        contact_phone: settings.contact_phone || '',
        contact_email: settings.contact_email || '',
        site_description: settings.site_description || '',
        contact_address: settings.contact_address || '',
        hero_title: settings.hero_title || '',
        hero_description: settings.hero_description || '',
        site_logo: settings.site_logo || '/lovable-uploads/0cc32d95-fb28-4a91-b57a-368d4a45b365.png',
        site_background: settings.site_background || ''
      };
      
      // فقط اگر داده‌ها واقعاً متفاوت باشند، آپدیت کن
      const hasDataChanged = Object.keys(newData).some(
        key => newData[key as keyof FormData] !== formData[key as keyof FormData]
      );
      
      if (hasDataChanged) {
        setFormData(newData);
        setInitialData(newData);
        setHasChanges(false);
      }
    }
  }, [settings]); // فقط وابسته به settings باشد

  const handleInputChange = (key: keyof FormData, value: string | null) => {
    const newValue = value || '';
    console.log(`بروزرسانی ${key}:`, newValue);
    
    setFormData(prevData => {
      const newFormData = { ...prevData, [key]: newValue };
      
      // بررسی تغییرات
      const hasActualChanges = Object.keys(newFormData).some(
        k => newFormData[k] !== initialData[k]
      );
      setHasChanges(hasActualChanges);
      
      console.log('فرم دارای تغییرات:', hasActualChanges);
      console.log('داده‌های جدید فرم:', newFormData);
      
      return newFormData;
    });
  };

  const handleImageChange = (key: 'site_logo' | 'site_background', url: string | null) => {
    console.log(`تغییر تصویر ${key}:`, url);
    handleInputChange(key, url);
  };

  const handleSave = async () => {
    try {
      console.log('ذخیره داده‌های فرم:', formData);
      const success = await saveSettings(formData);
      
      if (success) {
        setInitialData({ ...formData });
        setHasChanges(false);
        console.log('تنظیمات با موفقیت ذخیره شد');
      } else {
        console.error('خطا در ذخیره تنظیمات');
      }
    } catch (error) {
      console.error('ذخیره ناموفق:', error);
    }
  };

  const handleRefresh = () => {
    console.log('بارگذاری مجدد تنظیمات');
    loadSettings();
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">در حال بارگذاری...</span>
      </div>
    );
  }

  return (
    <SettingsLayout
      title="تنظیمات سایت"
      description="مدیریت اطلاعات کلی و محتوای سایت"
      icon={<Settings className="h-6 w-6 text-white" />}
      onSave={handleSave}
      onRefresh={handleRefresh}
      isSaving={isSaving}
      hasChanges={hasChanges}
    >
      <div className="space-y-8">
        {/* بخش تصاویر سایت */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            تصاویر سایت
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <SimpleImageUploader
                title="لوگوی سایت"
                currentImage={formData.site_logo || '/lovable-uploads/0cc32d95-fb28-4a91-b57a-368d4a45b365.png'}
                onImageChange={(url) => handleImageChange('site_logo', url)}
                aspectRatio="1/1"
              />
              <p className="text-xs text-gray-500">
                بهترین اندازه: 200x200 پیکسل، فرمت PNG یا SVG
              </p>
            </div>
            
            <div className="space-y-2">
              <SimpleImageUploader
                title="تصویر پس‌زمینه صفحه اصلی"
                currentImage={formData.site_background || null}
                onImageChange={(url) => handleImageChange('site_background', url)}
                aspectRatio="16/9"
              />
              <p className="text-xs text-gray-500">
                بهترین اندازه: 1920x1080 پیکسل، کیفیت بالا
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* اطلاعات پایه */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات پایه</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="site_title">عنوان سایت</Label>
              <Input
                id="site_title"
                value={formData.site_title}
                onChange={(e) => handleInputChange('site_title', e.target.value)}
                placeholder="عنوان سایت را وارد کنید"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">شماره تماس</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="شماره تماس را وارد کنید"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contact_email">ایمیل تماس</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                placeholder="ایمیل تماس را وارد کنید"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="site_description">توضیحات سایت</Label>
              <Textarea
                id="site_description"
                value={formData.site_description}
                onChange={(e) => handleInputChange('site_description', e.target.value)}
                placeholder="توضیحات کوتاه درباره سایت"
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contact_address">آدرس</Label>
              <Textarea
                id="contact_address"
                value={formData.contact_address}
                onChange={(e) => handleInputChange('contact_address', e.target.value)}
                placeholder="آدرس کامل را وارد کنید"
                rows={2}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* محتوای صفحه اصلی */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">محتوای صفحه اصلی</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero_title">عنوان اصلی صفحه</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) => handleInputChange('hero_title', e.target.value)}
                placeholder="عنوان اصلی صفحه را وارد کنید"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="hero_description">توضیحات صفحه اصلی</Label>
              <Textarea
                id="hero_description"
                value={formData.hero_description}
                onChange={(e) => handleInputChange('hero_description', e.target.value)}
                placeholder="توضیحات صفحه اصلی را وارد کنید"
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default SiteSettingsForm;
