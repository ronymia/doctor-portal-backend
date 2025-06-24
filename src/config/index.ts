import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const environmentZodSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z
    .string()
    .default('4000')
    .refine((val) => !isNaN(Number(val)), {
      message: 'PORT must be a valid number',
    })
    .transform(Number),
  DATABASE_URL: z.string(),
  DEFAULT_ADMIN_PASS: z.string(),
  DEFAULT_DOCTOR_PASS: z.string(),
  DEFAULT_PATIENT_PASS: z.string(),
  BCRYPT_SALT_ROUNDS: z
    .string()
    .default('12')
    .refine((val) => !isNaN(Number(val)), {
      message: 'BCRYPT_SALT_ROUNDS must be a valid number',
    })
    .transform(Number),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
});

const envVariables = environmentZodSchema.parse(process.env);

export default {
  node_env: envVariables.NODE_ENV,
  port: envVariables.PORT,
  database_url: envVariables.DATABASE_URL,
  default_admin_pass: envVariables.DEFAULT_ADMIN_PASS,
  default_doctor_pass: envVariables.DEFAULT_DOCTOR_PASS,
  default_patient_pass: envVariables.DEFAULT_PATIENT_PASS,
  bcrypt_salt_rounds: envVariables.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: envVariables.JWT_SECRET,
    refresh_secret: envVariables.JWT_REFRESH_SECRET,
    expires_in: envVariables.JWT_EXPIRES_IN,
    refresh_expires_in: envVariables.JWT_REFRESH_EXPIRES_IN,
  },
};
