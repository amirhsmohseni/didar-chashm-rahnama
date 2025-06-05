
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'admin' })
        .select();
      
      console.log('Insert result:', { data, error });
      
      if (error) {
        if (error.code === '23505') {
          toast({
            title: "شما قبلاً ادمین هستید",
            description: "نقش ادمین برای شما تعیین شده است",
          });
        } else {
          console.error('Supabase error:', error);
          throw error;
        }
      } else {
        toast({
          title: "ادمین شدید!",
          description: "نقش ادمین با موفقیت برای شما تعیین شد.",
        });
        
        // Refresh auth data
        await refreshAuth();
      }
    } catch (error) {
      console.error('Error making admin:', error);
      toast({
        title: "خطا",
        description: "خطا در تعیین نقش ادمین",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <Card className="mb-6 border-2 border-dashed border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Info className="h-5 w-5" />
          ابزارهای توسعه‌دهنده
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>ID کاربر:</strong>
            <p className="text-xs font-mono mt-1 p-2 bg-white rounded border">
              {user?.id || 'ناشناس'}
            </p>
          </div>
          <div>
            <strong>ایمیل:</strong>
            <p className="mt-1">{user?.email || 'ناشناس'}</p>
          </div>
          <div>
            <strong>نقش فعلی:</strong>
            <div className="mt-1">
              {isAdmin ? (
                <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                  <Shield className="h-3 w-3" />
                  مدیر
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <UserCheck className="h-3 w-3" />
                  {userRole || 'کاربر'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {!isAdmin && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              برای دسترسی به پنل مدیریت، نیاز به نقش ادمین دارید:
            </p>
            <Button 
              onClick={makeCurrentUserAdmin} 
              disabled={isCreatingAdmin}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <Shield className="h-4 w-4 mr-2" />
              {isCreatingAdmin ? 'در حال ایجاد دسترسی...' : 'ایجاد دسترسی مدیر برای من'}
            </Button>
          </div>
        )}

        {isAdmin && (
          <div className="border-t pt-4">
            <p className="text-sm text-green-600 mb-2">
              ✅ شما دسترسی مدیر دارید
            </p>
            <p className="text-xs text-muted-foreground">
              حالا می‌توانید از تمام قابلیت‌های پنل مدیریت استفاده کنید.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminToolbox;
