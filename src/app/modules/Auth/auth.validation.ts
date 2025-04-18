import { z } from 'zod';

// LOGIN USER
const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'email field is required' })
      .min(1, { message: 'Please provide an email' }),
    password: z
      .string({ required_error: 'Password field is required' })
      .min(1, { message: 'Please provide a password' }),
  }),
});

// REFRESH TOKEN
const refreshTokenZodSchema = z.object({
  cookie: z.object({
    refresh_token: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

// CHANGE PASSWORD
const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password  is required',
    }),
    newPassword: z.string({
      required_error: 'New password  is required',
    }),
  }),
});

// EXPORT
export const AuthValidations = {
  loginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema,
};
