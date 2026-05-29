import { z } from 'zod';

const updateAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
    profile: z.object({
      fullName: z.string().optional(),
      address: z.string().optional(),
      dateOfBirth: z.string().optional(),
      joiningDate: z.string().optional(),
      gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
      profilePicture: z.string().optional(),
    }).optional(),
  }),
});

export const AdminValidations = {
  updateAdminZodSchema,
};
