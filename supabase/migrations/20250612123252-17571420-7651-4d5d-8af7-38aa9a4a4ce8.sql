
-- Create site_settings table for managing site content
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for site_settings (admins only)
CREATE POLICY "Admins can manage site settings" ON public.site_settings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
('site_title', '"دیدار چشم رهنما"', 'عنوان اصلی سایت'),
('site_description', '"مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم"', 'توضیحات سایت'),
('hero_title', '"دیدار چشم رهنما"', 'عنوان بخش هیرو'),
('hero_description', '"مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم و معرفی به بهترین پزشکان متخصص ایران"', 'توضیحات بخش هیرو'),
('contact_phone', '"021-12345678"', 'شماره تماس'),
('contact_email', '"info@example.com"', 'ایمیل تماس'),
('contact_address', '"تهران، خیابان ولیعصر"', 'آدرس')
ON CONFLICT (key) DO NOTHING;

-- Create patient_reviews table
CREATE TABLE IF NOT EXISTS public.patient_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  patient_email text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  doctor_id uuid REFERENCES public.doctors(id),
  is_approved boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on patient_reviews
ALTER TABLE public.patient_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for patient_reviews (public can read approved reviews)
CREATE POLICY "Public can read approved reviews" ON public.patient_reviews
FOR SELECT USING (is_approved = true);

-- Create policy for patient_reviews (admins can manage all)
CREATE POLICY "Admins can manage reviews" ON public.patient_reviews
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
  )
);

-- Create policy for inserting reviews (anyone can submit)
CREATE POLICY "Anyone can submit reviews" ON public.patient_reviews
FOR INSERT WITH CHECK (true);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text, -- lucide icon name
  image_url text,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policy for services (public can read active services)
CREATE POLICY "Public can read active services" ON public.services
FOR SELECT USING (is_active = true);

-- Create policy for services (admins can manage all)
CREATE POLICY "Admins can manage services" ON public.services
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
  )
);

-- Insert default services
INSERT INTO public.services (title, description, icon, is_featured, order_index) VALUES
('جراحی لیزیک', 'تصحیح عیوب انکساری چشم با دستگاه‌های پیشرفته لیزر', 'Eye', true, 1),
('جراحی آب مروارید', 'درمان آب مروارید با جدیدترین روش‌های جراحی', 'Droplets', true, 2),
('درمان شبکیه', 'تشخیص و درمان بیماری‌های شبکیه توسط متخصصان', 'Camera', true, 3),
('جراحی پلک', 'زیبایی و درمان مشکلات پلک‌ها', 'User', false, 4)
ON CONFLICT DO NOTHING;

-- Update admin_activity_logs to track more details
ALTER TABLE public.admin_activity_logs
ADD COLUMN IF NOT EXISTS before_data jsonb,
ADD COLUMN IF NOT EXISTS after_data jsonb;

-- Create function to automatically log admin activities
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
END;
$$;

-- Add profile image field to doctors table
ALTER TABLE public.doctors
ADD COLUMN IF NOT EXISTS profile_description text,
ADD COLUMN IF NOT EXISTS consultation_fee integer,
ADD COLUMN IF NOT EXISTS available_days text[], -- ['monday', 'tuesday', ...]
ADD COLUMN IF NOT EXISTS available_hours text; -- '9:00-17:00'
