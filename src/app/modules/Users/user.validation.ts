import { z } from "zod";

const createAdminZodSchema = z.object({
  body: z.object({
    full_name: z.string({
      required_error: "Admin name is required",
    }),
    profile_picture: z.string({
      required_error: "Admin is required",
    }),
    address: z.string({
      required_error: "Admin is required",
    }),
    date_of_birth: z.string({
      required_error: "Admin is required",
    }),
    joining_date: z.string({
      required_error: "Admin is required",
    }),
    gender: z.string({
      required_error: "Admin is required",
    }),
    medical_history: z.string({
      required_error: "Admin is required",
    }),
    emergency_contact: z.string({
      required_error: "Admin is required",
    }),
    profile_status: z.string({
      required_error: "Admin is required",
    }),
  }),
});

export const UserValidations = {
  createAdminZodSchema,
};
