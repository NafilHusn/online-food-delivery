// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { Roles } from '../src/roles/constants/role.constants';
import { PasswordService } from '../utils/passwords.service';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});
const passwordService = new PasswordService();

async function main() {
  await prisma.role.createMany({
    data: Object.values(Roles).map((role) => ({ name: role })),
    skipDuplicates: true,
  });

  //   create admin user and assign permissions
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: await passwordService.hashPassword('admin123'),
      Role: { connect: { name: Roles.ADMIN } },
    },
  });
  const userPermissions = await prisma.module.create({
    data: {
      name: 'User',
      permissions: {
        create: [
          { action: 'CREATE', key: 'user:create' },
          { action: 'READ', key: 'user:read' },
          { action: 'UPDATE', key: 'user:update' },
          { action: 'DELETE', key: 'user:delete' },
        ],
      },
    },
    include: { permissions: true },
  });

  const adminRolePermissions = userPermissions.permissions.map(
    (permission) => ({
      permissionId: permission.id,
      moduleId: userPermissions.id,
    }),
  );

  await prisma.role.update({
    where: { name: Roles.ADMIN },
    data: {
      rolePermissions: {
        create: adminRolePermissions,
      },
    },
  });

  //   create super admin user and assign permissions
  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'superadmin@vbaccounts.com',
      password: await passwordService.hashPassword('superadmin123'),
      Role: { connect: { name: Roles.SUPER_ADMIN } },
    },
  });
  const superAdminPermissions = await prisma.module.create({
    data: {
      name: 'Permissions',
      permissions: {
        create: [
          { action: 'READ', key: 'permission:read' },
          { action: 'UPDATE', key: 'permission:update' },
        ],
      },
    },
    include: { permissions: true },
  });

  const superAdminRolePermissions = superAdminPermissions.permissions.map(
    (permission) => ({
      permissionId: permission.id,
      moduleId: superAdminPermissions.id,
    }),
  );

  await prisma.role.update({
    where: { name: Roles.SUPER_ADMIN },
    data: {
      rolePermissions: {
        create: [...adminRolePermissions, ...superAdminRolePermissions],
      },
    },
  });
  console.log('🌱 Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
