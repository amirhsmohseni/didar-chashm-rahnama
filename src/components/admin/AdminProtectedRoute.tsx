
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, UserCheck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, isLoading, isAdmin, userRole } = useAuth();
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
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">پنل مدیریت</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">شما وارد سیستم شده‌اید</span>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>کاربر فعلی:</strong> {user.email}</p>
                <p><strong>نقش فعلی:</strong> {userRole || 'کاربر عادی'}</p>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">نیاز به دسترسی ادمین</span>
                </div>
                <p className="text-xs text-yellow-700">
                  برای دسترسی به پنل مدیریت، نیاز به نقش "ادمین" دارید. 
                  می‌توانید از دکمه زیر برای خود نقش ادمین ایجاد کنید.
                </p>
              </div>
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
                variant="outline"
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
