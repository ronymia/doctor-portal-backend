import httpStatus from 'http-status';
import { TErrorSources } from '../interfaces/error';
import { Prisma } from '../../generated/prisma';

const handleClientKnownError = (
  error: Prisma.PrismaClientKnownRequestError,
) => {
  // ERROR STATUS CODE
  const statusCode = httpStatus.NOT_ACCEPTABLE;

  console.log({ error });

  // ERROR MESSAGES
  const errorMessages: string[] = error.message.split('\n');

  // ERROR SOURCE
  const errorSources: TErrorSources = [
    {
      path:
        error?.meta && typeof error.meta === 'object'
          ? (Object.values(error.meta)[0]?.toString() ?? 'unknown')
          : 'unknown',
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
