import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { TErrorSources } from '../interfaces/error';
import { errorLogger } from '../shared/logger';

const handleClientInitializationError = (
  error: Prisma.PrismaClientInitializationError,
) => {
  // ERROR STATUS CODE
  const statusCode = httpStatus.NOT_ACCEPTABLE;

  errorLogger.error(`🐱‍🏍 handleClientInitializationError ~~`, error);
  console.log({ error });

  // ERROR MESSAGES
  const errorMessages: string[] = error.message.split('\n');

  // ERROR SOURCE
  const errorSources: TErrorSources = [
    {
      path: String(error?.errorCode),
      message: errorMessages[errorMessages.length - 1],
    },
  ];

  return {
    statusCode,
    message: 'Validation error',
    errorSources,
  };
};

export default handleClientInitializationError;
