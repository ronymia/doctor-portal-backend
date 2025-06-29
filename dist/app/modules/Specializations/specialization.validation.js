"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecializationValidations = void 0;
const zod_1 = require("zod");
const createSpecializationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Specialization name is required',
            invalid_type_error: 'Specialization name must be string',
        }),
        description: zod_1.z.string({
            required_error: 'Specialization is required',
            invalid_type_error: 'Specialization description must be string',
        }),
    }),
});
const updateSpecializationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Specialization name is required',
            invalid_type_error: 'Specialization name must be string',
        })
            .optional(),
        description: zod_1.z
            .string({
            required_error: 'Specialization is required',
            invalid_type_error: 'Specialization description must be string',
        })
            .optional(),
    }),
});
exports.SpecializationValidations = {
    createSpecializationZodSchema,
    updateSpecializationZodSchema,
};
