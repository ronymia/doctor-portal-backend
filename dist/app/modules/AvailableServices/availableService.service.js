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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableServiceServices = void 0;
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const availableService_constant_1 = require("./availableService.constant");
const prisma_1 = require("../../../shared/prisma");
const createAvailableServiceIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.availableService.create({
        data: payload,
    });
    return result;
});
// GET BY ID FROM DATABASE AvailableService FUNCTION
const getAvailableServiceByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.availableService.findUnique({
        where: { id },
    });
    return result;
});
// GET ALL FROM DATABASE AvailableService FUNCTION
const getAllAvailableServicesFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract SearchTerm to implement search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // Search and filter condition
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
            OR: availableService_constant_1.availableServiceSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // field Filtering
    if (Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.entries(filtersData).map(([field, value]) => ({
                [field]: {
                    equals: value,
                },
            })),
        });
    }
    // If there is no condition , put {} to give all data
    const whereCondition = andConditions.length
        ? { AND: andConditions }
        : {};
    //Database
    const result = limit
        ? yield prisma_1.prisma.availableService.findMany({
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            where: whereCondition,
        })
        : yield prisma_1.prisma.availableService.findMany({
            orderBy: {
                [sortBy]: sortOrder,
            },
            where: whereCondition,
        });
    // total count
    const totalCount = yield prisma_1.prisma.availableService.count();
    // return
    return {
        meta: {
            page,
            limit,
            total: totalCount,
        },
        data: result,
    };
});
exports.AvailableServiceServices = {
    createAvailableServiceIntoDB,
    getAvailableServiceByIdFromDB,
    getAllAvailableServicesFromDB,
};
