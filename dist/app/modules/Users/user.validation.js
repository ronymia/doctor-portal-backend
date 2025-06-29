"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidationSchemas = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// ADMIN
const createAdminZodSchema = zod_1.z.object({
    email: zod_1.z.string({
        required_error: 'email is required',
    }),
    phoneNumber: zod_1.z.string({
        required_error: 'phoneNumber is required',
    }),
    password: zod_1.z
        .string({
        required_error: 'password is required',
    })
        .optional(),
    profile: zod_1.z.object({
        fullName: zod_1.z.string({
            required_error: 'fullName is required',
        }),
        joiningDate: zod_1.z.string({
            required_error: 'joiningDate is required',
        }),
        gender: zod_1.z.enum(Object.values(client_1.Gender), {
            required_error: 'gender is required',
        }),
        address: zod_1.z.string({
            required_error: 'address is required',
        }),
        dateOfBirth: zod_1.z.string({
            required_error: 'dateOfBirth is required',
        }),
        profilePicture: zod_1.z.string({
            required_error: 'profilePicture is required',
        }),
    }),
});
// ADMIN
const createDoctorZodSchema = zod_1.z.object({
    email: zod_1.z.string({
        required_error: 'email is required',
    }),
    phoneNumber: zod_1.z.string({
        required_error: 'phoneNumber is required',
    }),
    password: zod_1.z
        .string({
        required_error: 'password is required',
    })
        .optional(),
    doctor: zod_1.z.object({
        specializationId: zod_1.z.string({
            required_error: 'specializationId is required',
        }),
        qualification: zod_1.z.string({
            required_error: 'qualification is required',
        }),
    }),
    profile: zod_1.z.object({
        fullName: zod_1.z.string({
            required_error: 'fullName is required',
        }),
        joiningDate: zod_1.z.string({
            required_error: 'joiningDate is required',
        }),
        gender: zod_1.z.enum(Object.values(client_1.Gender), {
            required_error: 'gender is required',
        }),
        address: zod_1.z.string({
            required_error: 'address is required',
        }),
        dateOfBirth: zod_1.z.string({
            required_error: 'dateOfBirth is required',
        }),
        profilePicture: zod_1.z.string({
            required_error: 'profilePicture is required',
        }),
    }),
});
// PATIENT
const createPatientZodSchema = zod_1.z.object({
    email: zod_1.z.string({
        required_error: 'email is required',
    }),
    phoneNumber: zod_1.z.string({
        required_error: 'phoneNumber is required',
    }),
    password: zod_1.z
        .string({
        required_error: 'password is required',
    })
        .optional(),
    patient: zod_1.z.object({
        medicalHistory: zod_1.z.string({
            required_error: 'medicalHistory is required',
        }),
        emergencyContact: zod_1.z.string({
            required_error: 'emergencyContact is required',
        }),
    }),
    profile: zod_1.z.object({
        fullName: zod_1.z.string({
            required_error: 'fullName is required',
        }),
        joiningDate: zod_1.z.string({
            required_error: 'joiningDate is required',
        }),
        gender: zod_1.z.enum(Object.values(client_1.Gender), {
            required_error: 'gender is required',
        }),
        address: zod_1.z.string({
            required_error: 'address is required',
        }),
        dateOfBirth: zod_1.z.string({
            required_error: 'dateOfBirth is required',
        }),
        profilePicture: zod_1.z.string({
            required_error: 'profilePicture is required',
        }),
    }),
});
// EXPORT VALIDATION SCHEMAS
exports.UserValidationSchemas = {
    createAdminZodSchema,
    createDoctorZodSchema,
    createPatientZodSchema,
};
