import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { AdminServices } from './admin.service';

const getAllAdmins: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, ['searchTerm', 'email', 'phoneNumber']);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await AdminServices.getAllAdminsFromDB(
      filters,
      paginationOptions,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admins fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminServices.getAdminByIdFromDB(id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin fetched successfully',
      data: result,
    });
  },
);

const updateAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await AdminServices.updateAdminIntoDB(id as string, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin updated successfully',
      data: result,
    });
  },
);

const deleteAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminServices.deleteAdminFromDB(id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin deleted successfully',
      data: result,
    });
  },
);

export const AdminControllers = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
