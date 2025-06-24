import { z } from 'zod';

// CREATE
const createTimeSlotZodSchema = z.object({
  body: z.object({
    startTime: z.string({
      required_error: 'Start Time is required',
    }),
    endTime: z.string({
      required_error: 'End Time is required',
    }),
  }),
});

// UPDATE
const updateTimeSlotZodSchema = z.object({
  body: z.object({
    startTime: z
      .string({
        required_error: 'Start Time is required',
      })
      .optional(),
    endTime: z
      .string({
        required_error: 'End Time is required',
      })
      .optional(),
  }),
});

// EXPORT
export const TimeSlotValidations = {
  createTimeSlotZodSchema,
  updateTimeSlotZodSchema,
};
