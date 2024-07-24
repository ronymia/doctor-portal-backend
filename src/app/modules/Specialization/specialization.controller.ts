import { Request, Response } from 'express';
import { Specialization } from '@prisma/client';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { SpecializationServices } from './specialization.service';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { specializationFilterableFields } from './specialization.constant';
import { paginationFields } from '../../../constants/pagination';

// CREATE CONTROLLER FN
const createSpecialization = catchAsync(async (req: Request, res: Response) => {
  const { ...specializationData } = req.body; //COPY
  //SEND DATA TO BUSINESS LOGIC
  const result =
    await SpecializationServices.createSpecializationIntoDB(specializationData);

  //SEND RESPONSE
  sendResponse<Specialization>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Specialization created Successfully',
    data: result,
  });
});

// GET BY ID  CONTROLLER FN
const getSpecializationById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = await SpecializationServices.getSpecializationByIdFromDB(
      Number(id),
    );

    //SEND RESPONSE
    sendResponse<Specialization>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Specialization retrieved Successfully',
      data: result,
    });
  },
);

// GET BY ID  CONTROLLER FN
const getAllSpecializations = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, specializationFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    //SEND DATA TO BUSINESS LOGIC
    const result = await SpecializationServices.getAllSpecializationsFromDB(
      filters,
      paginationOptions,
    );

    //SEND RESPONSE
    sendResponse<Specialization[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Specialization fetch Successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

// UPDATE CONTROLLER FUNCTION
const updateSpecialization = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; //COPY
  const { ...specializationData } = req.body;
  //SEND DATA TO BUSINESS LOGIC
  const result = await SpecializationServices.updateSpecializationIntoDB(
    id,
    specializationData,
  );

  //SEND RESPONSE
  sendResponse<Specialization>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Specialization update Successfully',
    data: result,
  });
});

// DELETE CONTROLLER FUNCTION
const deleteSpecialization = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; //COPY
  //SEND DATA TO BUSINESS LOGIC
  const result = await SpecializationServices.deleteSpecializationFromDB(id);

  //SEND RESPONSE
  sendResponse<Specialization>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Specialization Delete Successfully',
    data: result,
  });
});

export const SpecializationControllers = {
  createSpecialization,
  getSpecializationById,
  getAllSpecializations,
  updateSpecialization,
  deleteSpecialization,
};
