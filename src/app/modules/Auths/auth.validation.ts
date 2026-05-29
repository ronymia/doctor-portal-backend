import { z } from 'zod';

// LOGIN USER
const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'email field is required' })
      .min(1, { message: 'Please provide an email' }),
    password: z
      .string({ message: 'Password field is required' })
      .min(1, { message: 'Please provide a password' }),
  }),
});

// REFRESH TOKEN
const refreshTokenZodSchema = z.object({
  cookie: z.object({
    refresh_token: z.string({
      message: 'Refresh Token is required',
    }),
  }),
});

// CHANGE PASSWORD
const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      message: 'Old password  is required',
    }),
    newPassword: z.string({
      message: 'New password  is required',
    }),
  }),
});

// EXPORT
export const AuthValidations = {
  loginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema,
};
