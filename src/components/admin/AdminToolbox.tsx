
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserCheck, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminToolbox = () => {
  const { user, userRole, isAdmin, refreshAuth } = useAuth();
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const { toast } = useToast();

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      toast({
        title: "خطا",
        description: "ابتدا وارد حساب کاربری خود شوید",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreatingAdmin(true);
    try {
      console.log('Making user admin:', user.id);
      
      // First try to delete any existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);
      
      // Then insert admin role
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'admin' })
        .select();
      
      console.log('Insert result:', { data, error });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      } else {
        toast({
          title: "✅ ادمین شدید!",
          description: "نقش ادمین با موفقیت برای شما تعیین شد. صفحه را رفرش کنید.",
        });
        
        // Refresh auth data
        await refreshAuth();
        
        // Reload the page to update the UI
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error making admin:', error);
      toast({
        title: "خطا",
        description: "خطا در تعیین نقش ادمین. لطفا دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  if (!user) {
    return (
      <Alert className="mb-6 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          لطفا ابتدا وارد حساب کاربری خود شوید.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-6 border-2 border-dashed border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Info className="h-5 w-5" />
          وضعیت دسترسی پنل مدیریت
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>
              <strong>وضعیت ورود:</strong>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-600">وارد شده</span>
              </div>
            </div>
            
            <div>
              <strong>ایمیل کاربر:</strong>
              <p className="mt-1 text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <strong>نقش فعلی:</strong>
              <div className="mt-1">
                {isAdmin ? (
                  <Badge variant="default" className="flex items-center gap-1 w-fit">
                    <Shield className="h-3 w-3" />
                    مدیر سیستم
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    <UserCheck className="h-3 w-3" />
                    {userRole || 'کاربر عادی'}
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <strong>دسترسی پنل:</strong>
              <div className="mt-1">
                {isAdmin ? (
                  <span className="text-green-600 text-sm">✅ دارای دسترسی</span>
                ) : (
                  <span className="text-red-600 text-sm">❌ فاقد دسترسی</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isAdmin && (
          <div className="border-t pt-4">
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>توجه:</strong> شما در حال حاضر دسترسی به پنل مدیریت ندارید. 
                برای دسترسی، نیاز به نقش "ادمین" دارید.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={makeCurrentUserAdmin} 
              disabled={isCreatingAdmin}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Shield className="h-4 w-4 mr-2" />
              {isCreatingAdmin ? 'در حال ایجاد دسترسی...' : 'ایجاد دسترسی مدیر برای من'}
            </Button>
            
            <p className="text-xs text-muted-foreground mt-2">
              این دکمه نقش ادمین را برای حساب فعلی شما تنظیم می‌کند
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="border-t pt-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>✅ شما دسترسی مدیر دارید!</strong>
                <br />
                می‌توانید از تمام قابلیت‌های پنل مدیریت استفاده کنید.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminToolbox;
