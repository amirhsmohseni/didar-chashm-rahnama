
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      console.log('Checking admin role for user:', user?.id);
      
      if (!user) {
        console.log('No user found, redirecting to auth');
        setCheckingRole(false);
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        console.log('Admin role check result:', { data, error });
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
          console.log('User is admin:', !!data);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };

    if (!isLoading) {
      checkAdminRole();
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (!isLoading && !checkingRole) {
      if (!user) {
        console.log('Redirecting to auth - no user');
        navigate('/auth');
      } else if (!isAdmin) {
        console.log('Redirecting to home - not admin');
        navigate('/');
      }
    }
  }, [user, isAdmin, isLoading, checkingRole, navigate]);

  if (isLoading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">در حال بررسی دسترسی...</p>
          <p className="mt-2 text-sm text-muted-foreground">
            کاربر: {user?.email || 'ناشناس'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">دسترسی محدود</h2>
          <p className="text-muted-foreground mb-4">
            شما به این بخش دسترسی ندارید.
          </p>
          <p className="text-sm text-muted-foreground">
            کاربر فعلی: {user.email}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
