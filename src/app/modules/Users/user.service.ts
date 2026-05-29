import httpStatus from 'http-status';
import { Gender, Prisma, User, UserRole } from '../../../../generated/prisma';
import { ENUM_USER_ROLE } from '../../../enums/user';
import AppError from '../../../errors/AppError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { TPaginationOptions } from '../../../interfaces/pagination';
import { TGenericResponse } from '../../../interfaces/response';
import { logger } from '../../../shared/logger';
import { prisma } from '../../../shared/prisma';
import { userSearchableFields } from './user.constant';
import {
  IAdminCreate,
  IDoctorCreate,
  IPatientCreate,
  TUserFilterRequest,
} from './user.interface';
import {
  generateAdminId,
  generateDoctorId,
  generatePatientId,
} from './user.utils';

//INSERT TO DATABASE
const createAdminIntoDB = async (
  payload: IAdminCreate,
): Promise<Partial<User>> => {
  const { profile } = payload;

  // Use a partial object here, don't force it to be of type `User`
  const result = await prisma.$transaction(async (transactionClient) => {
    // CREATE USER
    const newUser = await transactionClient.user.create({
      data: {
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: payload?.password as string,
        role: ENUM_USER_ROLE.ADMIN as UserRole,
      },
    });

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin');
    }

    // Remove password from the response
    if ('password' in newUser) {
      delete (newUser as Partial<User>).password;
    }

    const adminId = await generateAdminId();
    // CREATE ADMIN
    await transactionClient.admin.create({
      data: {
        adminId,
        userId: newUser.id,
      },
    });

    // CREATE PROFILE
    if (!Object.values(Gender).includes(profile.gender as Gender)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid gender value, allowed only [${Object.values(Gender).join(',')}]`,
      );
    }
    const newProfile = await transactionClient.profile.create({
      data: {
        ...profile,
        userId: newUser.id,
      },
    });

    if (!newProfile) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    return { ...newUser, ...newProfile };
  });

  return result;
};

//INSERT TO DATABASE
const createDoctorIntoDB = async (payload: IDoctorCreate): Promise<User> => {
  const { doctor, profile, ...user } = payload;
  // SET ROLE
  (user as any).role = ENUM_USER_ROLE.DOCTOR as UserRole;

  //DEFINE USER
  const result = await prisma.$transaction(async (transactionClient) => {
    // AUTO INCREMENTED GENERATED DOCTOR ID
    // const doctorId = await generateDoctorId();
    // console.log({ doctorId });

    //CREATE USER
    const newUser = await transactionClient.user.create({
      data: user as User,
    });

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Doctor');
    }

    // CREATE DOCTOR
    doctor.userId = newUser.id;
    const doctorId = await generateDoctorId();
    const newDoctor = await transactionClient.doctor.create({
      data: { doctorId, ...doctor },
    });
    if (!newDoctor) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Doctor');
    }

    //CREATE PROFILE
    profile.userId = newUser.id;
    const newProfile = await transactionClient.profile.create({
      data: profile,
    });
    if (!newProfile) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Doctor');
    }
    // Remove password from the response
    if ('password' in newUser) {
      // Remove password from the response
      delete (newUser as Partial<User>)?.password;
    }

    return { ...newUser, ...newProfile, ...newDoctor };
  });

  return result;
};
//INSERT TO DATABASE
const createPatientIntoDB = async (payload: IPatientCreate): Promise<User> => {
  // SET ROLE
  const { profile, patient, ...user } = payload;

  const result = await prisma.$transaction(async (transactionClient) => {
    // CREATE USER
    const newUser = await transactionClient.user.create({
      data: { ...user, role: ENUM_USER_ROLE.PATIENT as UserRole } as User,
    });
    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Patient');
    }

    // CREATE PATIENT
    patient.userId = newUser.id;
    const patientId = await generatePatientId();
    const newPatient = await transactionClient.patient.create({
      data: { patientId, ...patient },
    });
    if (!newPatient) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Patient');
    }

    //CREATE PROFILE
    profile.userId = newUser.id;
    const newProfile = await transactionClient.profile.create({
      data: profile,
    });
    if (!newProfile) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Patient');
    }
    // Remove password from the response
    if ('password' in newUser) {
      // Remove password from the response
      delete (newUser as Partial<User>)?.password;
    }
    return { ...newUser, ...newProfile, ...newPatient };
  });

  logger.info(result);
  return result;
};

// GET ALL USERS FROM DATABASE
const getAllUsersFromDB = async (
  filters: TUserFilterRequest,
  paginationOptions: TPaginationOptions,
): Promise<TGenericResponse<User[]>> => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract SearchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  // Search and filter condition
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // field Filtering
  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  // If there is no condition , put {} to give all data
  const whereCondition: Prisma.UserWhereInput = andConditions.length
    ? { AND: andConditions }
    : {
        role: {
          not: ENUM_USER_ROLE.SUPER_ADMIN, // Exclude super admin
        },
      };

  const users = limit
    ? await prisma.user.findMany({
        take: limit,
        skip,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          doctor: filters?.role === ENUM_USER_ROLE.DOCTOR ? true : false,
          patient: filters?.role === ENUM_USER_ROLE.PATIENT ? true : false,
          admin: filters?.role === ENUM_USER_ROLE.ADMIN ? true : false,
          profile: true,
        },
        where: whereCondition,
      })
    : await prisma.user.findMany({
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          doctor: filters?.role === ENUM_USER_ROLE.DOCTOR ? true : false,
          patient: filters?.role === ENUM_USER_ROLE.PATIENT ? true : false,
          admin: filters?.role === ENUM_USER_ROLE.ADMIN ? true : false,
          profile: true,
        },
        where: whereCondition,
      });

  users.forEach((user) => {
    if ('password' in user) {
      delete (user as Partial<User>)?.password;
    }
  });

  // total count
  const totalCount = await prisma.user.count({
    where: whereCondition,
  });
  const totalPage = limit ? Math.ceil(totalCount / limit) : 1;

  return {
    meta: {
      page,
      limit,
      total: totalCount,
      totalPage,
    },
    data: users,
  };
};

const approveDoctorInDB = async (userId: string, approverId: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.role !== 'DOCTOR') {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is not a Doctor');
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        status: 'ACTIVE',
        approvedBy: approverId,
        approvedAt: new Date(),
      },
    });

    await tx.auditLog.create({
      data: {
        action: 'APPROVE_DOCTOR',
        details: `Doctor account for ${user.email} approved by User ${approverId}`,
        performedBy: approverId,
      },
    });

    return updatedUser;
  });

  return result;
};

const rejectDoctorInDB = async (userId: string, approverId: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        status: 'INACTIVE',
      },
    });

    await tx.auditLog.create({
      data: {
        action: 'REJECT_DOCTOR',
        details: `Doctor account for ${user.email} rejected by User ${approverId}`,
        performedBy: approverId,
      },
    });

    return updatedUser;
  });

  return result;
};

const suspendUserInDB = async (userId: string, adminId: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        status: 'SUSPENDED',
      },
    });

    await tx.auditLog.create({
      data: {
        action: 'SUSPEND_USER',
        details: `User account for ${user.email} suspended by Admin ${adminId}`,
        performedBy: adminId,
      },
    });

    return updatedUser;
  });

  return result;
};

const assignPermissionsToUserInDB = async (
  userId: string,
  permissionNames: string[],
  adminId: string,
): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const permissions = await prisma.permission.findMany({
    where: {
      name: { in: permissionNames },
    },
  });

  if (permissions.length !== permissionNames.length) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Some permissions do not exist in the database');
  }

  const result = await prisma.$transaction(async (tx) => {
    const createdPermissions = [];
    for (const perm of permissions) {
      const up = await tx.userPermission.upsert({
        where: {
          permissionId_userId: {
            permissionId: perm.id,
            userId,
          },
        },
        update: {},
        create: {
          permissionId: perm.id,
          userId,
        },
      });
      createdPermissions.push(up);
    }

    await tx.auditLog.create({
      data: {
        action: 'ASSIGN_PERMISSIONS',
        details: `Assigned [${permissionNames.join(', ')}] permissions to User ${user.email}`,
        performedBy: adminId,
      },
    });

    return createdPermissions;
  });

  return result;
};

const removePermissionsFromUserInDB = async (
  userId: string,
  permissionNames: string[],
  adminId: string,
): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const permissions = await prisma.permission.findMany({
    where: {
      name: { in: permissionNames },
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const deletedCount = await tx.userPermission.deleteMany({
      where: {
        userId,
        permissionId: { in: permissions.map((p) => p.id) },
      },
    });

    await tx.auditLog.create({
      data: {
        action: 'REMOVE_PERMISSIONS',
        details: `Removed [${permissionNames.join(', ')}] permissions from User ${user.email}`,
        performedBy: adminId,
      },
    });

    return deletedCount;
  });

  return result;
};

const getUserPermissionsFromDB = async (userId: string): Promise<string[]> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userPermissions: {
        include: {
          permission: true,
        },
      },
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user.userPermissions.map((up) => up.permission.name);
};

// EXPORT
export const UserServices = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getAllUsersFromDB,
  approveDoctorInDB,
  rejectDoctorInDB,
  suspendUserInDB,
  assignPermissionsToUserInDB,
  removePermissionsFromUserInDB,
  getUserPermissionsFromDB,
};
