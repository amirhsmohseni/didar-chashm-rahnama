
-- Create the slider_images table
CREATE TABLE public.slider_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.slider_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for the slider display)
CREATE POLICY "Allow public read access to active slider images"
  ON public.slider_images
  FOR SELECT
  USING (is_active = true);

-- Create policies for admin management
CREATE POLICY "Allow admin full access to slider images"
  ON public.slider_images
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create index for better performance
CREATE INDEX idx_slider_images_active_order ON public.slider_images (is_active, order_index);
CREATE INDEX idx_slider_images_order ON public.slider_images (order_index);
