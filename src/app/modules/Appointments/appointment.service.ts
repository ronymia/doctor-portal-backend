import httpStatus from 'http-status';
import {
  Prisma,
  Appointment,
  PaymentStatus,
  AppointmentStatus,
} from '../../../../generated/prisma';
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

// book an appointment
const bookAppointmentIntoDB = async (payload: {
  patientId: string;
  availableServiceId: string;
  appointmentDate: Date;
}): Promise<any> => {
  const { patientId, availableServiceId, appointmentDate } = payload;

  // Check if the patient exists
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });
  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
  }
  // Check if the available service exists
  const availableService = await prisma.availableService.findUnique({
    where: { id: availableServiceId },
    include: { service: true },
  });
  if (!availableService) {
    throw new AppError(httpStatus.NOT_FOUND, 'Available service not found');
  }
  // Check if the appointment date is in the future
  if (appointmentDate <= new Date()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Appointment date must be in the future',
    );
  }

  // Create the appointment
  const result = await prisma.$transaction(async (transactionClient) => {
    // BOOK APPOINTMENT
    const appointment = await transactionClient.appointment.create({
      data: {
        patientId: patientId,
        availableServiceId: availableServiceId,
        appointmentDate: appointmentDate,
        status: AppointmentStatus.SCHEDULED,
      },
    });

    // Update the available service's status to 'booked'
    await transactionClient.availableService.update({
      where: { id: availableServiceId },
      data: {
        availableSeats: availableService.availableSeats - 1,
        isBooked: availableService.availableSeats - 1 === 0 ? true : false,
      },
    });

    // create payment record
    const payment = await transactionClient.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: availableService.fees,
        paymentStatus: PaymentStatus.PENDING,
        paymentDate: null, // Payment date will be updated once payment is completed
      },
    });

    return { appointment, payment };
  });

  return result;
};

const cancelAppointment = async (appointmentId: string): Promise<any> => {
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
  });

  if (!appointment) {
    throw new Error('Appointment does not exist');
  }

  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new Error('Appointment has already been cancelled');
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new Error('Appointment has already been completed');
  }

  const cancelledAppointment = await prisma.$transaction(
    async (transactionClient) => {
      const appointmentToCancel = await transactionClient.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status: AppointmentStatus.CANCELLED,
        },
      });

      const availableService =
        await transactionClient.availableService.findUnique({
          where: {
            id: appointment.availableServiceId,
          },
        });

      await transactionClient.availableService.update({
        where: {
          id: appointment.availableServiceId,
        },
        data: {
          availableSeats: {
            increment: 1,
          },

          isBooked:
            availableService && availableService.availableSeats + 1 > 0
              ? false
              : true,
        },
      });

      await transactionClient.payment.updateMany({
        where: {
          appointmentId: appointmentId,
        },
        data: {
          paymentStatus: PaymentStatus.CANCELLED,
        },
      });

      return {
        appointment: appointmentToCancel,
      };
    },
  );

  return cancelledAppointment;
};

const startAppointment = async (appointmentId: string): Promise<any> => {
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
  });

  if (!appointment) {
    throw new Error('Appointment does not exist');
  }

  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new Error('Appointment has already been cancelled');
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new Error('Appointment has already been completed');
  }

  const startedAppointment = await prisma.$transaction(
    async (transactionClient) => {
      await transactionClient.payment.updateMany({
        where: {
          appointmentId,
        },
        data: {
          paymentStatus: PaymentStatus.PAID,
          paymentDate: new Date().toISOString(),
        },
      });

      const appointmentToStart = await transactionClient.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status: AppointmentStatus.PENDING_PAYMENT,
        },
      });

      if (!appointmentToStart) {
        await transactionClient.payment.updateMany({
          where: {
            appointmentId,
          },
          data: {
            paymentStatus: PaymentStatus.REFUNDED,
          },
        });
      }

      return appointmentToStart;
    },
  );

  return startedAppointment;
};

const finishAppointment = async (appointmentId: string): Promise<any> => {
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
  });

  if (!appointment) {
    throw new Error('Appointment does not exist');
  }

  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new Error('Appointment has already been cancelled');
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new Error('Appointment has already been completed');
  }

  const appointmentToFinish = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status: AppointmentStatus.COMPLETED,
    },
  });

  return appointmentToFinish;
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
  bookAppointmentIntoDB,
  cancelAppointment,
  startAppointment,
  finishAppointment,
  createAppointmentIntoDB,
  getAppointmentByIdFromDB,
  getAllAppointmentsFromDB,
  updateAppointmentIntoDB,
  deleteAppointmentFromDB,
};
