"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const patient_controller_1 = require("./patient.controller");
const router = express_1.default.Router();
router.route('/').get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), 
// validateRequest(AppointmentControllers.createAppointmentZodSchema),
patient_controller_1.PatientControllers.getAllPatientsFromDB);
exports.PatientRoutes = router;
