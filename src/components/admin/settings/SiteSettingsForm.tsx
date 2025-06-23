
import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import SettingsLayout from './SettingsLayout';
import ImageUploadSection from './ImageUploadSection';

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
    if (settings) {
      console.log('Settings loaded:', settings);
      const newData: FormData = {
        site_title: settings.site_title || '',
        contact_phone: settings.contact_phone || '',
        contact_email: settings.contact_email || '',
        site_description: settings.site_description || '',
        contact_address: settings.contact_address || '',
        hero_title: settings.hero_title || '',
        hero_description: settings.hero_description || '',
        site_logo: settings.site_logo || '',
        site_background: settings.site_background || ''
      };
      
      setFormData(newData);
      setInitialData(newData);
      setHasChanges(false);
    }
  }, [settings]);

  const handleInputChange = (key: keyof FormData, value: string) => {
    console.log(`Changing ${key} from "${formData[key]}" to "${value}"`);
    
    const newFormData = { ...formData, [key]: value };
    setFormData(newFormData);
    
    // Check if there are changes
    const hasActualChanges = JSON.stringify(newFormData) !== JSON.stringify(initialData);
    setHasChanges(hasActualChanges);
    
    console.log('Has changes:', hasActualChanges);
  };

  const handleSave = async () => {
    try {
      console.log('Saving form data:', formData);
      await saveSettings(formData);
      setInitialData(formData);
      setHasChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleRefresh = () => {
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
        {/* تصاویر سایت */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">تصاویر سایت</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <ImageUploadSection
              title="لوگوی سایت"
              currentImage={formData.site_logo}
              onImageChange={(url) => handleInputChange('site_logo', url || '')}
              aspectRatio="1/1"
            />
            <ImageUploadSection
              title="تصویر پس‌زمینه"
              currentImage={formData.site_background}
              onImageChange={(url) => handleInputChange('site_background', url || '')}
              aspectRatio="16/9"
            />
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
