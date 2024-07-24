import httpStatus from "http-status";
import { Service, PrismaClient, Prisma } from "@prisma/client";
import { TServiceFilters } from "./service.interface";
import { TPaginationOptions } from "../../../interfaces/pagination";
import { TGenericResponse } from "../../../interfaces/response";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { serviceSearchableFields } from "./service.constant";
import AppError from "../../../errors/AppError";

const prisma = new PrismaClient();

//INSERT TO DATABASE SERVICE FUNCTION
const createServiceIntoDB = async (payload: Service): Promise<Service> => {
  const result = await prisma.service.create({
    data: payload,
  });

  return result;
};

//
const getServiceByIdFromDB = async (id: string): Promise<Service | null> => {
  const result = await prisma.service.findUnique({
    where: { id },
  });

  return result;
};

// GET PAGINATION SORTING AND FILTER SERVICE FUNCTION
const getAllServicesFromDB = async (
  filters: TServiceFilters,
  paginationOptions: TPaginationOptions
): Promise<TGenericResponse<Service[]>> => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract SearchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  // Search and filter condition
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
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
  const whereCondition: Prisma.ServiceWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  //Database
  const result = await prisma.service.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  // total count
  const totalCount = await prisma.service.count();

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

// UPDATE INTO DATABASE SERVICE FUNCTION
const updateServiceIntoDB = async (
  id: string,
  payload: Partial<Service>
): Promise<Service | null> => {
  const isExist = await prisma.service.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Service not found");
  }

  const result = await prisma.service.findUnique({
    where: { id },
    data: payload,
  });

  return result;
};

// DELETE FROM DATABASE SERVICE FUNCTION
const deleteServiceFromDB = async (id: string): Promise<Service | null> => {
  const result = await prisma.service.delete({
    where: { id },
  });

  return result;
};

export const ServiceServices = {
  createServiceIntoDB,
  getServiceByIdFromDB,
  getAllServicesFromDB,
  updateServiceIntoDB,
  deleteServiceFromDB,
};
