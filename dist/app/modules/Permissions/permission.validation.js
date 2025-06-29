"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionValidations = void 0;
const zod_1 = require("zod");
const createPermissionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Permission name is required',
            invalid_type_error: 'Permission name must be string',
        }),
    }),
});
const updatePermissionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Permission name is required',
            invalid_type_error: 'Permission name must be string',
        })
            .optional(),
    }),
});
exports.PermissionValidations = {
    createPermissionZodSchema,
    updatePermissionZodSchema,
};
