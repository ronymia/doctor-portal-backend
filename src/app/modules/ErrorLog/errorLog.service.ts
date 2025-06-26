import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { TPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';

const errorLogs = async (paginationOptions: TPaginationOptions) => {
  const {
    page,
    limit = 20,
    skip,
  } = paginationHelpers.calculatePagination(paginationOptions);

  const logs = await prisma.errorLog.findMany({
    orderBy: {
      timestamp: 'desc',
    },
    take: 20,
    skip,
  });

  const total = await prisma.errorLog.count();
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      skip,
      total,
      totalPage,
    },
    data: logs,
  };
};

// ErrorLogService
export const ErrorLogServices = { errorLogs };
