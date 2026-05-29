import { Patient } from '../../../../generated/prisma';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { patientFilterableFields } from './patient.constant';
import { PatientServices } from './patient.service';
import httpStatus from 'http-status';

const getAllPatientsFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, patientFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PatientServices.getAllPatientsFromDB(
    filters,
    paginationOptions,
  );

  // SEND RESPONSE
  sendResponse<Patient[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient fetch Successfully',
    meta: result.meta,
    data: result.data,
  });
});

// export
export const PatientControllers = {
  getAllPatientsFromDB,
};
