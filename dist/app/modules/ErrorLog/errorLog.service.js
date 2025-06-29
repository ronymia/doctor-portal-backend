"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLogServices = void 0;
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const prisma_1 = require("../../../shared/prisma");
const errorLogs = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit = 20, skip, } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const logs = yield prisma_1.prisma.errorLog.findMany({
        orderBy: {
            timestamp: 'desc',
        },
        take: 20,
        skip,
    });
    const total = yield prisma_1.prisma.errorLog.count();
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
});
// ErrorLogService
exports.ErrorLogServices = { errorLogs };
