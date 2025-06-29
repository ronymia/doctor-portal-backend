"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const appointment_controller_1 = require("./appointment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.route('/book-appointment').post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), 
// validateRequest(AppointmentControllers.createAppointmentZodSchema),
appointment_controller_1.AppointmentControllers.bookAppointmentIntoDB);
router.patch('/cancel-appointment/:id', appointment_controller_1.AppointmentControllers.cancelAppointment);
router.patch('/start-appointment/:id', appointment_controller_1.AppointmentControllers.startAppointment);
router.patch('/finish-appointment/:id', appointment_controller_1.AppointmentControllers.finishAppointment);
router.route('/').get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), 
// validateRequest(AppointmentControllers.createAppointmentZodSchema),
appointment_controller_1.AppointmentControllers.getAllAppointments);
router.route('/:id').get((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), 
// validateRequest(AppointmentControllers.createAppointmentZodSchema),
appointment_controller_1.AppointmentControllers.getAppointmentById);
router.route('/:id').patch((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), 
// validateRequest(AppointmentControllers.createAppointmentZodSchema),
appointment_controller_1.AppointmentControllers.updateAppointment);
router.route('/:id').delete((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), 
// validateRequest(AppointmentControllers.createAppointmentZodSchema),
appointment_controller_1.AppointmentControllers.deleteAppointment);
// EXPORT
exports.AppointmentRoutes = router;
