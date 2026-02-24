export type RoleNames = 'ADMIN' | 'STAFF' | 'CLIENT';

export const RoleNamesObj: { [K in RoleNames]: K } = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CLIENT: 'CLIENT',
};
