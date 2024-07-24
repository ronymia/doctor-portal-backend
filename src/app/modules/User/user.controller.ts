import httpStatus from "http-status";
import { User, PrismaClient, Prisma } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserServices } from "./user.service";

// CREATE CONTROLLER FN
const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, phone_number, ...profile } = req.body; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await UserServices.createAdminIntoDB(
      { email, phone_number },
      profile
    );

    //SEND RESPONSE
    sendResponse<User>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Admin created Successfully",
      data: result,
    });
  }
);
// CREATE CONTROLLER FN
const createDoctor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, phone_number, ...profile } = req.body; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await UserServices.createDoctorIntoDB(
      { email, phone_number },
      profile
    );

    //SEND RESPONSE
    sendResponse<User>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Admin created Successfully",
      data: result,
    });
  }
);
// CREATE CONTROLLER FN
const createPatient: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, phone_number, ...profile } = req.body; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await UserServices.createPatientIntoDB(
      { email, phone_number },
      profile
    );

    //SEND RESPONSE
    sendResponse<User>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Admin created Successfully",
      data: result,
    });
  }
);

export const UserControllers = {
  createAdmin,
  createDoctor,
  createPatient,
};
