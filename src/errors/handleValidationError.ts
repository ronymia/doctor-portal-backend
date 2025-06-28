import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { TErrorSources } from '../interfaces/error';

const handleValidationError = (error: Prisma.PrismaClientValidationError) => {
  const statusCode = httpStatus.UNPROCESSABLE_ENTITY;

  const errorMessages = error.message.split('\n');

  const errorSources: TErrorSources = errorMessages
    .filter((line) => line.trim().startsWith('Argument'))
    .map((line) => {
      const pathMatch = line.match(/Argument `(.*?)`/);
      const path = pathMatch ? pathMatch[1] : '';

      return {
        path,
        message: line.trim(),
      };
    });

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleValidationError;
