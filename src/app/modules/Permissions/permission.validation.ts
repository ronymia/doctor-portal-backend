import { z } from 'zod';

const createPermissionZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Permission name is required',
      invalid_type_error: 'Permission name must be string',
    }),
  }),
});
const updatePermissionZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Permission name is required',
        invalid_type_error: 'Permission name must be string',
      })
      .optional(),
  }),
});

export const PermissionValidations = {
  createPermissionZodSchema,
  updatePermissionZodSchema,
};
