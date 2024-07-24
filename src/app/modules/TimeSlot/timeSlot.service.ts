import httpStatus from "http-status";
import { TimeSlot, PrismaClient, Prisma } from "@prisma/client";
import { TTimeSlotFilters } from "./timeSlot.interface";
import { TPaginationOptions } from "../../../interfaces/pagination";
import { TGenericResponse } from "../../../interfaces/response";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { timeSlotSearchableFields } from "./timeSlot.constant";
import AppError from "../../../errors/AppError";

const prisma = new PrismaClient();

//INSERT TO DATABASE TimeSlot FUNCTION
const createTimeSlotIntoDB = async (payload: TimeSlot): Promise<TimeSlot> => {
  const result = await prisma.timeSlot.create({
    data: payload,
  });

  return result;
};

//
const getTimeSlotByIdFromDB = async (id: string): Promise<TimeSlot | null> => {
  const result = await prisma.timeSlot.findUnique({
    where: { id },
  });

  return result;
};

// GET PAGINATION SORTING AND FILTER TimeSlot FUNCTION
const getAllTimeSlotsFromDB = async (
  filters: TTimeSlotFilters,
  paginationOptions: TPaginationOptions
): Promise<TGenericResponse<TimeSlot[]>> => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract SearchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  // Search and filter condition
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: timeSlotSearchableFields.map((field) => ({
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
  const whereCondition: Prisma.TimeSlotWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  //Database
  const result = await prisma.timeSlot.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  // total count
  const totalCount = await prisma.timeSlot.count();

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

// UPDATE INTO DATABASE TimeSlot FUNCTION
const updateTimeSlotIntoDB = async (
  id: string,
  payload: Partial<TimeSlot>
): Promise<TimeSlot | null> => {
  const isExist = await prisma.timeSlot.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Time Slot not found");
  }

  const result = await prisma.timeSlot.findUnique({
    where: { id },
    data: payload,
  });

  return result;
};

// DELETE FROM DATABASE TimeSlot FUNCTION
const deleteTimeSlotFromDB = async (id: string): Promise<TimeSlot | null> => {
  const result = await prisma.timeSlot.delete({
    where: { id },
  });

  return result;
};

export const TimeSlotServices = {
  createTimeSlotIntoDB,
  getTimeSlotByIdFromDB,
  getAllTimeSlotsFromDB,
  updateTimeSlotIntoDB,
  deleteTimeSlotFromDB,
};
