
import { useState, useEffect } from 'react';
import { Crown, User, Stethoscope } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserProfile {
  id: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  role?: string;
}

const UserRolesManager = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, phone, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Then get user roles separately
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine the data
      const usersWithRoles = profiles?.map(profile => {
        const userRole = roles?.find(role => role.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || 'user'
        };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "خطا",
        description: "خطا در دریافت کاربران",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Type assertion to ensure newRole is one of the allowed enum values
      const roleValue = newRole as 'admin' | 'doctor' | 'user';
      
      // حذف نقش فعلی
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // اضافه کردن نقش جدید
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: roleValue });

      if (error) throw error;

      toast({
        title: "نقش بروزرسانی شد",
        description: "نقش کاربر با موفقیت تغییر کرد",
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی نقش",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'doctor':
        return <Stethoscope className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleMap = {
      admin: { label: 'مدیر', variant: 'destructive' as const },
      doctor: { label: 'پزشک', variant: 'default' as const },
      user: { label: 'کاربر', variant: 'secondary' as const },
    };
    
    const roleInfo = roleMap[role as keyof typeof roleMap] || roleMap.user;
    return (
      <Badge variant={roleInfo.variant} className="flex items-center gap-1">
        {getRoleIcon(role)}
        {roleInfo.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>مدیریت نقش‌های کاربری</CardTitle>
      </CardHeader>

      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            هیچ کاربری ثبت نشده است
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>شماره تماس</TableHead>
                <TableHead>نقش فعلی</TableHead>
                <TableHead>تاریخ ثبت‌نام</TableHead>
                <TableHead>تغییر نقش</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const currentRole = user.role || 'user';
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>{getRoleBadge(currentRole)}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <Select
                        value={currentRole}
                        onValueChange={(value) => updateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">کاربر</SelectItem>
                          <SelectItem value="doctor">پزشک</SelectItem>
                          <SelectItem value="admin">مدیر</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRolesManager;
