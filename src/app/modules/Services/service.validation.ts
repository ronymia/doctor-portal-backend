import { z } from 'zod';

const createServiceZodSchema = z.object({
  body: z.object({
    name: z.string({
      message: 'Service name is required',
    }),
    description: z.string({
      message: 'Service description is required',
    }),
    specializationId: z.string({
      message: 'Specialization ID is required',
    }),
  }),
});

//
const updateServiceZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: 'Service name is required',
      })
      .optional(),
    description: z
      .string({
        message: 'Service is required',
      })
      .optional(),
    specializationId: z
      .string({
        message: 'Specialization ID is required',
      })
      .optional(),
  }),
});

export const ServiceValidations = {
  createServiceZodSchema,
  updateServiceZodSchema,
};
