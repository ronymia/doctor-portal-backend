"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const specialization_route_1 = require("../modules/Specializations/specialization.route");
const permission_route_1 = require("../modules/Permissions/permission.route");
const user_route_1 = require("../modules/Users/user.route");
const auth_route_1 = require("../modules/Auths/auth.route");
const service_route_1 = require("../modules/Services/service.route");
const timeSlot_route_1 = require("../modules/TimeSlots/timeSlot.route");
const availableService_route_1 = require("../modules/AvailableServices/availableService.route");
const appointment_route_1 = require("../modules/Appointments/appointment.route");
const errorLog_route_1 = require("../modules/ErrorLog/errorLog.route");
const patient_route_1 = require("../modules/Patients/patient.route");
const availableDoctor_route_1 = require("../modules/AvailableDoctors/availableDoctor.route");
const admin_route_1 = require("../modules/Admins/admin.route");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: '/v1.0/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/error-logs',
        route: errorLog_route_1.errorRoutes,
    },
    {
        path: '/v1.0/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/v1.0/admins',
        route: admin_route_1.AdminRoutes,
    },
    {
        path: '/v1.0/patients',
        route: patient_route_1.PatientRoutes,
    },
    {
        path: '/permissions',
        route: permission_route_1.PermissionRoutes,
    },
    {
        path: '/v1.0/specializations',
        route: specialization_route_1.SpecializationRoutes,
    },
    {
        path: '/v1.0/services',
        route: service_route_1.ServiceRoutes,
    },
    // {
    //   path: '/v1.0/doctor-schedules',
    //   route: DoctorScheduleRoutes,
    // },
    {
        path: '/v1.0/time-slots',
        route: timeSlot_route_1.TimeSlotRoutes,
    },
    {
        path: '/v1.0/available-doctors',
        route: availableDoctor_route_1.AvailableDoctorRoutes,
    },
    {
        path: '/v1.0/available-services',
        route: availableService_route_1.AvailableServiceRoutes,
    },
    {
        path: '/v1.0/appointments',
        route: appointment_route_1.AppointmentRoutes,
    },
];
// routes
moduleRoutes.forEach(({ path, route }) => router.use(path, route));
exports.default = router;
