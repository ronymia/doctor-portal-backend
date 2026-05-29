import { Patient, Prisma } from '../../../../generated/prisma';
import { prisma } from '../../../shared/prisma';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { patientSearchableFields } from './patient.constant';
import { TPaginationOptions } from '../../../interfaces/pagination';
import { TGenericResponse } from '../../../interfaces/response';
import { IPatientFilterRequest } from './patient.interface';

const getAllPatientsFromDB = async (
  filters: IPatientFilterRequest,
  paginationOptions: TPaginationOptions,
): Promise<TGenericResponse<Patient[]>> => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract SearchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  // Search and filter condition
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
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
  const whereCondition: Prisma.PatientWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  //Database
  const result = await prisma.patient.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  // total count
  const totalCount = await prisma.patient.count();

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

// Exporting the service
export const PatientServices = {
  getAllPatientsFromDB,
};
