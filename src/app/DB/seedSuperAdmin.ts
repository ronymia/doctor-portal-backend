import { UserAccountStatus } from '../../../generated/prisma';
import config from '../../config';
import { ENUM_USER_ROLE } from '../../enums/user';
import { PasswordHelpers } from '../../helpers/passwordHelpers';
import { prisma } from '../../shared/prisma';
import seedPermissions from './seedPermissions';

async function seedSuperAdmin() {
  //
  const superAdminData = {
    // id: ENUM_USER_ROLE.SUPER_ADMIN,
    email: 'mdronymia040@gmail.com',
    password: await PasswordHelpers.passwordHash(config.default_admin_pass),
    role: ENUM_USER_ROLE.SUPER_ADMIN,
    phoneNumber: '01321185989',
    isPasswordResetRequired: false,
    status: UserAccountStatus.ACTIVE,
  };

  // CHECK SUPER ADMIN
  const superAdmin = await prisma.user.findFirst({
    where: {
      role: ENUM_USER_ROLE.SUPER_ADMIN,
    },
  });

  // IF NOT THEN CREATE
  if (!superAdmin) {
    await prisma.user.create({
      data: superAdminData,
    });
  }

  // Call permissions seeder to ensure all system perms are created & associated
  await seedPermissions();
}

export default seedSuperAdmin;
