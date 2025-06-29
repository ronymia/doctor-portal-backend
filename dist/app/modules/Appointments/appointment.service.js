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
exports.AppointmentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("@prisma/client");
const prisma_1 = require("../../../shared/prisma");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const appointment_constant_1 = require("./appointment.constant");
// INSERT TO DATABASE
const createAppointmentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.appointment.create({
        data: payload,
    });
    return result;
});
// book an appointment
const bookAppointmentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, availableServiceId, appointmentDate } = payload;
    // Check if the patient exists
    const patient = yield prisma_1.prisma.patient.findUnique({
        where: { id: patientId },
    });
    if (!patient) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Patient not found');
    }
    // Check if the available service exists
    const availableService = yield prisma_1.prisma.availableService.findUnique({
        where: { id: availableServiceId },
        include: { service: true },
    });
    if (!availableService) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Available service not found');
    }
    // Check if the appointment date is in the future
    if (appointmentDate <= new Date()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Appointment date must be in the future');
    }
    // Create the appointment
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // BOOK APPOINTMENT
        const appointment = yield transactionClient.appointment.create({
            data: {
                patientId: patientId,
                availableServiceId: availableServiceId,
                appointmentDate: appointmentDate,
                status: client_1.AppointmentStatus.SCHEDULED,
            },
        });
        // Update the available service's status to 'booked'
        yield transactionClient.availableService.update({
            where: { id: availableServiceId },
            data: {
                availableSeats: availableService.availableSeats - 1,
                isBooked: availableService.availableSeats - 1 === 0 ? true : false,
            },
        });
        // create payment record
        const payment = yield transactionClient.payment.create({
            data: {
                appointmentId: appointment.id,
                amount: availableService.fees,
                paymentStatus: client_1.PaymentStatus.PENDING,
                paymentDate: null, // Payment date will be updated once payment is completed
            },
        });
        return { appointment, payment };
    }));
    return result;
});
const cancelAppointment = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield prisma_1.prisma.appointment.findUnique({
        where: {
            id: appointmentId,
        },
    });
    if (!appointment) {
        throw new Error('Appointment does not exist');
    }
    if (appointment.status === client_1.AppointmentStatus.CANCELLED) {
        throw new Error('Appointment has already been cancelled');
    }
    if (appointment.status === client_1.AppointmentStatus.COMPLETED) {
        throw new Error('Appointment has already been completed');
    }
    const cancelledAppointment = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const appointmentToCancel = yield transactionClient.appointment.update({
            where: {
                id: appointmentId,
            },
            data: {
                status: client_1.AppointmentStatus.CANCELLED,
            },
        });
        const availableService = yield transactionClient.availableService.findUnique({
            where: {
                id: appointment.availableServiceId,
            },
        });
        yield transactionClient.availableService.update({
            where: {
                id: appointment.availableServiceId,
            },
            data: {
                availableSeats: {
                    increment: 1,
                },
                isBooked: availableService && availableService.availableSeats + 1 > 0
                    ? false
                    : true,
            },
        });
        yield transactionClient.payment.updateMany({
            where: {
                appointmentId: appointmentId,
            },
            data: {
                paymentStatus: client_1.PaymentStatus.CANCELLED,
            },
        });
        return {
            appointment: appointmentToCancel,
        };
    }));
    return cancelledAppointment;
});
const startAppointment = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield prisma_1.prisma.appointment.findUnique({
        where: {
            id: appointmentId,
        },
    });
    if (!appointment) {
        throw new Error('Appointment does not exist');
    }
    if (appointment.status === client_1.AppointmentStatus.CANCELLED) {
        throw new Error('Appointment has already been cancelled');
    }
    if (appointment.status === client_1.AppointmentStatus.COMPLETED) {
        throw new Error('Appointment has already been completed');
    }
    const startedAppointment = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.payment.updateMany({
            where: {
                appointmentId,
            },
            data: {
                paymentStatus: client_1.PaymentStatus.PAID,
                paymentDate: new Date().toISOString(),
            },
        });
        const appointmentToStart = yield transactionClient.appointment.update({
            where: {
                id: appointmentId,
            },
            data: {
                status: client_1.AppointmentStatus.PENDING_PAYMENT,
            },
        });
        if (!appointmentToStart) {
            yield transactionClient.payment.updateMany({
                where: {
                    appointmentId,
                },
                data: {
                    paymentStatus: client_1.PaymentStatus.REFUNDED,
                },
            });
        }
        return appointmentToStart;
    }));
    return startedAppointment;
});
const finishAppointment = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield prisma_1.prisma.appointment.findUnique({
        where: {
            id: appointmentId,
        },
    });
    if (!appointment) {
        throw new Error('Appointment does not exist');
    }
    if (appointment.status === client_1.AppointmentStatus.CANCELLED) {
        throw new Error('Appointment has already been cancelled');
    }
    if (appointment.status === client_1.AppointmentStatus.COMPLETED) {
        throw new Error('Appointment has already been completed');
    }
    const appointmentToFinish = yield prisma_1.prisma.appointment.update({
        where: {
            id: appointmentId,
        },
        data: {
            status: client_1.AppointmentStatus.COMPLETED,
        },
    });
    return appointmentToFinish;
});
// GET BY ID FROM DATABASE
const getAppointmentByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.appointment.findUnique({
        where: { id },
    });
    return result;
});
// GET ALL FROM DATABASE
const getAllAppointmentsFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract SearchTerm to implement search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    // Search and filter condition
    const andConditions = [];
    // Search in Field
    if (searchTerm) {
        andConditions.push({
            OR: appointment_constant_1.appointmentSearchableFields.map((field) => ({
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
    const result = yield prisma_1.prisma.appointment.findMany({
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereCondition,
    });
    // total count
    const totalCount = yield prisma_1.prisma.appointment.count();
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
// UPDATE INTO DATABASE
const updateAppointmentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF SPECIALIZATION EXISTS
    const isExist = yield prisma_1.prisma.appointment.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Appointment not found');
    }
    const result = yield prisma_1.prisma.appointment.update({
        where: { id },
        data: payload,
    });
    return result;
});
// DELETE FROM DATABASE
const deleteAppointmentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // CHECK IF SPECIALIZATION EXISTS
    const isExist = yield prisma_1.prisma.appointment.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Appointment not found');
    }
    // DELETE FROM DATABASE
    const result = yield prisma_1.prisma.appointment.delete({
        where: { id },
    });
    return result;
});
exports.AppointmentServices = {
    bookAppointmentIntoDB,
    cancelAppointment,
    startAppointment,
    finishAppointment,
    createAppointmentIntoDB,
    getAppointmentByIdFromDB,
    getAllAppointmentsFromDB,
    updateAppointmentIntoDB,
    deleteAppointmentFromDB,
};
