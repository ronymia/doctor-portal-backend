import httpStatus from 'http-status';
import { User, Profile, Patient, Gender } from '@prisma/client';
import AppError from '../../../errors/AppError';
import { ENUM_USER_ROLE } from '../../../enums/user';
import config from '../../../config';
import { prisma } from '../../../shared/prisma';
import { PasswordHelpers } from '../../../helpers/passwordHelpers';
import { IAdminCreate, IDoctorCreate } from './user.interface';
import { generateDoctorId } from './user.utils';

//INSERT TO DATABASE
const createAdminIntoDB = async (
  payload: IAdminCreate,
): Promise<Partial<User>> => {
  const { profile } = payload;

  // Use a partial object here, don't force it to be of type `User`
  const result = await prisma.$transaction(async (transactionClient) => {
    const hashedPassword = await PasswordHelpers.passwordHash(
      config.default_admin_pass,
    );

    // CREATE USER
    const newUser = await transactionClient.user.create({
      data: {
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        password: hashedPassword,
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

  // SET DEFAULT PASSWORD
  if (!user?.password) {
    user.password = config.default_admin_pass ?? '';
  } else {
    user.password = await PasswordHelpers.passwordHash(
      config.default_admin_pass as string,
    );
  }

  //DEFINE USER
  const result = await prisma.$transaction(async (transactionClient) => {
    // AUTO INCREMENTED GENERATED DOCTOR ID
    const doctorId = await generateDoctorId();
    console.log({ doctorId });

    //CREATE USER
    const newUser = await transactionClient.user.create({
      data: user as User,
    });

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Doctor');
    }

    // SET DOCTOR ID AS REFERENCE IN USER , DOCTOR AND PROFILE TABLE

    // CREATE DOCTOR
    doctor.userId = newUser.id;
    const newDoctor = await transactionClient.doctor.create({
      data: doctor,
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

    if ('password' in newUser) {
      // Remove password from the response
      delete (newUser as Partial<User>)?.password;
    }

    return { ...newUser, ...newProfile, ...newDoctor };
  });

  return result;
};
//INSERT TO DATABASE
const createPatientIntoDB = async (
  user: User,
  profile: Profile,
): Promise<User> => {
  // SET ROLE
  user.role = ENUM_USER_ROLE.PATIENT;

  // SET DEFAULT PASSWORD
  user.password = config.default_admin_pass;

  //DEFINE USER
  let newUserData = null;

  try {
    // ADMIN TABLE DATA
    let patient: Patient = {};

    // AUTO INCREMENTED GENERATED ADMIN ID
    const patientId = await generateAdminId();
    // SET PATIENT ID AS REFERENCE IN USER , PATIENT AND PROFILE TABLE
    user.user_id = patientId;
    patient.user_id = patientId;
    profile.user_id = patientId;

    // CREATE PATIENT
    const newPatient = await prisma.patient.create({
      data: patient,
    });
    if (!newPatient) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Patient');
    }

    //CREATE PROFILE
    const newProfile = await prisma.profile.create({
      data: profile,
    });
    if (!newProfile) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Patient');
    }
    //CREATE USER
    const newUser = await prisma.user.create({
      data: user,
      include: {
        profile: true,
        patient: true,
      },
    });
    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Patient');
    }
  } catch (error) {}

  return newUserData;
};

export const UserServices = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
};
