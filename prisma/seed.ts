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
  let admin = await prisma.user.findFirst({
    where: { email: 'admin@gmail.com' },
    include: { Role: true },
  });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: await passwordService.hashPassword('admin123'),
        Role: { connect: { name: Roles.ADMIN } },
      },
      include: { Role: true },
    });
  }
  const userPermissions = await prisma.module.upsert({
    where: { name: 'User' },
    update: {
      permissions: {
        connectOrCreate: [
          {
            where: { key: 'user:create' },
            create: { action: 'CREATE', key: 'user:create' },
          },
          {
            where: { key: 'user:read' },
            create: { action: 'READ', key: 'user:read' },
          },
          {
            where: { key: 'user:update' },
            create: { action: 'UPDATE', key: 'user:update' },
          },
          {
            where: { key: 'user:delete' },
            create: { action: 'DELETE', key: 'user:delete' },
          },
        ],
      },
    },
    create: {
      name: 'User',
      permissions: {
        connectOrCreate: [
          {
            where: { key: 'user:create' },
            create: { action: 'CREATE', key: 'user:create' },
          },
          {
            where: { key: 'user:read' },
            create: { action: 'READ', key: 'user:read' },
          },
          {
            where: { key: 'user:update' },
            create: { action: 'UPDATE', key: 'user:update' },
          },
          {
            where: { key: 'user:delete' },
            create: { action: 'DELETE', key: 'user:delete' },
          },
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
  const adminRoleId = admin.Role?.find(
    (r) => r.name === (Roles.ADMIN as string),
  )?.id;
  if (adminRoleId) {
    await prisma.role.update({
      where: { name: Roles.ADMIN },
      data: {
        rolePermissions: {
          connectOrCreate: adminRolePermissions.map((rp) => ({
            where: {
              roleId_permissionId: {
                roleId: adminRoleId,
                permissionId: rp.permissionId,
              },
            },
            create: rp,
          })),
        },
      },
    });
  }

  //   create super admin user and assign permissions
  let superAdmin = await prisma.user.findFirst({
    where: { email: 'superadmin@vbaccounts.com' },
    include: { Role: true },
  });
  if (!superAdmin) {
    superAdmin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'superadmin@vbaccounts.com',
        password: await passwordService.hashPassword('superadmin123'),
        Role: { connect: { name: Roles.SUPER_ADMIN } },
      },
      include: { Role: true },
    });
  }
  const superAdminPermissions = await prisma.module.upsert({
    where: { name: 'Permissions' },
    update: {
      permissions: {
        connectOrCreate: [
          {
            where: { key: 'permission:read' },
            create: { action: 'READ', key: 'permission:read' },
          },
          {
            where: { key: 'permission:update' },
            create: { action: 'UPDATE', key: 'permission:update' },
          },
        ],
      },
    },
    create: {
      name: 'Permissions',
      permissions: {
        connectOrCreate: [
          {
            where: { key: 'permission:read' },
            create: { action: 'READ', key: 'permission:read' },
          },
          {
            where: { key: 'permission:update' },
            create: { action: 'UPDATE', key: 'permission:update' },
          },
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

  const superAdminRoleId = superAdmin.Role?.find(
    (r) => r.name === (Roles.SUPER_ADMIN as string),
  )?.id;
  if (superAdminRoleId) {
    await prisma.role.update({
      where: { name: Roles.SUPER_ADMIN },
      data: {
        rolePermissions: {
          connectOrCreate: superAdminRolePermissions.map((rp) => ({
            where: {
              roleId_permissionId: {
                roleId: superAdminRoleId,
                permissionId: rp.permissionId,
              },
            },
            create: rp,
          })),
        },
      },
    });
  }
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
