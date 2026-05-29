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
exports.AdminServices = void 0;
const prisma_1 = require("../../../shared/prisma");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const getAllAdminsFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    user: {
                        email: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    user: {
                        phoneNumber: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    user: {
                        profile: {
                            fullName: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                    },
                },
            ],
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const whereCondition = andConditions.length
        ? { AND: andConditions }
        : {};
    const result = yield prisma_1.prisma.admin.findMany({
        skip,
        take: limit,
        orderBy: {
            user: {
                createdAt: sortOrder,
            },
        },
        where: whereCondition,
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
        },
    });
    const total = yield prisma_1.prisma.admin.count({
        where: whereCondition,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getAdminByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.admin.findUnique({
        where: { id },
        include: {
            user: {
                include: {
                    profile: true,
                },
            },
        },
    });
    return result;
});
const updateAdminIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma_1.prisma.admin.findUnique({
        where: { id },
    });
    if (!admin) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Admin not found');
    }
    const { profile, phoneNumber, email } = payload, adminData = __rest(payload, ["profile", "phoneNumber", "email"]);
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Update admin core data if any
        if (Object.keys(adminData).length > 0) {
            yield tx.admin.update({
                where: { id },
                data: adminData,
            });
        }
        // Update user phone / email
        const userData = {};
        if (phoneNumber)
            userData.phoneNumber = phoneNumber;
        if (email)
            userData.email = email;
        if (Object.keys(userData).length > 0) {
            yield tx.user.update({
                where: { id: admin.userId },
                data: userData,
            });
        }
        // Update profile
        if (profile) {
            yield tx.profile.update({
                where: { userId: admin.userId },
                data: profile,
            });
        }
        return yield tx.admin.findUnique({
            where: { id },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
    }));
    return result;
});
const deleteAdminFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma_1.prisma.admin.findUnique({
        where: { id },
    });
    if (!admin) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Admin not found');
    }
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Delete Admin relation
        const deletedAdmin = yield tx.admin.delete({
            where: { id },
        });
        // Delete Profile relation
        yield tx.profile.delete({
            where: { userId: admin.userId },
        });
        // Delete UserPermissions relations
        yield tx.userPermission.deleteMany({
            where: { userId: admin.userId },
        });
        // Delete User core account
        yield tx.user.delete({
            where: { id: admin.userId },
        });
        return deletedAdmin;
    }));
    return result;
});
exports.AdminServices = {
    getAllAdminsFromDB,
    getAdminByIdFromDB,
    updateAdminIntoDB,
    deleteAdminFromDB,
};
