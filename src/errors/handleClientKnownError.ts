import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { TErrorSources } from '../interfaces/error';

const handleClientKnownError = (
  error: Prisma.PrismaClientKnownRequestError,
) => {
  // ERROR STATUS CODE
  const statusCode = httpStatus.NOT_ACCEPTABLE;

  console.log({ error: error.meta });

  // ERROR MESSAGES
  const errorMessages: string[] = error.message.split('\n');

  // ERROR SOURCE
  const errorSources: TErrorSources = [
    {
      path: error?.meta?.target?.join(','),
      message: errorMessages[errorMessages.length - 1],
    },
  ];

  return {
    statusCode,
    message: 'Bad Request',
    errorSources,
  };
};

export default handleClientKnownError;
