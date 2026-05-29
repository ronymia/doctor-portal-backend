"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelpers = void 0;
const calculatePagination = (options) => {
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
exports.paginationHelpers = { calculatePagination };
