import httpStatus from "http-status";
import { Permission, PrismaClient, Prisma } from "@prisma/client";
import { TGenericResponse } from "../../../interfaces/response";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { TPermissionFilters } from "./permission.interface";
import { TPaginationOptions } from "../../../interfaces/pagination";
import AppError from "../../../errors/AppError";

const prisma = new PrismaClient();

//INSERT TO DATABASE
const createPermissionIntoDB = async (
  payload: Permission
): Promise<Permission> => {
  const result = await prisma.permission.create({
    data: payload,
  });

  return result;
};

//
const getPermissionByIdFromDB = async (
  id: string
): Promise<Permission | null> => {
  const result = await prisma.permission.findUnique({
    where: { id },
  });

  return result;
};

const getAllPermissionsFromDB = async (
  filters: TPermissionFilters,
  paginationOptions: TPaginationOptions
): Promise<TGenericResponse<Permission[]>> => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract SearchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  // Search and filter condition
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: PermissionSearchableFields.map((field) => ({
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
  const whereCondition: Prisma.PermissionWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  //Database
  const result = await prisma.permission.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  // total count
  const totalCount = await prisma.permission.count();

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

const updatePermissionIntoDB = async (
  id: string,
  payload: Partial<Permission>
): Promise<Permission | null> => {
  const isExist = await prisma.permission.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Permission not found");
  }

  const result = await prisma.permission.findUnique({
    where: { id },
    data: payload,
  });

  return result;
};

const deletePermissionFromDB = async (
  id: string
): Promise<Permission | null> => {
  const result = await prisma.permission.delete({
    where: { id },
  });

  return result;
};

export const PermissionServices = {
  createPermissionIntoDB,
  getPermissionByIdFromDB,
  getAllPermissionsFromDB,
  updatePermissionIntoDB,
  deletePermissionFromDB,
};
