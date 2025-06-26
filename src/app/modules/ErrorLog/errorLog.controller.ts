import { Request, Response } from 'express';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { ErrorLogServices } from './errorLog.service';

const errorLogs = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ErrorLogServices.errorLogs(paginationOptions);

  console.log({ result: result.data });
  res.render('error-logs', {
    result,
  });
  //   sendResponse<ErrorLog[]>(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'Error Log fetch Successfully',
  //     meta: result.meta,
  //     data: result.data,
  //   });
});

export const ErrorLogControllers = {
  errorLogs,
};
