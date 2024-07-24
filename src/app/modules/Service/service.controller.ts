import { Request, RequestHandler, Response } from "express";
import { Service } from "@prisma/client";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { ServiceServices } from "./service.service";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { serviceFilterableFields } from "./service.constant";
import { paginationFields } from "../../../constants/pagination";

// CREATE CONTROLLER FUNCTION
const createService: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...serviceData } = req.body; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await ServiceServices.createServiceIntoDB(serviceData);

    //SEND RESPONSE
    sendResponse<Service>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Service created Successfully",
      data: result,
    });
  }
);

// GET BY ID  CONTROLLER FUNCTION
const getServiceById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await ServiceServices.getServiceByIdFromDB(id);

    //SEND RESPONSE
    sendResponse<Service>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service retrieved Successfully",
      data: result,
    });
  }
);

// GET BY ID  CONTROLLER FN
const getAllServices: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, serviceFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    //SEND DATA TO BUSINESS LOGIC
    const result = await ServiceServices.getAllServicesFromDB(
      filters,
      paginationOptions
    );

    //SEND RESPONSE
    sendResponse<Service[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service fetch Successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

// UPDATE CONTROLLER FUNCTION
const updateService: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params; //COPY
    const { ...serviceData } = req.body;
    //SEND DATA TO BUSINESS LOGIC
    const result = await ServiceServices.updateServiceIntoDB(id, serviceData);

    //SEND RESPONSE
    sendResponse<Service>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service update Successfully",
      data: result,
    });
  }
);

// DELETE CONTROLLER FUNCTION
const deleteService: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await ServiceServices.deleteServiceFromDB(id);

    //SEND RESPONSE
    sendResponse<Service>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Service Delete Successfully",
      data: result,
    });
  }
);

export const ServiceControllers = {
  createService,
  getServiceById,
  getAllServices,
  updateService,
  deleteService,
};
