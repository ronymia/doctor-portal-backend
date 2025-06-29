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
exports.UserControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_service_1 = require("./user.service");
const passwordHelpers_1 = require("../../../helpers/passwordHelpers");
const config_1 = __importDefault(require("../../../config"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const user_constant_1 = require("./user.constant");
// CREATE CONTROLLER FN
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadData = __rest(req.body, []); //COPY
    if ('password' in payloadData) {
        payloadData.password = yield passwordHelpers_1.PasswordHelpers.passwordHash(payloadData.password);
    }
    else {
        payloadData.password = yield passwordHelpers_1.PasswordHelpers.passwordHash(config_1.default.default_doctor_pass);
    }
    //SEND DATA TO BUSINESS LOGIC
    const result = yield user_service_1.UserServices.createAdminIntoDB(payloadData);
    //SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Admin created Successfully',
        data: result,
    });
}));
// CREATE CONTROLLER FN
const createDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadData = __rest(req.body, []); //COPY
    if ('password' in payloadData) {
        payloadData.password = yield passwordHelpers_1.PasswordHelpers.passwordHash(payloadData.password);
    }
    else {
        payloadData.password = yield passwordHelpers_1.PasswordHelpers.passwordHash(config_1.default.default_doctor_pass);
    }
    //SEND DATA TO BUSINESS LOGIC
    const result = yield user_service_1.UserServices.createDoctorIntoDB(payloadData);
    //SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Doctor created Successfully',
        data: result,
    });
}));
// CREATE CONTROLLER FN
const createPatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadData = __rest(req.body, []); //COPY
    if ('password' in payloadData) {
        payloadData.password = yield passwordHelpers_1.PasswordHelpers.passwordHash(payloadData.password);
    }
    else {
        payloadData.password = yield passwordHelpers_1.PasswordHelpers.passwordHash(config_1.default.default_doctor_pass);
    }
    //SEND DATA TO BUSINESS LOGIC
    const result = yield user_service_1.UserServices.createPatientIntoDB(payloadData);
    //SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Patient created Successfully',
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, user_constant_1.userFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    //SEND DATA TO BUSINESS LOGIC
    const result = yield user_service_1.UserServices.getAllUsersFromDB(filters, paginationOptions);
    //SEND RESPONSE
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users fetched Successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// EXPORT
exports.UserControllers = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUsers,
};
