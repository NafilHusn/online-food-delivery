import { Roles } from '../../roles/constants/role.constants';

export const CURRENT_PERMISSIONS = [
  {
    module: 'User',
    permissions: [
      {
        key: 'user:create',
        action: 'CREATE',
        assignedRoles: [Roles.ADMIN, Roles.SUPER_ADMIN],
      },
      {
        key: 'user:read',
        action: 'READ',
        assignedRoles: [Roles.ADMIN, Roles.SUPER_ADMIN],
      },
      {
        key: 'user:update',
        action: 'UPDATE',
        assignedRoles: [Roles.ADMIN, Roles.SUPER_ADMIN],
      },
      {
        key: 'user:delete',
        action: 'DELETE',
        assignedRoles: [Roles.ADMIN, Roles.SUPER_ADMIN],
      },
    ],
  },
];
