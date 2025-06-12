
-- Add detailed content fields to services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS detailed_content text,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS featured_image text,
ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS reading_time integer DEFAULT 5;

-- Create FAQ table
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  is_published boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on FAQs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policy for FAQs (public can read published FAQs)
CREATE POLICY "Public can read published faqs" ON public.faqs
FOR SELECT USING (is_published = true);

-- Create policy for FAQs (admins can manage all)
CREATE POLICY "Admins can manage faqs" ON public.faqs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
  )
);

-- Create media items table for media center
CREATE TABLE IF NOT EXISTS public.media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('video', 'image', 'document')),
  file_url text NOT NULL,
  thumbnail_url text,
  category text DEFAULT 'general',
  duration text, -- for videos like "4:30"
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  order_index integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on media items
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Create policy for media items (public can read published items)
CREATE POLICY "Public can read published media" ON public.media_items
FOR SELECT USING (is_published = true);

-- Create policy for media items (admins can manage all)
CREATE POLICY "Admins can manage media" ON public.media_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
  )
);

-- Create testimonials table for patient experiences
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  patient_image text,
  procedure_type text NOT NULL,
  testimonial_text text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  before_image text,
  after_image text,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for testimonials (public can read published testimonials)
CREATE POLICY "Public can read published testimonials" ON public.testimonials
FOR SELECT USING (is_published = true);

-- Create policy for testimonials (admins can manage all)
CREATE POLICY "Admins can manage testimonials" ON public.testimonials
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
  )
);

-- Create pages table for managing static pages like About Us
CREATE TABLE IF NOT EXISTS public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  meta_title text,
  meta_description text,
  featured_image text,
  is_published boolean DEFAULT true,
  template text DEFAULT 'default',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on pages
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Create policy for pages (public can read published pages)
CREATE POLICY "Public can read published pages" ON public.pages
FOR SELECT USING (is_published = true);

-- Create policy for pages (admins can manage all)
CREATE POLICY "Admins can manage pages" ON public.pages
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager', 'editor')
  )
);

-- Insert default FAQ items
INSERT INTO public.faqs (question, answer, category, order_index) VALUES
('آیا جراحی لازیک دردناک است؟', 'جراحی لازیک به دلیل استفاده از قطره‌های بی‌حسی، تقریباً بدون درد است. ممکن است احساس فشار خفیف داشته باشید.', 'surgery', 1),
('چه مدت طول می‌کشد تا نتیجه جراحی کاملاً مشخص شود؟', 'نتایج اولیه معمولاً ظرف 24 ساعت قابل مشاهده است، اما نتیجه نهایی ممکن است تا 3-6 ماه طول بکشد.', 'surgery', 2),
('آیا بیمه جراحی لازیک را پوشش می‌دهد؟', 'بیشتر بیمه‌ها جراحی لازیک را به عنوان عمل زیبایی در نظر می‌گیرند و پوشش نمی‌دهند، اما بهتر است با بیمه خود مشورت کنید.', 'insurance', 3),
('چه کسانی کاندید مناسبی برای جراحی لازیک هستند؟', 'افراد بالای 18 سال با نمره چشم پایدار، بدون بیماری‌های خاص چشم و سیستم ایمنی سالم، کاندیدهای مناسبی هستند.', 'general', 4)
ON CONFLICT DO NOTHING;

-- Insert default media items
INSERT INTO public.media_items (title, description, type, file_url, thumbnail_url, category, duration) VALUES
('آموزش جراحی لازیک', 'توضیح کامل مراحل جراحی لازیک', 'video', '/placeholder-video.mp4', '/lovable-uploads/7183b3ed-c0ee-4bc5-8705-53224a422b78.png', 'educational', '4:30'),
('نتایج جراحی موفق', 'تصاویر قبل و بعد از جراحی', 'image', '/lovable-uploads/96386b66-70a1-44b5-a521-2e81071b8186.png', '/lovable-uploads/96386b66-70a1-44b5-a521-2e81071b8186.png', 'results', NULL)
ON CONFLICT DO NOTHING;

-- Insert default page for About Us
INSERT INTO public.pages (title, slug, content, excerpt, meta_title, meta_description) VALUES
('درباره ما', 'about', 
'<h2>درباره دیدار چشم رهنما</h2>
<p>دیدار چشم رهنما با هدف ارائه بهترین خدمات مشاوره و راهنمایی در زمینه جراحی‌های چشم تأسیس شده است. ما با داشتن تیمی مجرب از متخصصان چشم‌پزشکی، به متقاضیان جراحی کمک می‌کنیم تا بهترین تصمیم را برای سلامت چشم‌های خود بگیرند.</p>

<h3>ماموریت ما</h3>
<p>ارائه مشاوره رایگان و تخصصی به تمامی متقاضیان جراحی چشم و معرفی آن‌ها به برترین پزشکان متخصص کشور.</p>

<h3>خدمات ما</h3>
<ul>
<li>مشاوره رایگان و تخصصی</li>
<li>معرفی به بهترین پزشکان</li>
<li>پیگیری پس از جراحی</li>
<li>ارائه اطلاعات کامل درباره انواع جراحی‌ها</li>
</ul>', 
'دیدار چشم رهنما - مشاوره تخصصی جراحی چشم', 
'درباره ما', 
'اطلاعات کامل درباره دیدار چشم رهنما و خدمات مشاوره تخصصی جراحی چشم')
ON CONFLICT (slug) DO NOTHING;

-- Update services with detailed content and slugs
UPDATE public.services SET 
  detailed_content = CASE 
    WHEN title = 'جراحی لیزیک' THEN '<h2>جراحی لیزیک چیست؟</h2><p>جراحی لیزیک یکی از رایج‌ترین و موثرترین روش‌های تصحیح عیوب انکساری چشم است که با استفاده از لیزر، شکل قرنیه را تغییر می‌دهد...</p>'
    WHEN title = 'جراحی آب مروارید' THEN '<h2>جراحی آب مروارید</h2><p>آب مروارید یکی از شایع‌ترین بیماری‌های چشم است که با تیرگی عدسی طبیعی چشم مشخص می‌شود...</p>'
    ELSE detailed_content
  END,
  slug = CASE 
    WHEN title = 'جراحی لیزیک' THEN 'lasik-surgery'
    WHEN title = 'جراحی آب مروارید' THEN 'cataract-surgery'
    WHEN title = 'درمان شبکیه' THEN 'retina-treatment'
    WHEN title = 'جراحی پلک' THEN 'eyelid-surgery'
    ELSE LOWER(REPLACE(title, ' ', '-'))
  END,
  meta_title = title || ' - دیدار چشم رهنما',
  meta_description = description
WHERE detailed_content IS NULL OR slug IS NULL;
