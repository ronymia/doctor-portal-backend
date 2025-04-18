// import { User, PrismaClient } from '@prisma/client';
// import { ENUM_USER_ROLE } from '../../../enums/user';

// const prisma = new PrismaClient();

// export const findLastAdminId = async () => {
//   const lastAdminId = await prisma.user.findFirst({
//     where: { role: ENUM_USER_ROLE.ADMIN },
//     orderBy: {
//       created_at: 'desc',
//     },
//     take: 1,
//   });

//   return lastAdminId?.id ? lastAdminId?.id.subString(2) : undefined;
// };

// export const generateAdminId = async () => {
//   const currentId =
//     (await findLastAdminId()) || (0).toString().padStart(5, '0');
//   let incrementedId = (Number(currentId) + 1).toString().padStart(5, '0');
//   incrementedId = `A-${incrementedId}`;
//   return incrementedId;
// };
