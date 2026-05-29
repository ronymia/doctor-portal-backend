import { Gender } from '../../../../generated/prisma';
import { z } from 'zod';

// ADMIN
const createAdminZodSchema = z.object({
  email: z.string({
    message: 'email is required',
  }),
  phoneNumber: z.string({
    message: 'phoneNumber is required',
  }),
  password: z
    .string({
      message: 'password is required',
    })
    .optional(),
  profile: z.object({
    fullName: z.string({
      message: 'fullName is required',
    }),
    joiningDate: z.string({
      message: 'joiningDate is required',
    }),
    gender: z.enum(Object.values(Gender) as [string, ...string[]], {
      message: 'gender is required',
    }),
    address: z.string({
      message: 'address is required',
    }),
    dateOfBirth: z.string({
      message: 'dateOfBirth is required',
    }),
    profilePicture: z.string({
      message: 'profilePicture is required',
    }),
  }),
});

// ADMIN
const createDoctorZodSchema = z.object({
  email: z.string({
    message: 'email is required',
  }),
  phoneNumber: z.string({
    message: 'phoneNumber is required',
  }),
  password: z
    .string({
      message: 'password is required',
    })
    .optional(),
  doctor: z.object({
    specializationId: z.string({
      message: 'specializationId is required',
    }),
    qualification: z.string({
      message: 'qualification is required',
    }),
  }),
  profile: z.object({
    fullName: z.string({
      message: 'fullName is required',
    }),
    joiningDate: z.string({
      message: 'joiningDate is required',
    }),
    gender: z.enum(Object.values(Gender) as [string, ...string[]], {
      message: 'gender is required',
    }),
    address: z.string({
      message: 'address is required',
    }),
    dateOfBirth: z.string({
      message: 'dateOfBirth is required',
    }),
    profilePicture: z.string({
      message: 'profilePicture is required',
    }),
  }),
});

// PATIENT
const createPatientZodSchema = z.object({
  email: z.string({
    message: 'email is required',
  }),
  phoneNumber: z.string({
    message: 'phoneNumber is required',
  }),
  password: z
    .string({
      message: 'password is required',
    })
    .optional(),
  patient: z.object({
    medicalHistory: z.string({
      message: 'medicalHistory is required',
    }),
    emergencyContact: z.string({
      message: 'emergencyContact is required',
    }),
  }),
  profile: z.object({
    fullName: z.string({
      message: 'fullName is required',
    }),
    joiningDate: z.string({
      message: 'joiningDate is required',
    }),
    gender: z.enum(Object.values(Gender) as [string, ...string[]], {
      message: 'gender is required',
    }),
    address: z.string({
      message: 'address is required',
    }),
    dateOfBirth: z.string({
      message: 'dateOfBirth is required',
    }),
    profilePicture: z.string({
      message: 'profilePicture is required',
    }),
  }),
});

// EXPORT VALIDATION SCHEMAS
export const UserValidationSchemas = {
  createAdminZodSchema,
  createDoctorZodSchema,
  createPatientZodSchema,
};
