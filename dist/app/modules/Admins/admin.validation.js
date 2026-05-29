"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidations = void 0;
const zod_1 = require("zod");
const updateAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        profile: zod_1.z.object({
            fullName: zod_1.z.string().optional(),
            address: zod_1.z.string().optional(),
            dateOfBirth: zod_1.z.string().optional(),
            joiningDate: zod_1.z.string().optional(),
            gender: zod_1.z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
            profilePicture: zod_1.z.string().optional(),
        }).optional(),
    }),
});
exports.AdminValidations = {
    updateAdminZodSchema,
};
