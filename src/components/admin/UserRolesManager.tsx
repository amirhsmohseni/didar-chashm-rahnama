
import { useState, useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserRoleSelector from './UserRoleSelector';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  roles: Array<{
    id: string;
    role: string;
  }>;
}

const UserRolesManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      // Get users from auth.users via profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Get user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles = profiles?.map(profile => ({
        id: profile.id,
        email: '', // We can't access auth.users directly, so email will be empty
        full_name: profile.full_name,
        phone: profile.phone,
        created_at: profile.created_at,
        roles: roles?.filter(role => role.user_id === profile.id) || []
      })) || [];

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
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          مدیریت کاربران و نقش‌ها
        </CardTitle>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="جستجو بر اساس نام یا ایمیل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>

      <CardContent>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'کاربری یافت نشد' : 'هیچ کاربری ثبت نشده است'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام کامل</TableHead>
                <TableHead>شماره تماس</TableHead>
                <TableHead>نقش‌ها</TableHead>
                <TableHead>تاریخ عضویت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.phone || 'وارد نشده'}</TableCell>
                  <TableCell>
                    <UserRoleSelector 
                      userId={user.id}
                      currentRoles={user.roles}
                      onRolesChange={fetchUsers}
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRolesManager;
