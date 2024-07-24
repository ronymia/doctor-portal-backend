import { Request, RequestHandler, Response } from "express";
import { AvailableService } from "@prisma/client";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { availableServiceFilterableFields } from "./availableService.constant";
import { paginationFields } from "../../../constants/pagination";
import { AvailableServiceServices } from "./availableService.service";

// GET BY ID  CONTROLLER FUNCTION
const getAvailableServiceById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await AvailableServiceServices.getAvailableServiceByIdFromDB(
      id
    );

    //SEND RESPONSE
    sendResponse<AvailableService>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Available Service retrieved Successfully",
      data: result,
    });
  }
);

// GET BY ID  CONTROLLER FN
const getAllAvailableServices: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, availableServiceFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    //SEND DATA TO BUSINESS LOGIC
    const result = await AvailableServiceServices.getAllAvailableServicesFromDB(
      filters,
      paginationOptions
    );

    //SEND RESPONSE
    sendResponse<AvailableService[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Available service fetch Successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const AvailableServiceControllers = {
  //   createAvailableService,
  getAvailableServiceById,
  getAllAvailableServices,
  //   updateAvailableService,
  //   deleteAvailableService,
};
