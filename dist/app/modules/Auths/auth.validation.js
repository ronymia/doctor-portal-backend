"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const zod_1 = require("zod");
// LOGIN USER
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: 'email field is required' })
            .min(1, { message: 'Please provide an email' }),
        password: zod_1.z
            .string({ required_error: 'Password field is required' })
            .min(1, { message: 'Please provide a password' }),
    }),
});
// REFRESH TOKEN
const refreshTokenZodSchema = zod_1.z.object({
    cookie: zod_1.z.object({
        refresh_token: zod_1.z.string({
            required_error: 'Refresh Token is required',
        }),
    }),
});
// CHANGE PASSWORD
const changePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: 'Old password  is required',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New password  is required',
        }),
    }),
});
// EXPORT
exports.AuthValidations = {
    loginZodSchema,
    refreshTokenZodSchema,
    changePasswordZodSchema,
};
