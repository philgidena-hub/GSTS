import { useAuthStore } from '../stores/authStore';
import { rolePermissions, type RolePermissions, type UserRole } from '../types';

export const usePermissions = (): RolePermissions & { role: UserRole | null; isSuperAdmin: boolean; isAdmin: boolean } => {
  const { user } = useAuthStore();

  const role = user?.role || null;
  const permissions = role ? rolePermissions[role] : rolePermissions.guest;

  return {
    ...permissions,
    role,
    isSuperAdmin: role === 'super_admin',
    isAdmin: role === 'admin' || role === 'super_admin',
  };
};

export const canAccessAdminPanel = (role: UserRole | undefined | null): boolean => {
  return role === 'super_admin' || role === 'admin';
};
