
-- Create storage bucket for blog media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-media',
  'blog-media',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for storage bucket
CREATE POLICY "Public read access for blog media" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-media');

CREATE POLICY "Authenticated users can upload blog media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'blog-media' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their uploaded blog media" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'blog-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their uploaded blog media" ON storage.objects
FOR DELETE USING (
  bucket_id = 'blog-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add SEO meta fields to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS meta_keywords text,
ADD COLUMN IF NOT EXISTS reading_time integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS featured_image_alt text;

-- Create categories table for better blog organization
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add category relationship to blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.blog_categories(id);

-- Insert default categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
('اخبار چشم‌پزشکی', 'eye-care-news', 'آخرین اخبار و پیشرفت‌های چشم‌پزشکی'),
('آموزش', 'education', 'مقالات آموزشی درباره مراقبت از چشم'),
('پیشگیری', 'prevention', 'راه‌های پیشگیری از بیماری‌های چشم'),
('درمان', 'treatment', 'روش‌های درمان بیماری‌های چشم')
ON CONFLICT (slug) DO NOTHING;

-- Create admin activity logs table
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) NOT NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_activity_logs
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin activity logs (only admins can view)
CREATE POLICY "Admins can view activity logs" ON public.admin_activity_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create policy for inserting activity logs
CREATE POLICY "Admins can insert activity logs" ON public.admin_activity_logs
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Add more detailed fields to consultation_requests
ALTER TABLE public.consultation_requests
ADD COLUMN IF NOT EXISTS urgency_level text DEFAULT 'normal' CHECK (urgency_level IN ('low', 'normal', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS preferred_contact_method text DEFAULT 'phone' CHECK (preferred_contact_method IN ('phone', 'email', 'both')),
ADD COLUMN IF NOT EXISTS medical_history text,
ADD COLUMN IF NOT EXISTS current_medications text,
ADD COLUMN IF NOT EXISTS assigned_admin_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS response_sent_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS follow_up_required boolean DEFAULT false;

-- Create notification system table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for notifications (users can only see their own)
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

-- Create policy for admins to create notifications
CREATE POLICY "Admins can create notifications" ON public.notifications
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Update consultation_requests policies for better admin access
DROP POLICY IF EXISTS "Enable read access for all users" ON public.consultation_requests;
CREATE POLICY "Admins can view all consultation requests" ON public.consultation_requests
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts (is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts (category_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON public.consultation_requests (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications (user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin ON public.admin_activity_logs (admin_id, created_at DESC);
