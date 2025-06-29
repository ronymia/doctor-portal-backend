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
exports.AppointmentControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const appointment_service_1 = require("./appointment.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const appointment_constant_1 = require("./appointment.constant");
const pagination_1 = require("../../../constants/pagination");
// CREATE CONTROLLER FN
const bookAppointmentIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadData = __rest(req.body, []); //COPY
    // SEND DATA TO BUSINESS LOGIC
    const result = yield appointment_service_1.AppointmentServices.bookAppointmentIntoDB(payloadData);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Appointment Booked Successfully',
        data: result,
    });
}));
// CREATE CONTROLLER FN
const cancelAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; //COPY
    // SEND DATA TO BUSINESS LOGIC
    const result = yield appointment_service_1.AppointmentServices.cancelAppointment(id);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Appointment Cancelled Successfully',
        data: result,
    });
}));
// CREATE CONTROLLER FN
const startAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; //COPY
    // SEND DATA TO BUSINESS LOGIC
    const result = yield appointment_service_1.AppointmentServices.startAppointment(id);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Appointment Started Successfully',
        data: result,
    });
}));
// CREATE CONTROLLER FN
const finishAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; //COPY
    // SEND DATA TO BUSINESS LOGIC
    const result = yield appointment_service_1.AppointmentServices.finishAppointment(id);
    // SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Appointment Finished Successfully',
        data: result,
    });
}));
// GET BY ID  CONTROLLER FN
const getAppointmentById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = yield appointment_service_1.AppointmentServices.getAppointmentByIdFromDB(id);
    //SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Appointment retrieved Successfully',
        data: result,
    });
}));
// GET BY ID  CONTROLLER FN
const getAllAppointments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, appointment_constant_1.appointmentFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    //SEND DATA TO BUSINESS LOGIC
    const result = yield appointment_service_1.AppointmentServices.getAllAppointmentsFromDB(filters, paginationOptions);
    //SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Appointment fetch Successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// UPDATE CONTROLLER FUNCTION
const updateAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; //COPY
    const payloadData = __rest(req.body, []);
    //SEND DATA TO BUSINESS LOGIC
    const result = yield appointment_service_1.AppointmentServices.updateAppointmentIntoDB(id, payloadData);
    //SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Appointment update Successfully',
        data: result,
    });
}));
// DELETE CONTROLLER FUNCTION
const deleteAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; //COPY
    //SEND DATA TO BUSINESS LOGIC
    const result = yield appointment_service_1.AppointmentServices.deleteAppointmentFromDB(id);
    //SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Appointment Delete Successfully',
        data: result,
    });
}));
exports.AppointmentControllers = {
    bookAppointmentIntoDB,
    cancelAppointment,
    startAppointment,
    finishAppointment,
    getAppointmentById,
    getAllAppointments,
    updateAppointment,
    deleteAppointment,
};
