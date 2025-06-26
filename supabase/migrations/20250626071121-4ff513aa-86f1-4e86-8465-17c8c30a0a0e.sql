
-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-files',
  'media-files',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- Create storage policies for media files
CREATE POLICY "Allow public read access to media files"
ON storage.objects FOR SELECT
USING (bucket_id = 'media-files');

CREATE POLICY "Allow authenticated users to upload media files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media-files');

CREATE POLICY "Allow authenticated users to update their media files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media-files');

CREATE POLICY "Allow authenticated users to delete their media files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media-files');

-- Update HeroSlider component to use slides from database
ALTER TABLE slider_images 
ADD COLUMN IF NOT EXISTS subtitle TEXT,
ADD COLUMN IF NOT EXISTS cta_text TEXT DEFAULT 'مشاهده بیشتر',
ADD COLUMN IF NOT EXISTS cta_link TEXT DEFAULT '/services';

-- Insert default slides if table is empty
INSERT INTO slider_images (title, subtitle, description, image_url, alt_text, cta_text, cta_link, order_index)
SELECT 
  'مرکز تخصصی چشم‌پزشکی' as title,
  'بهترین خدمات چشم‌پزشکی' as subtitle,
  'با بهره‌گیری از جدیدترین تکنولوژی‌ها و متخصصین مجرب' as description,
  '/lovable-uploads/2044c494-74f5-42c3-9979-6effb4059825.png' as image_url,
  'مرکز چشم‌پزشکی' as alt_text,
  'رزرو نوبت' as cta_text,
  '/consultation' as cta_link,
  1 as order_index
WHERE NOT EXISTS (SELECT 1 FROM slider_images LIMIT 1);

INSERT INTO slider_images (title, subtitle, description, image_url, alt_text, cta_text, cta_link, order_index)
SELECT 
  'جراحی لیزیک پیشرفته' as title,
  'آزادی از عینک و لنز' as subtitle,
  'با استفاده از دستگاه‌های مدرن و تکنیک‌های روز دنیا' as description,
  '/lovable-uploads/3bf77a26-5255-49db-ae88-bf1a5d13339c.png' as image_url,
  'جراحی لیزیک' as alt_text,
  'مشاوره رایگان' as cta_text,
  '/consultation' as cta_link,
  2 as order_index
WHERE (SELECT COUNT(*) FROM slider_images) = 1;

INSERT INTO slider_images (title, subtitle, description, image_url, alt_text, cta_text, cta_link, order_index)
SELECT 
  'درمان آب مروارید' as title,
  'بازگرداندن وضوح بینایی' as subtitle,
  'با روش‌های مدرن و بدون درد' as description,
  '/lovable-uploads/56cc2662-9b74-49e6-b2e9-3c799a4ba344.png' as image_url,
  'درمان آب مروارید' as alt_text,
  'اطلاعات بیشتر' as cta_text,
  '/services' as cta_link,
  3 as order_index
WHERE (SELECT COUNT(*) FROM slider_images) = 2;
