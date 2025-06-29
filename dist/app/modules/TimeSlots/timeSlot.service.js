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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const timeSlot_constant_1 = require("./timeSlot.constant");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const prisma_1 = require("../../../shared/prisma");
//INSERT TO DATABASE TimeSlot FUNCTION
const createTimeSlotIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.timeSlot.create({
        data: payload,
    });
    return result;
});
// GET BY ID FROM DATABASE TimeSlot FUNCTION
const getTimeSlotByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.timeSlot.findUnique({
        where: { id },
    });
    return result;
});
// GET PAGINATION SORTING AND FILTER TimeSlot FUNCTION
const getAllTimeSlotsFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract SearchTerm to implement search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // Search and filter condition
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
            OR: timeSlot_constant_1.timeSlotSearchableFields.map((field) => ({
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
        ? yield prisma_1.prisma.timeSlot.findMany({
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            where: whereCondition,
            include: {
                // doctorSchedule: true,
                availableDoctors: true,
            },
        })
        : yield prisma_1.prisma.timeSlot.findMany({
            orderBy: {
                [sortBy]: sortOrder,
            },
            where: whereCondition,
            include: {
                // doctorSchedule: true,
                availableDoctors: true,
            },
        });
    // total count
    const totalCount = yield prisma_1.prisma.timeSlot.count();
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
// UPDATE INTO DATABASE TimeSlot FUNCTION
const updateTimeSlotIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF TimeSlot EXISTS
    const isExist = yield prisma_1.prisma.timeSlot.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Time Slot not found');
    }
    // UPDATE ON DATABASE
    const result = yield prisma_1.prisma.timeSlot.update({
        where: { id },
        data: payload,
    });
    return result;
});
// DELETE FROM DATABASE TimeSlot FUNCTION
const deleteTimeSlotFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF TimeSlot EXISTS
    const isExist = yield prisma_1.prisma.timeSlot.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Time Slot not found');
    }
    // DELETE FROM DATABASE
    const result = yield prisma_1.prisma.timeSlot.delete({
        where: { id },
    });
    return result;
});
exports.TimeSlotServices = {
    createTimeSlotIntoDB,
    getTimeSlotByIdFromDB,
    getAllTimeSlotsFromDB,
    updateTimeSlotIntoDB,
    deleteTimeSlotFromDB,
};
