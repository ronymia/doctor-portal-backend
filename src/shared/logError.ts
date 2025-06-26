// utils/logError.ts

import { prisma } from './prisma';

type LogErrorOptions = {
  token?: string;
  userId?: string;
  ipAddress?: string;
  error: unknown;
  payload?: any;
};

export async function logError({
  token,
  userId,
  ipAddress,
  error,
  payload,
}: LogErrorOptions) {
  try {
    const errorStack =
      error instanceof Error ? error.stack || error.message : String(error);

    const logs = await prisma.errorLog.create({
      data: {
        token,
        userId,
        ipAddress,
        errorStack,
        payload,
      },
    });
    return logs;
  } catch (err) {
    console.error('Failed to log error:', err);
  }
}
