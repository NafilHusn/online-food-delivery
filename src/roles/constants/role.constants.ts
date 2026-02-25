export type RoleNames = (typeof Roles)[keyof typeof Roles];

export enum Roles {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}
