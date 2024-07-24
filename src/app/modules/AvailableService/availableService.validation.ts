import { z } from "zod";

const createAvailableServiceZodSchema = z.object({
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
const updateAvailableServiceZodSchema = z.object({
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

export const AvailableServiceValidations = {
  createAvailableServiceZodSchema,
  updateAvailableServiceZodSchema,
};
