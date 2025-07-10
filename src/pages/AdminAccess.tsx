
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminAccess = () => {
  const navigate = useNavigate();
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    // Simple access check - in production this should be more secure
    const hasAccess = localStorage.getItem('admin_access') === 'granted';
    if (hasAccess) {
      setAccessGranted(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    }
  }, [navigate]);

  const grantAccess = () => {
    localStorage.setItem('admin_access', 'granted');
    setAccessGranted(true);
    setTimeout(() => {
      navigate('/admin');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">دسترسی پنل مدیریت</CardTitle>
            <CardDescription className="text-gray-600">
              {accessGranted ? 'دسترسی تأیید شد، در حال انتقال...' : 'برای دسترسی به پنل مدیریت کلیک کنید'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!accessGranted ? (
              <>
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <User className="h-5 w-5" />
                    <span>مدیر سیستم</span>
                  </div>
                  
                  <Button 
                    onClick={grantAccess}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      ورود به پنل مدیریت
                    </div>
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    این صفحه فقط برای تست دسترسی است
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                <p className="text-green-600 font-medium">در حال انتقال به پنل مدیریت...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAccess;
