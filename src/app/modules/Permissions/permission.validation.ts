import { z } from 'zod';

const createPermissionZodSchema = z.object({
  body: z.object({
    name: z.string({
      message: 'Permission name is required',
    }),
  }),
});
const updatePermissionZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: 'Permission name must be string',
      })
      .optional(),
  }),
});

export const PermissionValidations = {
  createPermissionZodSchema,
  updatePermissionZodSchema,
};
