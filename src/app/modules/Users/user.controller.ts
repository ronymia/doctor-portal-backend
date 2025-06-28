import httpStatus from 'http-status';
import { User } from '@prisma/client';
import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserServices } from './user.service';
import { PasswordHelpers } from '../../../helpers/passwordHelpers';
import config from '../../../config';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { userFilterableFields } from './user.constant';

// CREATE CONTROLLER FN
const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payloadData } = req.body; //COPY

    if ('password' in payloadData) {
      payloadData.password = await PasswordHelpers.passwordHash(
        payloadData.password,
      );
    } else {
      payloadData.password = await PasswordHelpers.passwordHash(
        config.default_doctor_pass,
      );
    }

    //SEND DATA TO BUSINESS LOGIC
    const result = await UserServices.createAdminIntoDB(payloadData);

    //SEND RESPONSE
    sendResponse<Partial<User>>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Admin created Successfully',
      data: result,
    });
  },
);
// CREATE CONTROLLER FN
const createDoctor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payloadData } = req.body; //COPY

    if ('password' in payloadData) {
      payloadData.password = await PasswordHelpers.passwordHash(
        payloadData.password,
      );
    } else {
      payloadData.password = await PasswordHelpers.passwordHash(
        config.default_doctor_pass,
      );
    }

    //SEND DATA TO BUSINESS LOGIC
    const result = await UserServices.createDoctorIntoDB(payloadData);

    //SEND RESPONSE
    sendResponse<User>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Doctor created Successfully',
      data: result,
    });
  },
);
// CREATE CONTROLLER FN
const createPatient: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payloadData } = req.body; //COPY

    if ('password' in payloadData) {
      payloadData.password = await PasswordHelpers.passwordHash(
        payloadData.password,
      );
    } else {
      payloadData.password = await PasswordHelpers.passwordHash(
        config.default_doctor_pass,
      );
    }
    //SEND DATA TO BUSINESS LOGIC
    const result = await UserServices.createPatientIntoDB(payloadData);

    //SEND RESPONSE
    sendResponse<User>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Patient created Successfully',
      data: result,
    });
  },
);

const getAllUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    //SEND DATA TO BUSINESS LOGIC
    const result = await UserServices.getAllUsersFromDB(
      filters,
      paginationOptions,
    );

    //SEND RESPONSE
    sendResponse<User[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users fetched Successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

// EXPORT
export const UserControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
};
