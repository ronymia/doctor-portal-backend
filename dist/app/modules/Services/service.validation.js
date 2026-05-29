"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceValidations = void 0;
const zod_1 = require("zod");
const createServiceZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            message: 'Service name is required',
        }),
        description: zod_1.z.string({
            message: 'Service description is required',
        }),
        specializationId: zod_1.z.string({
            message: 'Specialization ID is required',
        }),
    }),
});
//
const updateServiceZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            message: 'Service name is required',
        })
            .optional(),
        description: zod_1.z
            .string({
            message: 'Service is required',
        })
            .optional(),
        specializationId: zod_1.z
            .string({
            message: 'Specialization ID is required',
        })
            .optional(),
    }),
});
exports.ServiceValidations = {
    createServiceZodSchema,
    updateServiceZodSchema,
};
