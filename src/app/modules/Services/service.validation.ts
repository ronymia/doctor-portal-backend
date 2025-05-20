import { z } from "zod";

const createServiceZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Service name is required",
    }),
    description: z.string({
      required_error: "Service description is required",
    }),
    specialization_id: z.number({
      required_error: "Specialization ID is required",
    }),
  }),
});

//
const updateServiceZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Service name is required",
      })
      .optional(),
    description: z
      .string({
        required_error: "Service is required",
      })
      .optional(),
    specialization_id: z
      .number({
        required_error: "Specialization ID is required",
      })
      .optional(),
  }),
});

export const ServiceValidations = {
  createServiceZodSchema,
  updateServiceZodSchema,
};
