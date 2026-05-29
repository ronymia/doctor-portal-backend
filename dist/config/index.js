"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
const environmentZodSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.string(),
    PORT: zod_1.z
        .string()
        .default('4000')
        .refine((val) => !isNaN(Number(val)), {
        message: 'PORT must be a valid number',
    })
        .transform(Number),
    DATABASE_URL: zod_1.z.string(),
    DEFAULT_ADMIN_PASS: zod_1.z.string(),
    DEFAULT_DOCTOR_PASS: zod_1.z.string(),
    DEFAULT_PATIENT_PASS: zod_1.z.string(),
    BCRYPT_SALT_ROUNDS: zod_1.z
        .string()
        .default('12')
        .refine((val) => !isNaN(Number(val)), {
        message: 'BCRYPT_SALT_ROUNDS must be a valid number',
    })
        .transform(Number),
    JWT_SECRET: zod_1.z.string(),
    JWT_REFRESH_SECRET: zod_1.z.string(),
    JWT_EXPIRES_IN: zod_1.z.string(),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string(),
});
const envVariables = environmentZodSchema.parse(process.env);
exports.default = {
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
