
-- بررسی و ایجاد جدول تنظیمات سایت (اگر وجود ندارد)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- اضافه کردن تنظیمات پیش‌فرض
INSERT INTO public.site_settings (key, value, description) VALUES
  ('site_title', '"دیدار چشم رهنما"', 'عنوان سایت'),
  ('site_description', '"مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم"', 'توضیحات سایت'),
  ('hero_title', '"دیدار چشم رهنما"', 'عنوان صفحه اصلی'),
  ('hero_description', '"مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران"', 'توضیحات صفحه اصلی'),
  ('contact_phone', '"021-12345678"', 'شماره تماس'),
  ('contact_email', '"info@clinic.com"', 'ایمیل تماس'),
  ('contact_address', '"تهران، خیابان ولیعصر"', 'آدرس'),
  ('site_logo', '""', 'لوگوی سایت'),
  ('site_background', '""', 'تصویر پس‌زمینه')
ON CONFLICT (key) DO NOTHING;

-- فعال کردن Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- حذف پالیسی‌های قبلی در صورت وجود
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Only admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Only admins can insert site settings" ON public.site_settings;

-- ایجاد پالیسی برای خواندن تنظیمات (همه کاربران)
CREATE POLICY "Anyone can read site settings" 
ON public.site_settings FOR SELECT 
TO public 
USING (true);

-- ایجاد پالیسی برای بروزرسانی تنظیمات (فقط ادمین‌ها)
CREATE POLICY "Only admins can update site settings" 
ON public.site_settings FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ایجاد پالیسی برای اضافه کردن تنظیمات (فقط ادمین‌ها)
CREATE POLICY "Only admins can insert site settings" 
ON public.site_settings FOR INSERT 
TO authenticated 
WITH CHECK (public.has_role(auth.uid(), 'admin'));
