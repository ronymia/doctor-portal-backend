import { Request, RequestHandler, Response } from "express";
import { Permission } from "@prisma/client";
import httpStatus from "http-status";
import { PermissionServices } from "./permission.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { permissionFilterableFields } from "./permission.constant";
import { paginationFields } from "../../../constants/pagination";

// CREATE CONTROLLER FUNCTION
const createPermission: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...PermissionData } = req.body; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await PermissionServices.createPermissionIntoDB(
      PermissionData
    );

    //SEND RESPONSE
    sendResponse<Permission>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Permission created Successfully",
      data: result,
    });
  }
);

// GET BY ID  CONTROLLER FUNCTION
const getPermissionById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await PermissionServices.getPermissionByIdFromDB(id);

    //SEND RESPONSE
    sendResponse<Permission>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Permission retrieved Successfully",
      data: result,
    });
  }
);

// GET BY ID  CONTROLLER FUNCTION
const getAllPermissions: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, permissionFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    //SEND DATA TO BUSINESS LOGIC
    const result = await PermissionServices.getAllPermissionsFromDB(
      filters,
      paginationOptions
    );

    //SEND RESPONSE
    sendResponse<Permission[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Permission fetch Successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

// UPDATE CONTROLLER FUNCTION
const updatePermission: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params; //COPY
    const { ...permissionData } = req.body;
    //SEND DATA TO BUSINESS LOGIC
    const result = await PermissionServices.updatePermissionIntoDB(
      id,
      permissionData
    );

    //SEND RESPONSE
    sendResponse<Permission>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Permission update Successfully",
      data: result,
    });
  }
);

// DELETE CONTROLLER FUNCTION
const deletePermission: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await PermissionServices.deletePermissionFromDB(id);

    //SEND RESPONSE
    sendResponse<Permission>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Permission Delete Successfully",
      data: result,
    });
  }
);

export const PermissionControllers = {
  createPermission,
  getPermissionById,
  getAllPermissions,
  updatePermission,
  deletePermission,
};
