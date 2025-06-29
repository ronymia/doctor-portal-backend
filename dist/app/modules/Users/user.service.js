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
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const user_1 = require("../../../enums/user");
const prisma_1 = require("../../../shared/prisma");
const logger_1 = require("../../../shared/logger");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const user_constant_1 = require("./user.constant");
const user_utils_1 = require("./user.utils");
//INSERT TO DATABASE
const createAdminIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { profile } = payload;
    // Use a partial object here, don't force it to be of type `User`
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // CREATE USER
        const newUser = yield transactionClient.user.create({
            data: {
                email: payload.email,
                phoneNumber: payload.phoneNumber,
                password: payload === null || payload === void 0 ? void 0 : payload.password,
                role: user_1.ENUM_USER_ROLE.ADMIN,
            },
        });
        if (!newUser) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Admin');
        }
        // Remove password from the response
        if ('password' in newUser) {
            delete newUser.password;
        }
        const adminId = yield (0, user_utils_1.generateAdminId)();
        // CREATE ADMIN
        yield transactionClient.admin.create({
            data: {
                adminId,
                userId: newUser.id,
            },
        });
        // CREATE PROFILE
        if (!Object.values(client_1.Gender).includes(profile.gender)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Invalid gender value, allowed only [${Object.values(client_1.Gender).join(',')}]`);
        }
        const newProfile = yield transactionClient.profile.create({
            data: Object.assign(Object.assign({}, profile), { userId: newUser.id }),
        });
        if (!newProfile) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
        }
        return Object.assign(Object.assign({}, newUser), newProfile);
    }));
    return result;
});
//INSERT TO DATABASE
const createDoctorIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctor, profile } = payload, user = __rest(payload, ["doctor", "profile"]);
    // SET ROLE
    user.role = user_1.ENUM_USER_ROLE.DOCTOR;
    //DEFINE USER
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // AUTO INCREMENTED GENERATED DOCTOR ID
        // const doctorId = await generateDoctorId();
        // console.log({ doctorId });
        //CREATE USER
        const newUser = yield transactionClient.user.create({
            data: user,
        });
        if (!newUser) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed yo create Doctor');
        }
        // CREATE DOCTOR
        doctor.userId = newUser.id;
        const doctorId = yield (0, user_utils_1.generateDoctorId)();
        const newDoctor = yield transactionClient.doctor.create({
            data: Object.assign({ doctorId }, doctor),
        });
        if (!newDoctor) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed yo create Doctor');
        }
        //CREATE PROFILE
        profile.userId = newUser.id;
        const newProfile = yield transactionClient.profile.create({
            data: profile,
        });
        if (!newProfile) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed yo create Doctor');
        }
        // Remove password from the response
        if ('password' in newUser) {
            // Remove password from the response
            newUser === null || newUser === void 0 ? true : delete newUser.password;
        }
        return Object.assign(Object.assign(Object.assign({}, newUser), newProfile), newDoctor);
    }));
    return result;
});
//INSERT TO DATABASE
const createPatientIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // SET ROLE
    const { profile, patient } = payload, user = __rest(payload, ["profile", "patient"]);
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // CREATE USER
        const newUser = yield transactionClient.user.create({
            data: Object.assign(Object.assign({}, user), { role: user_1.ENUM_USER_ROLE.PATIENT }),
        });
        if (!newUser) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed yo create Patient');
        }
        // CREATE PATIENT
        patient.userId = newUser.id;
        const patientId = yield (0, user_utils_1.generatePatientId)();
        const newPatient = yield transactionClient.patient.create({
            data: Object.assign({ patientId }, patient),
        });
        if (!newPatient) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed yo create Patient');
        }
        //CREATE PROFILE
        profile.userId = newUser.id;
        const newProfile = yield transactionClient.profile.create({
            data: profile,
        });
        if (!newProfile) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed yo create Patient');
        }
        // Remove password from the response
        if ('password' in newUser) {
            // Remove password from the response
            newUser === null || newUser === void 0 ? true : delete newUser.password;
        }
        return Object.assign(Object.assign(Object.assign({}, newUser), newProfile), newPatient);
    }));
    logger_1.logger.info(result);
    return result;
});
// GET ALL USERS FROM DATABASE
const getAllUsersFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract SearchTerm to implement search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // Search and filter condition
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchableFields.map((field) => ({
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
        : {
            role: {
                not: user_1.ENUM_USER_ROLE.SUPER_ADMIN, // Exclude super admin
            },
        };
    const users = limit
        ? yield prisma_1.prisma.user.findMany({
            take: limit,
            skip,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                doctor: (filters === null || filters === void 0 ? void 0 : filters.role) === user_1.ENUM_USER_ROLE.DOCTOR ? true : false,
                patient: (filters === null || filters === void 0 ? void 0 : filters.role) === user_1.ENUM_USER_ROLE.PATIENT ? true : false,
                admin: (filters === null || filters === void 0 ? void 0 : filters.role) === user_1.ENUM_USER_ROLE.ADMIN ? true : false,
                profile: true,
            },
            where: whereCondition,
        })
        : yield prisma_1.prisma.user.findMany({
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                doctor: (filters === null || filters === void 0 ? void 0 : filters.role) === user_1.ENUM_USER_ROLE.DOCTOR ? true : false,
                patient: (filters === null || filters === void 0 ? void 0 : filters.role) === user_1.ENUM_USER_ROLE.PATIENT ? true : false,
                admin: (filters === null || filters === void 0 ? void 0 : filters.role) === user_1.ENUM_USER_ROLE.ADMIN ? true : false,
                profile: true,
            },
            where: whereCondition,
        });
    users.forEach((user) => {
        if ('password' in user) {
            user === null || user === void 0 ? true : delete user.password;
        }
    });
    // total count
    const totalCount = yield prisma_1.prisma.user.count({
        where: whereCondition,
    });
    const totalPage = Math.ceil(totalCount / limit);
    return {
        meta: {
            page,
            limit,
            total: totalCount,
            totalPage,
        },
        data: users,
    };
});
// EXPORT
exports.UserServices = {
    createAdminIntoDB,
    createDoctorIntoDB,
    createPatientIntoDB,
    getAllUsersFromDB,
};
