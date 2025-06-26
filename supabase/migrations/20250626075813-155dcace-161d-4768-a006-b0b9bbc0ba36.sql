
-- اضافه کردن تنظیمات درباره ما فقط در صورت عدم وجود
INSERT INTO public.site_settings (key, label, value, category, type, description, is_public, sort_order) VALUES
('about_hero_title', 'عنوان اصلی درباره ما', 'درباره دیدار چشم رهنما', 'about', 'text', 'عنوان اصلی صفحه درباره ما', true, 1),
('about_hero_description', 'توضیحات اصلی درباره ما', 'ما بیماران را به بهترین جراحان چشم ایران متصل می‌کنیم و در تمام مراحل درمان کنار شما هستیم.', 'about', 'textarea', 'توضیحات اصلی زیر عنوان', true, 2),
('about_mission_title', 'عنوان ماموریت', 'ماموریت ما', 'about', 'text', 'عنوان بخش ماموریت', true, 3),
('about_mission_content', 'محتوای ماموریت', 'ماموریت ما در دیدار چشم رهنما، کمک به بیماران برای دریافت بهترین خدمات جراحی چشم است. ما معتقدیم که هر فرد باید به بهترین متخصصان دسترسی داشته باشد، بدون اینکه نگران یافتن پزشک مناسب باشد.', 'about', 'textarea', 'محتوای بخش ماموریت', true, 4),
('about_stats_patients', 'تعداد بیماران موفق', '500', 'about', 'number', 'تعداد بیماران موفق', true, 5),
('about_stats_doctors', 'تعداد پزشکان همکار', '30', 'about', 'number', 'تعداد پزشکان همکار', true, 6),
('about_stats_satisfaction', 'درصد رضایت بیماران', '98', 'about', 'number', 'درصد رضایت بیماران', true, 7),
('about_team_title', 'عنوان بخش تیم', 'تیم ما', 'about', 'text', 'عنوان بخش تیم', true, 8),
('about_team_description', 'توضیحات بخش تیم', 'تیم متخصص و باتجربه دیدار چشم رهنما، آماده کمک به شما در مسیر سلامت چشم', 'about', 'textarea', 'توضیحات بخش تیم', true, 9),
('about_contact_title', 'عنوان بخش تماس', 'تماس با ما', 'about', 'text', 'عنوان بخش تماس در صفحه درباره ما', true, 10),
('about_contact_description', 'توضیحات بخش تماس', 'برای پاسخگویی به سوالات، دریافت مشاوره یا ارائه بازخورد، با ما در ارتباط باشید.', 'about', 'textarea', 'توضیحات بخش تماس در صفحه درباره ما', true, 11)
ON CONFLICT (key) DO NOTHING;

-- اضافه کردن تنظیمات تم فقط در صورت عدم وجود
INSERT INTO public.site_settings (key, label, value, category, type, description, is_public, sort_order) VALUES
('theme_primary_color', 'رنگ اصلی سایت', '#0ea5e9', 'theme', 'color', 'رنگ اصلی سایت', true, 1),
('theme_secondary_color', 'رنگ ثانویه سایت', '#0284c7', 'theme', 'color', 'رنگ ثانویه سایت', true, 2),
('theme_accent_color', 'رنگ لهجه‌ای سایت', '#06b6d4', 'theme', 'color', 'رنگ لهجه‌ای سایت', true, 3),
('theme_background_color', 'رنگ پس‌زمینه سایت', '#f8fafc', 'theme', 'color', 'رنگ پس‌زمینه سایت', true, 4),
('theme_text_primary', 'رنگ متن اصلی', '#1f2937', 'theme', 'color', 'رنگ متن اصلی', true, 5),
('theme_text_secondary', 'رنگ متن ثانویه', '#6b7280', 'theme', 'color', 'رنگ متن ثانویه', true, 6)
ON CONFLICT (key) DO NOTHING;

-- بروزرسانی تنظیمات تماس در صورت وجود
UPDATE public.site_settings SET 
  value = CASE 
    WHEN key = 'contact_phone' AND value = '' THEN '021-12345678'
    WHEN key = 'contact_email' AND value = '' THEN 'info@eyecare.ir'
    ELSE value
  END
WHERE key IN ('contact_phone', 'contact_email');
