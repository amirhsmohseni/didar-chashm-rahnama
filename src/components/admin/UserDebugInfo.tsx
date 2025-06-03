
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const UserDebugInfo = () => {
  const { user, userRole } = useAuth();
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserRoles();
      fetchProfile();
    }
  }, [user]);

  const fetchUserRoles = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id);
    
    console.log('User roles:', data, error);
    setUserRoles(data || []);
  };

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    console.log('User profile:', data, error);
    setProfile(data);
  };

  const makeAdmin = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: user.id, role: 'admin' });
    
    if (error) {
      console.error('Error making admin:', error);
    } else {
      console.log('Successfully made admin');
      fetchUserRoles();
    }
  };

  if (!user) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>اطلاعات دیباگ کاربر</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>ID کاربر:</strong> {user.id}
        </div>
        <div>
          <strong>ایمیل:</strong> {user.email}
        </div>
        <div>
          <strong>نقش از useAuth:</strong> {userRole || 'هیچ نقشی'}
        </div>
        <div>
          <strong>نقش‌های موجود در دیتابیس:</strong>
          {userRoles.length > 0 ? (
            <ul>
              {userRoles.map((role, index) => (
                <li key={index}>- {role.role}</li>
              ))}
            </ul>
          ) : (
            <span> هیچ نقشی یافت نشد</span>
          )}
        </div>
        <div>
          <strong>پروفایل:</strong> {profile ? profile.full_name : 'پروفایل یافت نشد'}
        </div>
        {!userRoles.some(role => role.role === 'admin') && (
          <Button onClick={makeAdmin} variant="destructive">
            ایجاد دسترسی مدیر برای این کاربر
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDebugInfo;
