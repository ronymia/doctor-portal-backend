import httpStatus from 'http-status';
import { Prisma, TimeSlot } from '../../../../generated/prisma';
import { TTimeSlotFilters } from './timeSlot.interface';
import { TPaginationOptions } from '../../../interfaces/pagination';
import { TGenericResponse } from '../../../interfaces/response';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { timeSlotSearchableFields } from './timeSlot.constant';
import AppError from '../../../errors/AppError';
import { prisma } from '../../../shared/prisma';

const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const validateTimeSlot = async (startTime: string, endTime: string, excludeId?: string) => {
  const newStart = timeToMinutes(startTime);
  const newEnd = timeToMinutes(endTime);

  if (newStart >= newEnd) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Start time must be before end time');
  }

  const existingSlots = await prisma.timeSlot.findMany();
  for (const slot of existingSlots) {
    if (excludeId && slot.id === excludeId) continue;

    const extStart = timeToMinutes(slot.startTime);
    const extEnd = timeToMinutes(slot.endTime);

    // Exact duplicate
    if (slot.startTime === startTime && slot.endTime === endTime) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Time slot already exists: ${startTime} - ${endTime}`,
      );
    }

    // Check overlap
    const isOverlap =
      (newStart >= extStart && newStart < extEnd) ||
      (newEnd > extStart && newEnd <= extEnd) ||
      (newStart <= extStart && newEnd >= extEnd);

    if (isOverlap) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Time slot overlaps with existing slot (${slot.startTime} - ${slot.endTime})`,
      );
    }
  }
};

//INSERT TO DATABASE TimeSlot FUNCTION
const createTimeSlotIntoDB = async (payload: TimeSlot): Promise<TimeSlot> => {
  await validateTimeSlot(payload.startTime, payload.endTime);

  const result = await prisma.timeSlot.create({
    data: payload,
  });

  return result;
};

// GET BY ID FROM DATABASE TimeSlot FUNCTION
const getTimeSlotByIdFromDB = async (id: string): Promise<TimeSlot | null> => {
  const result = await prisma.timeSlot.findUnique({
    where: { id },
  });

  return result;
};

// GET PAGINATION SORTING AND FILTER TimeSlot FUNCTION
const getAllTimeSlotsFromDB = async (
  filters: TTimeSlotFilters,
  paginationOptions: TPaginationOptions,
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
  const whereCondition: Prisma.TimeSlotWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  //Database
  const result = limit
    ? await prisma.timeSlot.findMany({
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
          // doctorSchedule: true,
          availableDoctors: true,
        },
      })
    : await prisma.timeSlot.findMany({
        orderBy: {
          [sortBy]: sortOrder,
        },
        where: whereCondition,
        include: {
          // doctorSchedule: true,
          availableDoctors: true,
        },
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
  payload: Partial<TimeSlot>,
): Promise<TimeSlot | null> => {
  // CHECK IF TimeSlot EXISTS
  const isExist = await prisma.timeSlot.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Time Slot not found');
  }

  // Overlap and bounds check for update
  if (payload.startTime || payload.endTime) {
    const finalStart = payload.startTime || isExist.startTime;
    const finalEnd = payload.endTime || isExist.endTime;
    await validateTimeSlot(finalStart, finalEnd, id);
  }

  // UPDATE ON DATABASE
  const result = await prisma.timeSlot.update({
    where: { id },
    data: payload,
  });

  return result;
};

// DELETE FROM DATABASE TimeSlot FUNCTION
const deleteTimeSlotFromDB = async (id: string): Promise<TimeSlot | null> => {
  // CHECK IF TimeSlot EXISTS
  const isExist = await prisma.timeSlot.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Time Slot not found');
  }

  // DELETE FROM DATABASE
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
