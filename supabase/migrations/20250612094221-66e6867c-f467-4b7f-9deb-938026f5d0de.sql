
-- Create a storage bucket for blog media files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-media', 'blog-media', true);

-- Create RLS policies for the blog-media bucket
CREATE POLICY "Anyone can view blog media files" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'blog-media');

CREATE POLICY "Authenticated users can upload blog media files" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'blog-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their blog media files" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'blog-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog media files" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'blog-media' AND auth.role() = 'authenticated');
