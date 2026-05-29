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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePatientId = exports.findLastPatientId = exports.generateDoctorId = exports.findLastDoctorId = exports.generateAdminId = exports.findLastAdminId = void 0;
const user_1 = require("../../../enums/user");
const prisma_1 = require("../../../shared/prisma");
const findLastAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastAdmin = yield prisma_1.prisma.user.findFirst({
        where: { role: user_1.ENUM_USER_ROLE.ADMIN },
        orderBy: { createdAt: 'desc' },
    });
    return (lastAdmin === null || lastAdmin === void 0 ? void 0 : lastAdmin.id) ? lastAdmin.id.substring(2) : undefined;
});
exports.findLastAdminId = findLastAdminId;
const generateAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentId = (yield (0, exports.findLastAdminId)()) || '00000';
    const incrementedId = `A-${(Number(currentId) + 1).toString().padStart(5, '0')}`;
    return incrementedId;
});
exports.generateAdminId = generateAdminId;
const findLastDoctorId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastDoctor = yield prisma_1.prisma.user.findFirst({
        where: { role: user_1.ENUM_USER_ROLE.DOCTOR },
        orderBy: { createdAt: 'desc' },
    });
    return (lastDoctor === null || lastDoctor === void 0 ? void 0 : lastDoctor.id) ? lastDoctor.id.substring(2) : undefined;
});
exports.findLastDoctorId = findLastDoctorId;
const generateDoctorId = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentId = (yield (0, exports.findLastDoctorId)()) || '00000';
    const incrementedId = `D-${(Number(currentId) + 1).toString().padStart(5, '0')}`;
    return incrementedId;
});
exports.generateDoctorId = generateDoctorId;
const findLastPatientId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastPatient = yield prisma_1.prisma.user.findFirst({
        where: { role: user_1.ENUM_USER_ROLE.PATIENT },
        orderBy: { createdAt: 'desc' },
    });
    return (lastPatient === null || lastPatient === void 0 ? void 0 : lastPatient.id) ? lastPatient.id.substring(2) : undefined;
});
exports.findLastPatientId = findLastPatientId;
const generatePatientId = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentId = (yield (0, exports.findLastPatientId)()) || '00000';
    const incrementedId = `P-${(Number(currentId) + 1).toString().padStart(5, '0')}`;
    return incrementedId;
});
exports.generatePatientId = generatePatientId;
