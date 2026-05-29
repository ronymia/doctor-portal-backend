"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_PERMISSIONS = exports.ENUM_USER_PERMISSION = void 0;
var ENUM_USER_PERMISSION;
(function (ENUM_USER_PERMISSION) {
    // Admin Management
    ENUM_USER_PERMISSION["ADMIN_CREATE"] = "admin.create";
    ENUM_USER_PERMISSION["ADMIN_UPDATE"] = "admin.update";
    ENUM_USER_PERMISSION["ADMIN_DELETE"] = "admin.delete";
    ENUM_USER_PERMISSION["ADMIN_LIST"] = "admin.list";
    ENUM_USER_PERMISSION["ADMIN_DETAILS"] = "admin.details";
    // Doctor Management
    ENUM_USER_PERMISSION["DOCTOR_CREATE"] = "doctor.create";
    ENUM_USER_PERMISSION["DOCTOR_UPDATE"] = "doctor.update";
    ENUM_USER_PERMISSION["DOCTOR_LIST"] = "doctor.list";
    ENUM_USER_PERMISSION["DOCTOR_APPROVE"] = "doctor.approve";
    // Patient Management
    ENUM_USER_PERMISSION["PATIENT_LIST"] = "patient.list";
    ENUM_USER_PERMISSION["PATIENT_MANAGE"] = "patient.manage";
    // Timeslot Management
    ENUM_USER_PERMISSION["TIMESLOT_CREATE"] = "timeslot.create";
    ENUM_USER_PERMISSION["TIMESLOT_UPDATE"] = "timeslot.update";
    ENUM_USER_PERMISSION["TIMESLOT_DELETE"] = "timeslot.delete";
    ENUM_USER_PERMISSION["TIMESLOT_LIST"] = "timeslot.list";
    // Appointment Management
    ENUM_USER_PERMISSION["APPOINTMENT_MANAGE"] = "appointment.manage";
    ENUM_USER_PERMISSION["APPOINTMENT_LIST"] = "appointment.list";
    // Permission Management
    ENUM_USER_PERMISSION["PERMISSION_ASSIGN"] = "permission.assign";
    ENUM_USER_PERMISSION["PERMISSION_REMOVE"] = "permission.remove";
    ENUM_USER_PERMISSION["PERMISSION_LIST"] = "permission.list";
    // Services & Specializations
    ENUM_USER_PERMISSION["SPECIALIZATION_MANAGE"] = "specialization.manage";
    ENUM_USER_PERMISSION["SERVICE_MANAGE"] = "service.manage";
})(ENUM_USER_PERMISSION || (exports.ENUM_USER_PERMISSION = ENUM_USER_PERMISSION = {}));
exports.ALL_PERMISSIONS = Object.values(ENUM_USER_PERMISSION);
