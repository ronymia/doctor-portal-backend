type TOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

type TPaginationResult = {
  page: number;
  limit?: number;
  skip?: number;
  sortBy: string;
  sortOrder: string;
};

const calculatePagination = (options: TOptions): TPaginationResult => {
  const page = Number(options.page) || 1;
  const limit = options.limit !== undefined ? Number(options.limit) : undefined;
  const skip = limit !== undefined ? (page - 1) * limit : undefined;

  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelpers = { calculatePagination };
