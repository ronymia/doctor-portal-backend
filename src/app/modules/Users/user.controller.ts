import httpStatus from 'http-status';
import { User } from '../../../../generated/prisma';
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

const approveDoctor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const approverId = (req as any).user.user_id;

    const result = await UserServices.approveDoctorInDB(id as string, approverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Doctor account approved successfully',
      data: result,
    });
  },
);

const rejectDoctor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const approverId = (req as any).user.user_id;

    const result = await UserServices.rejectDoctorInDB(id as string, approverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Doctor account rejected successfully',
      data: result,
    });
  },
);

const suspendUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const adminId = (req as any).user.user_id;

    const result = await UserServices.suspendUserInDB(id as string, adminId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User account suspended successfully',
      data: result,
    });
  },
);

const assignPermissions: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { permissions } = req.body;
    const adminId = (req as any).user.user_id;

    const result = await UserServices.assignPermissionsToUserInDB(
      id as string,
      permissions,
      adminId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permissions assigned successfully',
      data: result,
    });
  },
);

const removePermissions: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { permissions } = req.body;
    const adminId = (req as any).user.user_id;

    const result = await UserServices.removePermissionsFromUserInDB(
      id as string,
      permissions,
      adminId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permissions removed successfully',
      data: result,
    });
  },
);

const getUserPermissions: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserServices.getUserPermissionsFromDB(id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User permissions fetched successfully',
      data: result,
    });
  },
);

const updateDoctor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserServices.updateDoctorIntoDB(id as string, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Doctor updated successfully',
      data: result,
    });
  },
);

// EXPORT
export const UserControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  approveDoctor,
  rejectDoctor,
  suspendUser,
  assignPermissions,
  removePermissions,
  getUserPermissions,
  updateDoctor,
};
