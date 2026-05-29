"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidationSchemas = void 0;
const prisma_1 = require("../../../../generated/prisma");
const zod_1 = require("zod");
// ADMIN
const createAdminZodSchema = zod_1.z.object({
    email: zod_1.z.string({
        message: 'email is required',
    }),
    phoneNumber: zod_1.z.string({
        message: 'phoneNumber is required',
    }),
    password: zod_1.z
        .string({
        message: 'password is required',
    })
        .optional(),
    profile: zod_1.z.object({
        fullName: zod_1.z.string({
            message: 'fullName is required',
        }),
        joiningDate: zod_1.z.string({
            message: 'joiningDate is required',
        }),
        gender: zod_1.z.enum(Object.values(prisma_1.Gender), {
            message: 'gender is required',
        }),
        address: zod_1.z.string({
            message: 'address is required',
        }),
        dateOfBirth: zod_1.z.string({
            message: 'dateOfBirth is required',
        }),
        profilePicture: zod_1.z.string({
            message: 'profilePicture is required',
        }),
    }),
});
// ADMIN
const createDoctorZodSchema = zod_1.z.object({
    email: zod_1.z.string({
        message: 'email is required',
    }),
    phoneNumber: zod_1.z.string({
        message: 'phoneNumber is required',
    }),
    password: zod_1.z
        .string({
        message: 'password is required',
    })
        .optional(),
    doctor: zod_1.z.object({
        specializationId: zod_1.z.string({
            message: 'specializationId is required',
        }),
        qualification: zod_1.z.string({
            message: 'qualification is required',
        }),
    }),
    profile: zod_1.z.object({
        fullName: zod_1.z.string({
            message: 'fullName is required',
        }),
        joiningDate: zod_1.z.string({
            message: 'joiningDate is required',
        }),
        gender: zod_1.z.enum(Object.values(prisma_1.Gender), {
            message: 'gender is required',
        }),
        address: zod_1.z.string({
            message: 'address is required',
        }),
        dateOfBirth: zod_1.z.string({
            message: 'dateOfBirth is required',
        }),
        profilePicture: zod_1.z.string({
            message: 'profilePicture is required',
        }),
    }),
});
// PATIENT
const createPatientZodSchema = zod_1.z.object({
    email: zod_1.z.string({
        message: 'email is required',
    }),
    phoneNumber: zod_1.z.string({
        message: 'phoneNumber is required',
    }),
    password: zod_1.z
        .string({
        message: 'password is required',
    })
        .optional(),
    patient: zod_1.z.object({
        medicalHistory: zod_1.z.string({
            message: 'medicalHistory is required',
        }),
        emergencyContact: zod_1.z.string({
            message: 'emergencyContact is required',
        }),
    }),
    profile: zod_1.z.object({
        fullName: zod_1.z.string({
            message: 'fullName is required',
        }),
        joiningDate: zod_1.z.string({
            message: 'joiningDate is required',
        }),
        gender: zod_1.z.enum(Object.values(prisma_1.Gender), {
            message: 'gender is required',
        }),
        address: zod_1.z.string({
            message: 'address is required',
        }),
        dateOfBirth: zod_1.z.string({
            message: 'dateOfBirth is required',
        }),
        profilePicture: zod_1.z.string({
            message: 'profilePicture is required',
        }),
    }),
});
// EXPORT VALIDATION SCHEMAS
exports.UserValidationSchemas = {
    createAdminZodSchema,
    createDoctorZodSchema,
    createPatientZodSchema,
};
