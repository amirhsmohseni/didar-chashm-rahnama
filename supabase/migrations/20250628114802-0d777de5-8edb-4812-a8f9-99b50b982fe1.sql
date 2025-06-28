
-- ایجاد bucket برای آپلود تصاویر سایت
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads', 
  true,
  5242880, -- 5MB حد مجاز
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ایجاد سیاست‌های دسترسی عمومی
CREATE POLICY "Public Access for uploads bucket" ON storage.objects
FOR ALL USING (bucket_id = 'uploads');

-- سیاست برای آپلود توسط کاربران احراز هویت شده
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- سیاست برای بروزرسانی توسط کاربران احراز هویت شده  
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- سیاست برای حذف توسط کاربران احراز هویت شده
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
