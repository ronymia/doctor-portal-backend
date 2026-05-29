import { AvailableDoctor, Prisma } from '../../../../generated/prisma';
import { prisma } from '../../../shared/prisma';
import { TAvailableDoctorFilterRequest } from './availableDoctor.interface';
import { TPaginationOptions } from '../../../interfaces/pagination';
import { availableDoctorSearchableFields } from './availableDoctor.constant';
import { paginationHelpers } from '../../../helpers/paginationHelpers';

// INSERT TO DATABASE
const createAvailableDoctorIntoDB = async (payload: AvailableDoctor) => {
  const { doctorId, slotId, availableDate } = payload;

  const availableDoctor = await prisma.availableDoctor.create({
    data: {
      doctor: { connect: { id: doctorId } },
      slot: { connect: { id: slotId } },
      availableDate,
    },
    include: {
      doctor: true,
      slot: true,
    },
  });

  return availableDoctor;
};

// GET BY ID FROM DATABASE AvailableDoctor FUNCTION
const getAvailableDoctorByIdFromDB = async (id: string) => {
  const availableDoctor = await prisma.availableDoctor.findUnique({
    where: { id },
    include: {
      doctor: true,
      slot: true,
    },
  });

  return availableDoctor;
};

// GET ALL FROM DATABASE AvailableDoctor FUNCTION
const getAllAvailableDoctorsFromDB = async (
  filters: TAvailableDoctorFilterRequest,
  paginationOptions: TPaginationOptions,
) => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract SearchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  // Search and filter condition
  const andConditions: Prisma.AvailableDoctorWhereInput[] = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: availableDoctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })) as Prisma.AvailableDoctorWhereInput[],
    });
  }

  // field Filtering
  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => {
        if (field === 'specializations' || field === 'specializationId') {
          return {
            doctor: {
              specializationId: {
                equals: value as string,
              },
            },
          };
        }
        return {
          [field]: {
            equals: value,
          },
        };
      }) as Prisma.AvailableDoctorWhereInput[],
    });
  }

  // If there is no condition , put {} to give all data
  const whereCondition: Prisma.AvailableDoctorWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  //Database
  const result = limit
    ? await prisma.availableDoctor.findMany({
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
          doctor: true,
          slot: true,
        },
      })
    : await prisma.availableDoctor.findMany({
        orderBy: {
          [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
          doctor: true,
          slot: true,
        },
      });

  // total count
  const totalCount = await prisma.availableDoctor.count();

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

// Exporting
export const AvailableDoctorServices = {
  createAvailableDoctorIntoDB,
  getAvailableDoctorByIdFromDB,
  getAllAvailableDoctorsFromDB,
};
