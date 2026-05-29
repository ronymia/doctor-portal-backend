import { Request, RequestHandler, Response } from 'express';
import { TimeSlot } from '../../../../generated/prisma';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { TimeSlotServices } from './timeSlot.service';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { timeSlotFilterableFields } from './timeSlot.constant';
import { paginationFields } from '../../../constants/pagination';

// CREATE CONTROLLER FUNCTION
const createTimeSlot: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payloadData } = req.body; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await TimeSlotServices.createTimeSlotIntoDB(payloadData);

    //SEND RESPONSE
    sendResponse<TimeSlot>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Time Slot created Successfully',
      data: result,
    });
  },
);

// GET BY ID  CONTROLLER FUNCTION
const getTimeSlotById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as any; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await TimeSlotServices.getTimeSlotByIdFromDB(id);

    //SEND RESPONSE
    sendResponse<TimeSlot>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Time Slot retrieved Successfully',
      data: result,
    });
  },
);

// GET BY ID  CONTROLLER FN
const getAllTimeSlots: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, timeSlotFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    //SEND DATA TO BUSINESS LOGIC
    const result = await TimeSlotServices.getAllTimeSlotsFromDB(
      filters,
      paginationOptions,
    );

    //SEND RESPONSE
    sendResponse<TimeSlot[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Time Slot fetch Successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

// UPDATE CONTROLLER FUNCTION
const updateTimeSlot: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as any; //COPY
    const { ...payloadData } = req.body;
    //SEND DATA TO BUSINESS LOGIC
    const result = await TimeSlotServices.updateTimeSlotIntoDB(id, payloadData);

    //SEND RESPONSE
    sendResponse<TimeSlot>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Time Slot update Successfully',
      data: result,
    });
  },
);

// DELETE CONTROLLER FUNCTION
const deleteTimeSlot: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as any; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await TimeSlotServices.deleteTimeSlotFromDB(id);

    //SEND RESPONSE
    sendResponse<TimeSlot>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Time Slot Delete Successfully',
      data: result,
    });
  },
);

// EXPORT
export const TimeSlotControllers = {
  createTimeSlot,
  getTimeSlotById,
  getAllTimeSlots,
  updateTimeSlot,
  deleteTimeSlot,
};
