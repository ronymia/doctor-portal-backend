import httpStatus from 'http-status';
import { Specialization, Prisma, Appointment } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { TPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import AppError from '../../../errors/AppError';
import { TGenericResponse } from '../../../interfaces/response';
import { appointmentSearchableFields } from './appointment.constant';
import { TAppointmentFilters } from './appointment.interface';

// INSERT TO DATABASE
const createAppointmentIntoDB = async (
  payload: Appointment,
): Promise<Appointment> => {
  const result = await prisma.appointment.create({
    data: payload,
  });

  return result;
};

// GET BY ID FROM DATABASE
const getAppointmentByIdFromDB = async (
  id: string,
): Promise<Appointment | null> => {
  const result = await prisma.appointment.findUnique({
    where: { id },
  });

  return result;
};

// GET ALL FROM DATABASE
const getAllAppointmentsFromDB = async (
  filters: TAppointmentFilters,
  paginationOptions: TPaginationOptions,
): Promise<TGenericResponse<Appointment[]>> => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract SearchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  // Search and filter condition
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: appointmentSearchableFields.map((field) => ({
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
  const whereCondition: Prisma.AppointmentWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  //Database
  const result = await prisma.appointment.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  // total count
  const totalCount = await prisma.appointment.count();

  // return
  return {
    meta: {
      page,
      limit,
      total: totalCount,
    },
    data: result,
  };
};

// UPDATE INTO DATABASE
const updateAppointmentIntoDB = async (
  id: string,
  payload: Partial<Appointment>,
): Promise<Appointment | null> => {
  // CHECK IF SPECIALIZATION EXISTS
  const isExist = await prisma.appointment.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Appointment not found');
  }

  const result = await prisma.appointment.update({
    where: { id },
    data: payload,
  });

  return result;
};

// DELETE FROM DATABASE
const deleteAppointmentFromDB = async (
  id: string,
): Promise<Appointment | null> => {
  // CHECK IF SPECIALIZATION EXISTS
  const isExist = await prisma.appointment.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Appointment not found');
  }

  // DELETE FROM DATABASE
  const result = await prisma.appointment.delete({
    where: { id },
  });

  return result;
};

export const AppointmentServices = {
  createAppointmentIntoDB,
  getAppointmentByIdFromDB,
  getAllAppointmentsFromDB,
  updateAppointmentIntoDB,
  deleteAppointmentFromDB,
};
