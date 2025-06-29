// import { DoctorSchedule } from '@prisma/client';
// import catchAsync from '../../../shared/catchAsync';
// import sendResponse from '../../../shared/sendResponse';
// import httpStatus from 'http-status';
// import { Request, RequestHandler, Response } from 'express';
// import { DoctorScheduleServices } from './doctorSchedule.service';

// const createDoctorSchedule: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     const { ...payloadData } = req.body; //COPY

//     //SEND DATA TO BUSINESS LOGIC
//     const result =
//       await DoctorScheduleServices.createDoctorSchedule(payloadData);

//     //SEND RESPONSE
//     sendResponse<DoctorSchedule>(res, {
//       statusCode: httpStatus.CREATED,
//       success: true,
//       message: 'Doctor Schedule created Successfully',
//       data: result,
//     });
//   },
// );
// const getAllDoctorSchedules: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     //SEND DATA TO BUSINESS LOGIC
//     const result = await DoctorScheduleServices.getAllDoctorSchedules();

//     //SEND RESPONSE
//     sendResponse<DoctorSchedule[]>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Doctor Schedules fetched Successfully',
//       data: result,
//     });
//   },
// );

// export const DoctorScheduleControllers = {
//   createDoctorSchedule,
//   getAllDoctorSchedules,
// };
