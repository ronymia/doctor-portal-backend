import httpStatus from 'http-status';
import { User } from '@prisma/client';
import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserServices } from './user.service';
import { PasswordHelpers } from '../../../helpers/passwordHelpers';
import config from '../../../config';

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

export const UserControllers = {
  createAdmin,
  createDoctor,
  createPatient,
};
