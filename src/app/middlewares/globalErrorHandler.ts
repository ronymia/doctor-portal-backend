import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { errorLogger } from '../../shared/logger';
import { TErrorSources } from '../../interfaces/error';
import AppError from '../../errors/AppError';
import { ZodError } from 'zod';
import config from '../../config';
import handleZodError from '../../errors/handleZodError';
import { Prisma } from '@prisma/client';
import handleValidationError from '../../errors/handleValidationError';
import handleClientKnownError from '../../errors/handleClientKnownError';

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  next: NextFunction,
) => {
  //Debug
  if (config.node_env === 'development') {
    // eslint-disable-next-line no-console
    console.debug(`🐱‍🏍 globalErrorHandler ~~`, err);
  } else {
    errorLogger.error(`🐱‍🏍 globalErrorHandler ~~`, err);
  }

  //SETTING DEFAULT VALUES
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  /*
    ?CHECKING ERRORS TYPE
   * Zod validation error
   * PrismaClientValidationError validation error
   * Duplicate Entity Error
   * mongoose cast error => invalid ObjectId
   * Custom throw error
   */

  //  ZOD ERRORS
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleClientKnownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: config.node_env === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
