-- Fix database issues and add missing constraints

-- First, let's check if there are any missing tables or columns
-- Fix any potential issues with foreign key constraints

-- Update user_roles table to have proper constraints
ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update profiles table to have proper constraints  
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update consultation_requests foreign key if needed
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'consultation_requests_doctor_id_fkey'
    ) THEN
        ALTER TABLE public.consultation_requests 
        ADD CONSTRAINT consultation_requests_doctor_id_fkey 
        FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Update patient_reviews foreign key if needed
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'patient_reviews_doctor_id_fkey'
    ) THEN
        ALTER TABLE public.patient_reviews 
        ADD CONSTRAINT patient_reviews_doctor_id_fkey 
        FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Update withdrawal_fees foreign key if needed
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'withdrawal_fees_exchange_id_fkey'
    ) THEN
        ALTER TABLE public.withdrawal_fees 
        ADD CONSTRAINT withdrawal_fees_exchange_id_fkey 
        FOREIGN KEY (exchange_id) REFERENCES public.exchanges(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add updated_at triggers for tables that are missing them
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for tables that don't have them
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_site_settings_updated_at') THEN
        CREATE TRIGGER update_site_settings_updated_at
            BEFORE UPDATE ON public.site_settings
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_services_updated_at') THEN
        CREATE TRIGGER update_services_updated_at
            BEFORE UPDATE ON public.services
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_doctors_updated_at') THEN
        CREATE TRIGGER update_doctors_updated_at
            BEFORE UPDATE ON public.doctors
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END
$$;