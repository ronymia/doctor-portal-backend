import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { TErrorSources } from '../interfaces/error';

const handleValidationError = (error: Prisma.PrismaClientValidationError) => {
  // ERROR STATUS CODE
  const statusCode = httpStatus.UNPROCESSABLE_ENTITY;

  // ERROR MESSAGES
  const errorMessages: string[] = error.message.split('\n');

  // ERROR SOURCE
  const errorSources: TErrorSources = [
    {
      path: '',
      message: errorMessages[errorMessages.length - 1],
    },
  ];

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleValidationError;
