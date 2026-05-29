import { z } from 'zod';

const createSpecializationZodSchema = z.object({
  body: z.object({
    name: z.string({
      message: 'Specialization name is required',
    }),
    description: z.string({
      message: 'Specialization description is required',
    }),
  }),
});
const updateSpecializationZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: 'Specialization name must be string',
      })
      .optional(),
    description: z
      .string({
        message: 'Specialization description must be string',
      })
      .optional(),
  }),
});

export const SpecializationValidations = {
  createSpecializationZodSchema,
  updateSpecializationZodSchema,
};
