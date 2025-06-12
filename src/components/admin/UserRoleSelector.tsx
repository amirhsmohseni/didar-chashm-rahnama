
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, X } from 'lucide-react';

interface UserRole {
  id: string;
  role: string;
}

interface UserRoleSelectorProps {
  userId: string;
  currentRoles: UserRole[];
  onRolesChange: () => void;
}

const UserRoleSelector = ({ userId, currentRoles, onRolesChange }: UserRoleSelectorProps) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const availableRoles = [
    { value: 'admin', label: 'ادمین', color: 'destructive' },
    { value: 'manager', label: 'مدیر', color: 'default' },
    { value: 'editor', label: 'ادیتور', color: 'secondary' },
    { value: 'doctor', label: 'پزشک', color: 'default' },
    { value: 'viewer', label: 'بازدید کننده', color: 'outline' },
    { value: 'user', label: 'کاربر', color: 'outline' }
  ];

  const addRole = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: selectedRole }]);

      if (error) throw error;

      // Log activity
      await supabase.rpc('log_admin_activity', {
        action_name: 'add_role',
        resource_type_name: 'user_roles',
        resource_id_value: userId,
        details_data: { role: selectedRole }
      });

      toast({
        title: "نقش اضافه شد",
        description: `نقش ${availableRoles.find(r => r.value === selectedRole)?.label} برای کاربر اضافه شد`,
      });

      setSelectedRole('');
      onRolesChange();
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: "خطا",
        description: "خطا در افزودن نقش",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeRole = async (roleId: string, role: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      // Log activity
      await supabase.rpc('log_admin_activity', {
        action_name: 'remove_role',
        resource_type_name: 'user_roles',
        resource_id_value: userId,
        details_data: { role, role_id: roleId }
      });

      toast({
        title: "نقش حذف شد",
        description: `نقش ${availableRoles.find(r => r.value === role)?.label} از کاربر حذف شد`,
      });

      onRolesChange();
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف نقش",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string): any => {
    return availableRoles.find(r => r.value === role)?.color || 'outline';
  };

  const getRoleLabel = (role: string) => {
    return availableRoles.find(r => r.value === role)?.label || role;
  };

  const unassignedRoles = availableRoles.filter(
    role => !currentRoles.some(userRole => userRole.role === role.value)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {currentRoles.map((userRole) => (
          <Badge key={userRole.id} variant={getRoleColor(userRole.role)} className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {getRoleLabel(userRole.role)}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeRole(userRole.id, userRole.role)}
              disabled={isLoading}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      {unassignedRoles.length > 0 && (
        <div className="flex gap-2">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="انتخاب نقش" />
            </SelectTrigger>
            <SelectContent>
              {unassignedRoles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={addRole} 
            disabled={!selectedRole || isLoading}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            افزودن
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserRoleSelector;
