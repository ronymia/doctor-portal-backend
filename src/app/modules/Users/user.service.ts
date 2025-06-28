import httpStatus from 'http-status';
import { User, Patient, Gender, Doctor, Prisma } from '@prisma/client';
import AppError from '../../../errors/AppError';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { prisma } from '../../../shared/prisma';
import {
  IAdminCreate,
  IDoctorCreate,
  IPatientCreate,
  TUserFilterRequest,
} from './user.interface';
import { logger } from '../../../shared/logger';
import { TGenericResponse } from '../../../interfaces/response';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { userSearchableFields } from './user.constant';
import { TPaginationOptions } from '../../../interfaces/pagination';

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
        role: ENUM_USER_ROLE.ADMIN,
      },
    });

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin');
    }

    // Remove password from the response
    if ('password' in newUser) {
      delete (newUser as Partial<User>).password;
    }

    // CREATE ADMIN
    await transactionClient.admin.create({
      data: { userId: newUser.id },
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
  user.role = ENUM_USER_ROLE.DOCTOR;

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
    const newDoctor = await transactionClient.doctor.create({
      data: doctor as Doctor,
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
      data: { ...user, role: ENUM_USER_ROLE.PATIENT } as User,
    });
    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Patient');
    }

    // CREATE PATIENT
    patient.userId = newUser.id;
    const newPatient = await transactionClient.patient.create({
      data: patient as Patient,
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
  const totalPage = Math.ceil(totalCount / limit);

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

// EXPORT
export const UserServices = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getAllUsersFromDB,
};
