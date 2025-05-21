import httpStatus from 'http-status';
import { User, Profile, Doctor, Patient, Gender } from '@prisma/client';
import AppError from '../../../errors/AppError';
import { ENUM_USER_ROLE } from '../../../enums/user';
import config from '../../../config';
import { prisma } from '../../../shared/prisma';
import { PasswordHelpers } from '../../../helpers/passwordHelpers';
import { IAdminCreate } from './user.interface';

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
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        role: true,
        isPasswordResetRequired: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin');
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
const createDoctorIntoDB = async (
  user: User,
  profile: Profile,
): Promise<User> => {
  // SET ROLE
  user.role = ENUM_USER_ROLE.DOCTOR;

  // SET DEFAULT PASSWORD
  user.password = config.default_admin_pass;

  //DEFINE USER
  let newUserData = null;

  try {
    // DOCTOR TABLE DATA
    let doctor: Doctor = {};

    // AUTO INCREMENTED GENERATED DOCTOR ID
    const doctorId = await generateAdminId();
    // SET DOCTOR ID AS REFERENCE IN USER , DOCTOR AND PROFILE TABLE
    user.user_id = doctorId;
    doctor.user_id = doctorId;
    profile.user_id = doctorId;

    // CREATE DOCTOR
    const newDoctor = await prisma.doctor.create({
      data: doctor,
    });
    if (!newDoctor) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Doctor');
    }

    //CREATE PROFILE
    const newProfile = await prisma.profile.create({
      data: profile,
    });
    if (!newProfile) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Doctor');
    }
    //CREATE USER
    const newUser = await prisma.user.create({
      data: user,
      include: {
        profile: true,
        doctor: true,
      },
    });
    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed yo create Doctor');
    }
  } catch (error) {}

  return newUserData;
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
