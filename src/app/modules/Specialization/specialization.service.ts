import httpStatus from 'http-status';
import { Specialization, PrismaClient, Prisma } from '@prisma/client';
import { TSpecializationFilters } from './specialization.interface';
import { TPaginationOptions } from '../../../interfaces/pagination';
import { TGenericResponse } from '../../../interfaces/response';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { specializationSearchableFields } from './specialization.constant';
import AppError from '../../../errors/AppError';

const prisma = new PrismaClient();

//INSERT TO DATABASE
const createSpecializationIntoDB = async (
  payload: Specialization,
): Promise<Specialization> => {
  const result = await prisma.specialization.create({
    data: payload,
  });

  return result;
};

//
const getSpecializationByIdFromDB = async (
  id: number,
): Promise<Specialization | null> => {
  const result = await prisma.specialization.findUnique({
    where: { id },
  });

  return result;
};

const getAllSpecializationsFromDB = async (
  filters: TSpecializationFilters,
  paginationOptions: TPaginationOptions,
): Promise<TGenericResponse<Specialization[]>> => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract SearchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  // Search and filter condition
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: specializationSearchableFields.map((field) => ({
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
  const whereCondition: Prisma.SpecializationWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  //Database
  const result = await prisma.specialization.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  // total count
  const totalCount = await prisma.specialization.count();

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

const updateSpecializationIntoDB = async (
  id: string,
  payload: Partial<Specialization>,
): Promise<Specialization | null> => {
  const isExist = await prisma.specialization.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Specialization not found');
  }

  const result = await prisma.specialization.findUnique({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteSpecializationFromDB = async (
  id: string,
): Promise<Specialization | null> => {
  const result = await prisma.specialization.delete({
    where: { id },
  });

  return result;
};

export const SpecializationServices = {
  createSpecializationIntoDB,
  getSpecializationByIdFromDB,
  getAllSpecializationsFromDB,
  updateSpecializationIntoDB,
  deleteSpecializationFromDB,
};
