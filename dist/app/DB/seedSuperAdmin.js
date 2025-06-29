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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../../config"));
const user_1 = require("../../enums/user");
const passwordHelpers_1 = require("../../helpers/passwordHelpers");
const prisma_1 = require("../../shared/prisma");
function seedSuperAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        //
        const superAdminData = {
            // id: ENUM_USER_ROLE.SUPER_ADMIN,
            email: 'mdronymia040@gmail.com',
            password: yield passwordHelpers_1.PasswordHelpers.passwordHash(config_1.default.default_admin_pass),
            role: user_1.ENUM_USER_ROLE.SUPER_ADMIN,
            phoneNumber: '01321185989',
            isPasswordResetRequired: false,
            status: client_1.UserAccountStatus.ACTIVE,
        };
        // CHECK SUPER ADMIN
        const superAdmin = yield prisma_1.prisma.user.findFirst({
            where: {
                role: user_1.ENUM_USER_ROLE.SUPER_ADMIN,
            },
        });
        // IF NOT THEN CREATE
        if (!superAdmin) {
            yield prisma_1.prisma.user.create({
                data: superAdminData,
            });
        }
    });
}
exports.default = seedSuperAdmin;
