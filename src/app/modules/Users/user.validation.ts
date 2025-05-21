import { Gender } from '@prisma/client';
import { z } from 'zod';

// ADMIN
const createAdminZodSchema = z.object({
  email: z.string({
    required_error: 'email is required',
  }),
  phoneNumber: z.string({
    required_error: 'phoneNumber is required',
  }),
  password: z
    .string({
      required_error: 'password is required',
    })
    .optional(),
  profile: z.object({
    fullName: z.string({
      required_error: 'fullName is required',
    }),
    joiningDate: z.string({
      required_error: 'joiningDate is required',
    }),
    gender: z.enum(Object.values(Gender) as [string, ...string[]], {
      required_error: 'gender is required',
    }),
    address: z.string({
      required_error: 'address is required',
    }),
    dateOfBirth: z.string({
      required_error: 'dateOfBirth is required',
    }),
    profilePicture: z.string({
      required_error: 'profilePicture is required',
    }),
  }),
});

// EXPORT VALIDATION SCHEMAS
export const UserValidationSchemas = {
  createAdminZodSchema,
};
