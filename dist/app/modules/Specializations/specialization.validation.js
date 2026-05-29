"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecializationValidations = void 0;
const zod_1 = require("zod");
const createSpecializationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            message: 'Specialization name is required',
        }),
        description: zod_1.z.string({
            message: 'Specialization description is required',
        }),
    }),
});
const updateSpecializationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            message: 'Specialization name must be string',
        })
            .optional(),
        description: zod_1.z
            .string({
            message: 'Specialization description must be string',
        })
            .optional(),
    }),
});
exports.SpecializationValidations = {
    createSpecializationZodSchema,
    updateSpecializationZodSchema,
};
