
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Info, Users, Target, Phone } from 'lucide-react';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { toast } from 'sonner';
import { useState } from 'react';

const AboutSettingsForm = () => {
  const { getSettingsByCategory, updateSetting, loading } = useSettingsManager();
  const [saving, setSaving] = useState(false);
  
  const aboutSettings = getSettingsByCategory('about');

  const getSetting = (key: string) => {
    return aboutSettings.find(s => s.key === key)?.value || '';
  };

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
    try {
      await updateSetting(key, value);
      toast.success('تنظیمات با موفقیت ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">در حال بارگذاری...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
          <Info className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تنظیمات درباره ما</h1>
          <p className="text-gray-600">محتوای صفحه درباره ما را مدیریت کنید</p>
        </div>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            بخش اصلی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero_title">عنوان اصلی</Label>
            <Input
              id="hero_title"
              defaultValue={getSetting('about_hero_title')}
              onBlur={(e) => handleSave('about_hero_title', e.target.value)}
              placeholder="عنوان اصلی صفحه درباره ما"
            />
          </div>
          
          <div>
            <Label htmlFor="hero_description">توضیحات اصلی</Label>
            <Textarea
              id="hero_description"
              defaultValue={getSetting('about_hero_description')}
              onBlur={(e) => handleSave('about_hero_description', e.target.value)}
              placeholder="توضیحات زیر عنوان اصلی"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Mission Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            بخش ماموریت
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mission_title">عنوان ماموریت</Label>
            <Input
              id="mission_title"
              defaultValue={getSetting('about_mission_title')}
              onBlur={(e) => handleSave('about_mission_title', e.target.value)}
              placeholder="عنوان بخش ماموریت"
            />
          </div>
          
          <div>
            <Label htmlFor="mission_content">محتوای ماموریت</Label>
            <Textarea
              id="mission_content"
              defaultValue={getSetting('about_mission_content')}
              onBlur={(e) => handleSave('about_mission_content', e.target.value)}
              placeholder="شرح کامل ماموریت شما"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            آمار و ارقام
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="stats_patients">تعداد بیماران موفق</Label>
              <Input
                id="stats_patients"
                type="number"
                defaultValue={getSetting('about_stats_patients')}
                onBlur={(e) => handleSave('about_stats_patients', e.target.value)}
                placeholder="500"
              />
            </div>
            
            <div>
              <Label htmlFor="stats_doctors">تعداد پزشکان همکار</Label>
              <Input
                id="stats_doctors"
                type="number"
                defaultValue={getSetting('about_stats_doctors')}
                onBlur={(e) => handleSave('about_stats_doctors', e.target.value)}
                placeholder="30"
              />
            </div>
            
            <div>
              <Label htmlFor="stats_satisfaction">درصد رضایت بیماران</Label>
              <Input
                id="stats_satisfaction"
                type="number"
                defaultValue={getSetting('about_stats_satisfaction')}
                onBlur={(e) => handleSave('about_stats_satisfaction', e.target.value)}
                placeholder="98"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            بخش تیم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="team_title">عنوان بخش تیم</Label>
            <Input
              id="team_title"
              defaultValue={getSetting('about_team_title')}
              onBlur={(e) => handleSave('about_team_title', e.target.value)}
              placeholder="تیم ما"
            />
          </div>
          
          <div>
            <Label htmlFor="team_description">توضیحات بخش تیم</Label>
            <Textarea
              id="team_description"
              defaultValue={getSetting('about_team_description')}
              onBlur={(e) => handleSave('about_team_description', e.target.value)}
              placeholder="توضیحات درباره تیم شما"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            بخش تماس
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contact_title">عنوان بخش تماس</Label>
            <Input
              id="contact_title"
              defaultValue={getSetting('about_contact_title')}
              onBlur={(e) => handleSave('about_contact_title', e.target.value)}
              placeholder="تماس با ما"
            />
          </div>
          
          <div>
            <Label htmlFor="contact_description">توضیحات بخش تماس</Label>
            <Textarea
              id="contact_description"
              defaultValue={getSetting('about_contact_description')}
              onBlur={(e) => handleSave('about_contact_description', e.target.value)}
              placeholder="توضیحات بخش تماس در صفحه درباره ما"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSettingsForm;
