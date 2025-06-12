
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        console.log('Redirecting to auth - no user');
        navigate('/auth');
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
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

  // همیشه children را بازگردان - AdminToolbox در داخل children است
  return <>{children}</>;
};

export default AdminProtectedRoute;
