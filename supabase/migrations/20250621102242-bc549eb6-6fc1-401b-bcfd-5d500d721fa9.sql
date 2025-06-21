
-- بررسی و تنظیم سیاست‌های Row Level Security برای site_settings
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;

CREATE POLICY "Admins can manage site settings" ON public.site_settings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
  )
);

-- اضافه کردن سیاست‌های جداگانه برای عملیات مختلف
CREATE POLICY "Public can read site settings" ON public.site_settings
FOR SELECT USING (true);

CREATE POLICY "Admins can insert site settings" ON public.site_settings
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
  )
);

CREATE POLICY "Admins can update site settings" ON public.site_settings
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
  )
);

-- اطمینان از وجود تنظیمات پیش‌فرض
INSERT INTO public.site_settings (key, value, description) VALUES
('site_title', '"دیدار چشم رهنما"', 'عنوان اصلی سایت'),
('site_description', '"مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم"', 'توضیحات سایت'),
('hero_title', '"دیدار چشم رهنما"', 'عنوان بخش هیرو'),
('hero_description', '"مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران"', 'توضیحات بخش هیرو'),
('contact_phone', '"021-12345678"', 'شماره تماس'),
('contact_email', '"info@example.com"', 'ایمیل تماس'),
('contact_address', '"تهران، خیابان ولیعصر"', 'آدرس'),
('site_logo', '""', 'لوگوی سایت'),
('site_background', '""', 'تصویر پس‌زمینه')
ON CONFLICT (key) DO NOTHING;

-- بررسی عملکرد تابع log_admin_activity
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  action_name text,
  resource_type_name text,
  resource_id_value text DEFAULT NULL,
  details_data jsonb DEFAULT NULL,
  before_data_value jsonb DEFAULT NULL,
  after_data_value jsonb DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id uuid;
BEGIN
  -- اگر کاربر احراز هویت نشده باشد، خطا ندهیم
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;
  
  INSERT INTO public.admin_activity_logs (
    admin_id,
    action,
    resource_type,
    resource_id,
    details,
    before_data,
    after_data
  ) VALUES (
    auth.uid(),
    action_name,
    resource_type_name,
    resource_id_value,
    details_data,
    before_data_value,
    after_data_value
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
EXCEPTION
  WHEN OTHERS THEN
    -- در صورت خطا، NULL برگردان تا عملیات اصلی متوقف نشود
    RETURN NULL;
END;
$$;
