"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableServiceValidations = void 0;
const zod_1 = require("zod");
const createAvailableServiceZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        start_time: zod_1.z.string({
            message: "Start Time is required",
        }),
        end_time: zod_1.z.string({
            message: "End Time is required",
        }),
    }),
});
//
const updateAvailableServiceZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        start_time: zod_1.z
            .string({
            message: "Start Time is required",
        })
            .optional(),
        end_time: zod_1.z
            .string({
            message: "End Time is required",
        })
            .optional(),
    }),
});
exports.AvailableServiceValidations = {
    createAvailableServiceZodSchema,
    updateAvailableServiceZodSchema,
};
