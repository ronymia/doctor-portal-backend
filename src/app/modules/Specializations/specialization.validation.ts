import { z } from 'zod';

const createSpecializationZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Specialization name is required',
      invalid_type_error: 'Specialization name must be string',
    }),
    description: z.string({
      required_error: 'Specialization is required',
      invalid_type_error: 'Specialization description must be string',
    }),
  }),
});
const updateSpecializationZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Specialization name is required',
        invalid_type_error: 'Specialization name must be string',
      })
      .optional(),
    description: z
      .string({
        required_error: 'Specialization is required',
        invalid_type_error: 'Specialization description must be string',
      })
      .optional(),
  }),
});

export const SpecializationValidations = {
  createSpecializationZodSchema,
  updateSpecializationZodSchema,
};
