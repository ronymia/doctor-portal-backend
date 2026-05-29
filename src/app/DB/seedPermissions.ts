import { prisma } from '../../shared/prisma';
import { ALL_PERMISSIONS } from '../../enums/permission';
import { ENUM_USER_ROLE } from '../../enums/user';

export async function seedPermissions() {
  console.log('Seeding permissions...');
  for (const permissionName of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: permissionName },
      update: {},
      create: { name: permissionName },
    });
  }
  console.log('Permissions seeding complete.');

  // Find Super Admin and assign all permissions
  const superAdmin = await prisma.user.findFirst({
    where: {
      role: ENUM_USER_ROLE.SUPER_ADMIN,
    },
  });

  if (superAdmin) {
    console.log('Assigning all permissions to Super Admin...');
    const allPermsFromDB = await prisma.permission.findMany();
    
    // Perform sequential insert/upsert of permissions to prevent Supabase transaction timeouts
    for (const perm of allPermsFromDB) {
      await prisma.userPermission.upsert({
        where: {
          permissionId_userId: {
            permissionId: perm.id,
            userId: superAdmin.id,
          },
        },
        update: {},
        create: {
          permissionId: perm.id,
          userId: superAdmin.id,
        },
      });
    }
    console.log('All permissions assigned to Super Admin successfully.');
  }
}

export default seedPermissions;
