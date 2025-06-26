
import { useEffect, useState } from 'react';
import { Eye, Users, Award, Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface AboutSettings {
  about_hero_title: string;
  about_hero_description: string;
  about_mission_title: string;
  about_mission_content: string;
  about_stats_patients: string;
  about_stats_doctors: string;
  about_stats_satisfaction: string;
  about_team_title: string;
  about_team_description: string;
  about_contact_title: string;
  about_contact_description: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
}

const About = () => {
  const [settings, setSettings] = useState<AboutSettings>({
    about_hero_title: 'درباره دیدار چشم رهنما',
    about_hero_description: 'ما بیماران را به بهترین جراحان چشم ایران متصل می‌کنیم و در تمام مراحل درمان کنار شما هستیم.',
    about_mission_title: 'ماموریت ما',
    about_mission_content: 'ماموریت ما در دیدار چشم رهنما، کمک به بیماران برای دریافت بهترین خدمات جراحی چشم است.',
    about_stats_patients: '500',
    about_stats_doctors: '30',
    about_stats_satisfaction: '98',
    about_team_title: 'تیم ما',
    about_team_description: 'تیم متخصص و باتجربه دیدار چشم رهنما، آماده کمک به شما در مسیر سلامت چشم',
    about_contact_title: 'تماس با ما',
    about_contact_description: 'برای پاسخگویی به سوالات، دریافت مشاوره یا ارائه بازخورد، با ما در ارتباط باشید.',
    contact_phone: '021-12345678',
    contact_email: 'info@eyecare.ir',
    contact_address: 'تهران، خیابان ولیعصر'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'about_hero_title', 'about_hero_description', 'about_mission_title', 
          'about_mission_content', 'about_stats_patients', 'about_stats_doctors',
          'about_stats_satisfaction', 'about_team_title', 'about_team_description',
          'about_contact_title', 'about_contact_description', 'contact_phone',
          'contact_email', 'contact_address'
        ]);

      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        const settingsObj = data.reduce((acc, item) => {
          acc[item.key as keyof AboutSettings] = item.value;
          return acc;
        }, {} as Partial<AboutSettings>);

        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error) {
      console.error('Error loading about settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {settings.about_hero_title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {settings.about_hero_description}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {settings.about_mission_title}
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {settings.about_mission_content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">+{settings.about_stats_patients}</div>
              <div className="text-blue-100">بیمار موفق</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">+{settings.about_stats_doctors}</div>
              <div className="text-blue-100">پزشک همکار</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">{settings.about_stats_satisfaction}%</div>
              <div className="text-blue-100">رضایت بیماران</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {settings.about_team_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {settings.about_team_description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">تیم پزشکی</h3>
                <p className="text-gray-600">متخصصان مجرب با سال‌ها تجربه در حوزه چشم‌پزشکی</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">کیفیت بالا</h3>
                <p className="text-gray-600">ارائه خدمات با بالاترین استانداردهای کیفی</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">تکنولوژی مدرن</h3>
                <p className="text-gray-600">استفاده از جدیدترین تجهیزات و روش‌های درمانی</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {settings.about_contact_title}
            </h2>
            <p className="text-xl text-gray-600">
              {settings.about_contact_description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">تماس تلفنی</h3>
              <p className="text-gray-600">{settings.contact_phone}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ایمیل</h3>
              <p className="text-gray-600">{settings.contact_email}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">آدرس</h3>
              <p className="text-gray-600">{settings.contact_address}</p>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/consultation">درخواست مشاوره رایگان</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
