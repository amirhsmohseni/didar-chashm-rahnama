
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          toast({
            title: "خطای امنیتی",
            description: "خطا در بررسی جلسه کاربری",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        if (!session) {
          console.log('No active session found');
          toast({
            title: "دسترसی غیرمجاز",
            description: "برای دسترسی به پنل مدیریت باید وارد شوید",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        // Additional security: Check if session is expired
        const now = new Date().getTime() / 1000;
        if (session.expires_at && session.expires_at < now) {
          console.log('Session expired');
          await supabase.auth.signOut();
          toast({
            title: "جلسه منقضی شده",
            description: "جلسه شما منقضی شده است. لطفا دوباره وارد شوید",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        setSessionChecked(true);
      } catch (error) {
        console.error('Security check failed:', error);
        toast({
          title: "خطای امنیتی",
          description: "بررسی امنیتی با شکست مواجه شد",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    if (!isLoading) {
      checkSession();
    }
  }, [isLoading, navigate, toast]);

  useEffect(() => {
    if (sessionChecked && !isLoading) {
      if (!user) {
        console.log('Redirecting to auth - no user after session check');
        toast({
          title: "دسترسی مرفوض",
          description: "کاربر تایید نشده است",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      if (!isAdmin) {
        console.log('Redirecting to home - user is not admin');
        toast({
          title: "دسترسی مرفوض",
          description: "شما دسترسی به پنل مدیریت ندارید",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
    }
  }, [user, isAdmin, isLoading, sessionChecked, navigate, toast]);

  // Security audit logging
  useEffect(() => {
    if (user && isAdmin && sessionChecked) {
      const logAdminAccess = async () => {
        try {
          await supabase.rpc('log_admin_activity', {
            action_name: 'admin_panel_access',
            resource_type_name: 'admin_panel',
            details_data: { 
              access_time: new Date().toISOString(),
              user_agent: navigator.userAgent,
              ip_address: 'client_side' // Will be logged server-side in production
            }
          });
        } catch (error) {
          console.warn('Failed to log admin access:', error);
        }
      };
      
      logAdminAccess();
    }
  }, [user, isAdmin, sessionChecked]);

  if (isLoading || !sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">در حال بررسی دسترسی امنیتی...</p>
          <div className="mt-2 text-sm text-muted-foreground space-y-1">
            <p>مرحله 1: بررسی جلسه کاربری ✓</p>
            <p>مرحله 2: تایید هویت کاربر ✓</p>
            <p>مرحله 3: بررسی سطح دسترسی...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Redirect will happen in useEffect
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
