import { z } from "zod";

const createTimeSlotZodSchema = z.object({
  body: z.object({
    start_time: z.string({
      required_error: "Start Time is required",
    }),
    end_time: z.string({
      required_error: "End Time is required",
    }),
  }),
});

//
const updateTimeSlotZodSchema = z.object({
  body: z.object({
    start_time: z
      .string({
        required_error: "Start Time is required",
      })
      .optional(),
    end_time: z
      .string({
        required_error: "End Time is required",
      })
      .optional(),
  }),
});

export const TimeSlotValidations = {
  createTimeSlotZodSchema,
  updateTimeSlotZodSchema,
};
