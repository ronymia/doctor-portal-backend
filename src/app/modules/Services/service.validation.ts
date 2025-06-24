import { z } from 'zod';

const createServiceZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Service name is required',
    }),
    description: z.string({
      required_error: 'Service description is required',
    }),
    specializationId: z.string({
      required_error: 'Specialization ID is required',
    }),
  }),
});

//
const updateServiceZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Service name is required',
      })
      .optional(),
    description: z
      .string({
        required_error: 'Service is required',
      })
      .optional(),
    specializationId: z
      .string({
        required_error: 'Specialization ID is required',
      })
      .optional(),
  }),
});

export const ServiceValidations = {
  createServiceZodSchema,
  updateServiceZodSchema,
};
