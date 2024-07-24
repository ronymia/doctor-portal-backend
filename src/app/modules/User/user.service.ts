import httpStatus from "http-status";
import {
  User,
  Profile,
  Admin,
  Doctor,
  Patient,
  PrismaClient,
  Prisma,
} from "@prisma/client";
import { userSearchableFields } from "./user.constant";
import { TUserFilters } from "./user.interface";
import { TPaginationOptions } from "../../../interfaces/pagination";
import { TGenericResponse } from "../../../interfaces/response";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import AppError from "../../../errors/AppError";
import { ENUM_USER_ROLE } from "../../../enums/user";
import config from "../../../config";
import { generateAdminId } from "./user.utils";

const prisma = new PrismaClient();

//INSERT TO DATABASE
const createAdminIntoDB = async (
  user: User,
  profile: Profile
): Promise<User> => {
  // SET ROLE
  user.role = ENUM_USER_ROLE.ADMIN;

  // SET DEFAULT PASSWORD
  user.password = config.default_admin_pass;

  //DEFINE USER
  let newUserData = null;

  try {
    // ADMIN TABLE DATA
    let admin: Admin = {};

    // AUTO INCREMENTED GENERATED ADMIN ID
    const adminId = await generateAdminId();
    // SET ADMIN ID AS REFERENCE IN USER , ADMIN AND PROFILE TABLE
    user.user_id = adminId;
    admin.user_id = adminId;
    profile.user_id = adminId;

    // CREATE ADMIN
    const newAdmin = await prisma.admin.create({
      data: admin,
    });
    if (!newAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed yo create Admin");
    }

    //CREATE PROFILE
    const newProfile = await prisma.profile.create({
      data: profile,
    });
    if (!newProfile) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed yo create Admin");
    }
    //CREATE USER
    const newUser = await prisma.user.create({
      data: user,
      include: {
        profile: true,
        admin: true,
      },
    });
    if (!newUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed yo create Admin");
    }
  } catch (error) {}

  return newUserData;
};
//INSERT TO DATABASE
const createDoctorIntoDB = async (
  user: User,
  profile: Profile
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
      throw new AppError(httpStatus.BAD_REQUEST, "Failed yo create Doctor");
    }

    //CREATE PROFILE
    const newProfile = await prisma.profile.create({
      data: profile,
    });
    if (!newProfile) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed yo create Doctor");
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
      throw new AppError(httpStatus.BAD_REQUEST, "Failed yo create Doctor");
    }
  } catch (error) {}

  return newUserData;
};
//INSERT TO DATABASE
const createPatientIntoDB = async (
  user: User,
  profile: Profile
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
      throw new AppError(httpStatus.BAD_REQUEST, "Failed yo create Patient");
    }

    //CREATE PROFILE
    const newProfile = await prisma.profile.create({
      data: profile,
    });
    if (!newProfile) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed yo create Patient");
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
      throw new AppError(httpStatus.BAD_REQUEST, "Failed yo create Patient");
    }
  } catch (error) {}

  return newUserData;
};

export const UserServices = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
};
