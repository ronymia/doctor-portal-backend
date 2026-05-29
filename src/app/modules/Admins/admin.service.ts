import { Admin, Prisma } from '../../../../generated/prisma';
import { prisma } from '../../../shared/prisma';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { TPaginationOptions } from '../../../interfaces/pagination';
import { TGenericResponse } from '../../../interfaces/response';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';

const getAllAdminsFromDB = async (
  filters: any,
  paginationOptions: TPaginationOptions,
): Promise<TGenericResponse<Admin[]>> => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          user: {
            email: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            phoneNumber: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            profile: {
              fullName: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition: Prisma.AdminWhereInput = andConditions.length
    ? { AND: andConditions as any }
    : {};

  const result = await prisma.admin.findMany({
    skip,
    take: limit,
    orderBy: {
      user: {
        createdAt: sortOrder as Prisma.SortOrder,
      },
    },
    where: whereCondition,
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  const total = await prisma.admin.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAdminByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });
  return result;
};

const updateAdminIntoDB = async (id: string, payload: any): Promise<Admin | null> => {
  const admin = await prisma.admin.findUnique({
    where: { id },
  });
  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  const { profile, phoneNumber, email, ...adminData } = payload;

  const result = await prisma.$transaction(async (tx) => {
    // Update admin core data if any
    if (Object.keys(adminData).length > 0) {
      await tx.admin.update({
        where: { id },
        data: adminData,
      });
    }

    // Update user phone / email
    const userData: any = {};
    if (phoneNumber) userData.phoneNumber = phoneNumber;
    if (email) userData.email = email;

    if (Object.keys(userData).length > 0) {
      await tx.user.update({
        where: { id: admin.userId },
        data: userData,
      });
    }

    // Update profile
    if (profile) {
      await tx.profile.update({
        where: { userId: admin.userId },
        data: profile,
      });
    }

    return await tx.admin.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  });

  return result;
};

const deleteAdminFromDB = async (id: string): Promise<Admin | null> => {
  const admin = await prisma.admin.findUnique({
    where: { id },
  });
  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  const result = await prisma.$transaction(async (tx) => {
    // Delete Admin relation
    const deletedAdmin = await tx.admin.delete({
      where: { id },
    });

    // Delete Profile relation
    await tx.profile.delete({
      where: { userId: admin.userId },
    });

    // Delete UserPermissions relations
    await tx.userPermission.deleteMany({
      where: { userId: admin.userId },
    });

    // Delete User core account
    await tx.user.delete({
      where: { id: admin.userId },
    });

    return deletedAdmin;
  });

  return result;
};

export const AdminServices = {
  getAllAdminsFromDB,
  getAdminByIdFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
