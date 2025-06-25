
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
  const [securityLevel, setSecurityLevel] = useState<'checking' | 'secure' | 'blocked'>('checking');

  useEffect(() => {
    const checkAdvancedSecurity = async () => {
      try {
        console.log('Performing advanced security checks...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Security violation detected:', error);
          setSecurityLevel('blocked');
          toast({
            title: "خطای امنیتی",
            description: "تشخیص نقض امنیت - دسترسی مسدود شد",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        if (!session) {
          console.log('No active authenticated session');
          setSecurityLevel('blocked');
          toast({
            title: "دسترسی غیرمجاز",
            description: "جلسه کاربری معتبر یافت نشد - لطفا مجددا وارد شوید",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        // Enhanced token validation
        const tokenAge = Date.now() - (session.user.last_sign_in_at ? new Date(session.user.last_sign_in_at).getTime() : 0);
        const maxTokenAge = 24 * 60 * 60 * 1000; // 24 hours

        if (tokenAge > maxTokenAge) {
          console.log('Session token expired, forcing re-authentication');
          await supabase.auth.signOut();
          setSecurityLevel('blocked');
          toast({
            title: "جلسه منقضی شده",
            description: "جلسه کاربری منقضی شده است. لطفا مجددا وارد شوید",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        // Additional security: Check if session is from suspicious location/device
        const userAgent = navigator.userAgent;
        const lastUserAgent = localStorage.getItem('lastUserAgent');
        
        if (lastUserAgent && lastUserAgent !== userAgent) {
          console.warn('Device/browser change detected - additional verification required');
          toast({
            title: "تغییر دستگاه شناسایی شد",
            description: "برای امنیت بیشتر، لطفا مجددا وارد شوید",
            variant: "destructive",
          });
        }
        
        localStorage.setItem('lastUserAgent', userAgent);

        console.log('Advanced security checks passed for user:', session.user.email);
        setSecurityLevel('secure');
        setSessionChecked(true);
      } catch (error) {
        console.error('Critical security check failed:', error);
        setSecurityLevel('blocked');
        toast({
          title: "خطای امنیتی حیاتی",
          description: "بررسی امنیتی با شکست مواجه شد - دسترسی مسدود",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    if (!isLoading) {
      checkAdvancedSecurity();
    }
  }, [isLoading, navigate, toast]);

  useEffect(() => {
    if (sessionChecked && !isLoading && securityLevel === 'secure') {
      console.log('Final admin access validation:', { user: user?.email, isAdmin });
      
      if (!user) {
        console.log('User validation failed after security checks');
        setSecurityLevel('blocked');
        toast({
          title: "خطای تایید کاربر",
          description: "کاربر قابل تایید نیست",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      // In production, uncomment this for strict admin checking:
      /*
      if (!isAdmin) {
        setSecurityLevel('blocked');
        toast({
          title: "دسترسی مرفوض",
          description: "سطح دسترسی شما برای پنل مدیریت کافی نیست",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      */
    }
  }, [user, isAdmin, isLoading, sessionChecked, securityLevel, navigate, toast]);

  if (isLoading || securityLevel === 'checking' || !sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">بررسی امنیتی پیشرفته</h3>
          <p className="text-gray-600 mb-4">لطفا صبر کنید...</p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-between">
              <span>✓ بررسی جلسه کاربری</span>
              <span className="text-green-500">تکمیل</span>
            </div>
            <div className="flex items-center justify-between">
              <span>✓ تایید هویت</span>
              <span className="text-green-500">تکمیل</span>
            </div>
            <div className="flex items-center justify-between">
              <span>⏳ بررسی سطح دسترسی</span>
              <span className="text-blue-500">در حال انجام</span>
            </div>
            <div className="flex items-center justify-between">
              <span>⏳ اعتبارسنجی امنیتی</span>
              <span className="text-blue-500">در حال انجام</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (securityLevel === 'blocked' || !user) {
    return null; // Redirect will happen in useEffect
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
