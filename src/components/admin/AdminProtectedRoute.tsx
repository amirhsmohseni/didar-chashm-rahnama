
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl">دسترسی محدود</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              شما به این بخش دسترسی ندارید. برای دسترسی به پنل مدیریت نیاز به نقش ادمین دارید.
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>کاربر فعلی: {user.email}</p>
              <p>نقش شما: کاربر عادی</p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
              >
                بازگشت به خانه
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                variant="default"
              >
                تغییر حساب
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
