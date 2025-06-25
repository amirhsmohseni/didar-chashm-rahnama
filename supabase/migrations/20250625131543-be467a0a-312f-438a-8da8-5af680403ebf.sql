
-- Add price column to services table
ALTER TABLE public.services 
ADD COLUMN price integer DEFAULT NULL;
