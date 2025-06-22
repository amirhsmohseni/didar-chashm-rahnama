
-- حذف سیاست‌های قدیمی و ایجاد سیستم جدید برای تنظیمات
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;

-- حذف و ایجاد مجدد جدول site_settings با ساختار بهتر
DROP TABLE IF EXISTS public.site_settings CASCADE;

CREATE TABLE public.site_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value text NOT NULL DEFAULT '',
    category text NOT NULL DEFAULT 'general',
    type text NOT NULL DEFAULT 'text', -- text, textarea, boolean, number, image, color
    label text NOT NULL,
    description text,
    is_public boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    validation_rules jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

-- فعال‌سازی RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- سیاست‌های دسترسی
CREATE POLICY "Everyone can read public settings" ON public.site_settings
FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can read all settings" ON public.site_settings
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
    )
);

CREATE POLICY "Admins can insert settings" ON public.site_settings
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
    )
);

CREATE POLICY "Admins can update settings" ON public.site_settings
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
    )
);

CREATE POLICY "Admins can delete settings" ON public.site_settings
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
    )
);

-- درج تنظیمات پیش‌فرض
INSERT INTO public.site_settings (key, value, category, type, label, description, is_public, sort_order) VALUES
-- تنظیمات عمومی سایت
('site_title', 'دیدار چشم رهنما', 'general', 'text', 'عنوان سایت', 'عنوان اصلی سایت که در تب مرورگر نمایش داده می‌شود', true, 1),
('site_description', 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم', 'general', 'textarea', 'توضیحات سایت', 'توضیحات کوتاه درباره سایت برای SEO', true, 2),
('site_keywords', 'جراحی چشم، لیزیک، آب مروارید، قوز قرنیه', 'general', 'text', 'کلمات کلیدی', 'کلمات کلیدی برای SEO', true, 3),
('site_logo', '', 'general', 'image', 'لوگوی سایت', 'لوگوی اصلی سایت', true, 4),
('site_favicon', '', 'general', 'image', 'آیکون سایت', 'آیکون کوچک سایت (Favicon)', true, 5),

-- تنظیمات هدر
('header_background_color', '#ffffff', 'header', 'color', 'رنگ پس‌زمینه هدر', 'رنگ پس‌زمینه بخش هدر سایت', true, 10),
('header_text_color', '#000000', 'header', 'color', 'رنگ متن هدر', 'رنگ متن‌های هدر', true, 11),
('header_show_logo', 'true', 'header', 'boolean', 'نمایش لوگو', 'آیا لوگو در هدر نمایش داده شود؟', true, 12),
('header_sticky', 'true', 'header', 'boolean', 'هدر چسبنده', 'آیا هدر در بالای صفحه ثابت بماند؟', true, 13),

-- تنظیمات صفحه اصلی
('hero_title', 'دیدار چشم رهنما', 'homepage', 'text', 'عنوان اصلی', 'عنوان بخش هیرو صفحه اصلی', true, 20),
('hero_subtitle', 'مشاوره تخصصی و رایگان برای متقاضیان جراحی چشم', 'homepage', 'textarea', 'زیرعنوان', 'توضیحات بخش هیرو', true, 21),
('hero_background_image', '', 'homepage', 'image', 'تصویر پس‌زمینه هیرو', 'تصویر پس‌زمینه بخش هیرو', true, 22),
('hero_button_text', 'درخواست مشاوره', 'homepage', 'text', 'متن دکمه هیرو', 'متن دکمه اصلی بخش هیرو', true, 23),
('hero_button_link', '/consultation', 'homepage', 'text', 'لینک دکمه هیرو', 'لینک دکمه اصلی بخش هیرو', true, 24),

-- تنظیمات تماس
('contact_phone', '021-12345678', 'contact', 'text', 'شماره تماس', 'شماره تماس اصلی', true, 30),
('contact_email', 'info@example.com', 'contact', 'text', 'ایمیل', 'آدرس ایمیل اصلی', true, 31),
('contact_address', 'تهران، خیابان ولیعصر', 'contact', 'textarea', 'آدرس', 'آدرس فیزیکی', true, 32),
('contact_whatsapp', '', 'contact', 'text', 'واتساپ', 'شماره واتساپ', true, 33),
('contact_telegram', '', 'contact', 'text', 'تلگرام', 'آیدی تلگرام', true, 34),

-- تنظیمات شبکه‌های اجتماعی
('social_instagram', '', 'social', 'text', 'اینستاگرام', 'لینک صفحه اینستاگرام', true, 40),
('social_telegram', '', 'social', 'text', 'تلگرام', 'لینک کانال تلگرام', true, 41),
('social_whatsapp', '', 'social', 'text', 'واتساپ', 'شماره واتساپ', true, 42),
('social_linkedin', '', 'social', 'text', 'لینکدین', 'لینک صفحه لینکدین', true, 43),

-- تنظیمات SEO
('seo_meta_title', 'دیدار چشم رهنما - مشاوره تخصصی جراحی چشم', 'seo', 'text', 'عنوان متا', 'عنوان SEO صفحات', true, 50),
('seo_meta_description', 'مشاوره رایگان و تخصصی برای جراحی چشم، لیزیک و سایر عمل‌های چشم', 'seo', 'textarea', 'توضیحات متا', 'توضیحات SEO', true, 51),
('seo_og_image', '', 'seo', 'image', 'تصویر شبکه‌های اجتماعی', 'تصویر نمایش در شبکه‌های اجتماعی', true, 52),

-- تنظیمات ظاهری
('theme_primary_color', '#3b82f6', 'appearance', 'color', 'رنگ اصلی', 'رنگ اصلی قالب', true, 60),
('theme_secondary_color', '#64748b', 'appearance', 'color', 'رنگ ثانویه', 'رنگ ثانویه قالب', true, 61),
('theme_font_family', 'IranYekan', 'appearance', 'text', 'فونت', 'خانواده فونت اصلی', true, 62),
('theme_border_radius', '8', 'appearance', 'number', 'شعاع گردی', 'شعاع گردی عناصر (پیکسل)', true, 63),

-- تنظیمات سیستم
('system_maintenance_mode', 'false', 'system', 'boolean', 'حالت تعمیر', 'فعال‌سازی حالت تعمیرات سایت', false, 70),
('system_allow_registration', 'true', 'system', 'boolean', 'ثبت‌نام جدید', 'اجازه ثبت‌نام کاربران جدید', false, 71),
('system_email_notifications', 'true', 'system', 'boolean', 'اعلان‌های ایمیل', 'ارسال اعلان‌ها از طریق ایمیل', false, 72),
('system_backup_enabled', 'true', 'system', 'boolean', 'پشتیبان‌گیری خودکار', 'فعال‌سازی پشتیبان‌گیری خودکار', false, 73);

-- ایجاد تابع برای بروزرسانی timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ایجاد trigger برای بروزرسانی خودکار
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ایجاد index برای بهبود عملکرد
CREATE INDEX idx_site_settings_key ON public.site_settings(key);
CREATE INDEX idx_site_settings_category ON public.site_settings(category);
CREATE INDEX idx_site_settings_public ON public.site_settings(is_public);
