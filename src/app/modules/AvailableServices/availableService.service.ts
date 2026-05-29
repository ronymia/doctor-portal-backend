import { AvailableService, Prisma } from '../../../../generated/prisma';
import { TAvailableServiceFilters } from './availableService.interface';
import { TPaginationOptions } from '../../../interfaces/pagination';
import { TGenericResponse } from '../../../interfaces/response';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { availableServiceSearchableFields } from './availableService.constant';
import { prisma } from '../../../shared/prisma';

const createAvailableServiceIntoDB = async (
  payload: AvailableService,
): Promise<AvailableService> => {
  const result = await prisma.availableService.create({
    data: payload,
  });

  return result;
};

// GET BY ID FROM DATABASE AvailableService FUNCTION
const getAvailableServiceByIdFromDB = async (
  id: string,
): Promise<AvailableService | null> => {
  const result = await prisma.availableService.findUnique({
    where: { id },
  });

  return result;
};

// GET ALL FROM DATABASE AvailableService FUNCTION
const getAllAvailableServicesFromDB = async (
  filters: TAvailableServiceFilters,
  paginationOptions: TPaginationOptions,
): Promise<TGenericResponse<AvailableService[]>> => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract SearchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  // Search and filter condition
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: availableServiceSearchableFields.map((field) => ({
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
  const whereCondition: Prisma.AvailableServiceWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  //Database
  const result = limit
    ? await prisma.availableService.findMany({
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        where: whereCondition,
      })
    : await prisma.availableService.findMany({
        orderBy: {
          [sortBy]: sortOrder,
        },
        where: whereCondition,
      });

  // total count
  const totalCount = await prisma.availableService.count();

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

export const AvailableServiceServices = {
  createAvailableServiceIntoDB,
  getAvailableServiceByIdFromDB,
  getAllAvailableServicesFromDB,
};
