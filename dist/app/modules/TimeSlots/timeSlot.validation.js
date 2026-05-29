"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotValidations = void 0;
const zod_1 = require("zod");
// CREATE
const createTimeSlotZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        startTime: zod_1.z.string({
            message: 'Start Time is required',
        }),
        endTime: zod_1.z.string({
            message: 'End Time is required',
        }),
    }),
});
// UPDATE
const updateTimeSlotZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        startTime: zod_1.z
            .string({
            message: 'Start Time is required',
        })
            .optional(),
        endTime: zod_1.z
            .string({
            message: 'End Time is required',
        })
            .optional(),
    }),
});
// EXPORT
exports.TimeSlotValidations = {
    createTimeSlotZodSchema,
    updateTimeSlotZodSchema,
};
