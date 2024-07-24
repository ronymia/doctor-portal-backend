import { User, PrismaClient } from "@prisma/client";
import { ENUM_USER_ROLE } from "../../../enums/user";

const prisma = new PrismaClient();

export const findLastAdminId = async () => {
  const lastAdminId = await prisma.user
    .findUnique({
      where: { user_id: ENUM_USER_ROLE.ADMIN },
      orderBy: { created_at: "dsc" },
      take: 1,
      select: { user_id: 1 },
    })
    .lean();

  return lastAdminId?.user_id ? lastAdminId?.user_id.subString(2) : undefined;
};

export const generateAdminId = async () => {
  const currentId =
    (await findLastAdminId()) || (0).toString().padStart(5, "0");
  let incrementedId = (Number(currentId) + 1).toString().padStart(5, "0");
  incrementedId = `A-${incrementedId}`;
  return incrementedId;
};
