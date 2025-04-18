import { Request, Response } from 'express';
import { Appointment, Specialization } from '@prisma/client';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AppointmentServices } from './appointment.service';
import pick from '../../../shared/pick';
import { appointmentFilterableFields } from './appointment.constant';
import { paginationFields } from '../../../constants/pagination';

// CREATE CONTROLLER FN
const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const { ...payloadData } = req.body; //COPY
  // SEND DATA TO BUSINESS LOGIC
  const result = await AppointmentServices.createAppointmentIntoDB(payloadData);

  // SEND RESPONSE
  sendResponse<Appointment>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Appointment created Successfully',
    data: result,
  });
});

// GET BY ID  CONTROLLER FN
const getAppointmentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; //COPY
  //SEND DATA TO BUSINESS LOGIC
  const result = await AppointmentServices.getAppointmentByIdFromDB(id);

  //SEND RESPONSE
  sendResponse<Appointment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointment retrieved Successfully',
    data: result,
  });
});

// GET BY ID  CONTROLLER FN
const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, appointmentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  //SEND DATA TO BUSINESS LOGIC
  const result = await AppointmentServices.getAllAppointmentsFromDB(
    filters,
    paginationOptions,
  );

  //SEND RESPONSE
  sendResponse<Appointment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointment fetch Successfully',
    meta: result.meta,
    data: result.data,
  });
});

// UPDATE CONTROLLER FUNCTION
const updateAppointment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; //COPY
  const { ...payloadData } = req.body;
  //SEND DATA TO BUSINESS LOGIC
  const result = await AppointmentServices.updateAppointmentIntoDB(
    id,
    payloadData,
  );

  //SEND RESPONSE
  sendResponse<Appointment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointment update Successfully',
    data: result,
  });
});

// DELETE CONTROLLER FUNCTION
const deleteAppointment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; //COPY
  //SEND DATA TO BUSINESS LOGIC
  const result = await AppointmentServices.deleteAppointmentFromDB(id);

  //SEND RESPONSE
  sendResponse<Appointment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointment Delete Successfully',
    data: result,
  });
});

export const AppointmentControllers = {
  createAppointment,
  getAppointmentById,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
};
