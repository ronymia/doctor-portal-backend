import { AvailableDoctor } from '../../../../generated/prisma';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AvailableDoctorServices } from './availableDoctor.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { availableDoctorFilterableFields } from './availableDoctor.constant';
import { Request, RequestHandler, Response } from 'express';

const createAvailableDoctorIntoDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payloadData } = req.body; //COPY

    //SEND DATA TO BUSINESS LOGIC
    const result =
      await AvailableDoctorServices.createAvailableDoctorIntoDB(payloadData);

    //SEND RESPONSE
    sendResponse<AvailableDoctor>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Available Doctor created Successfully',
      data: result,
    });
  },
);

const getAllAvailableDoctorsFromDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, availableDoctorFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    //SEND DATA TO BUSINESS LOGIC
    const result = await AvailableDoctorServices.getAllAvailableDoctorsFromDB(
      filters,
      paginationOptions,
    );

    //SEND RESPONSE
    sendResponse<AvailableDoctor[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Available Doctor fetch Successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

export const AvailableDoctorControllers = {
  createAvailableDoctorIntoDB,
  getAllAvailableDoctorsFromDB,
};
