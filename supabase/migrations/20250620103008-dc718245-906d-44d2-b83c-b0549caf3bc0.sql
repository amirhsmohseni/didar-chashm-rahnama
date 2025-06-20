
-- Create site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid
);

-- Insert default site settings
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

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading site settings for everyone
CREATE POLICY "Allow public read access to site settings" ON public.site_settings
  FOR SELECT USING (true);

-- Create policy to allow admins to update site settings
CREATE POLICY "Allow admins to update site settings" ON public.site_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
