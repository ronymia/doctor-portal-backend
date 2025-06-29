"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const passwordHelpers_1 = require("../../helpers/passwordHelpers");
const user_1 = require("../../enums/user");
const prisma = new client_1.PrismaClient();
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 1. Create Specializations
            const cardio = yield prisma.specialization.upsert({
                where: { name: 'Cardiology' },
                update: {},
                create: {
                    name: 'Cardiology',
                    description: 'Heart and blood vessels care',
                },
            });
            const neuro = yield prisma.specialization.upsert({
                where: { name: 'Neurology' },
                update: {},
                create: {
                    name: 'Neurology',
                    description: 'Brain and nervous system care',
                },
            });
            const derm = yield prisma.specialization.upsert({
                where: { name: 'Dermatology' },
                update: {},
                create: {
                    name: 'Dermatology',
                    description: 'Skin, hair, and nails care',
                },
            });
            // 2. Create Services
            yield prisma.service.createMany({
                data: [
                    {
                        name: 'ECG',
                        description: 'Electrocardiogram',
                        specializationId: cardio.id,
                    },
                    {
                        name: 'Heart Checkup',
                        description: 'Complete cardiac assessment',
                        specializationId: cardio.id,
                    },
                    {
                        name: 'EEG',
                        description: 'Electroencephalogram',
                        specializationId: neuro.id,
                    },
                    {
                        name: 'Brain MRI',
                        description: 'Magnetic Resonance Imaging of brain',
                        specializationId: neuro.id,
                    },
                    {
                        name: 'Skin Allergy Test',
                        description: 'Testing for skin allergies',
                        specializationId: derm.id,
                    },
                    {
                        name: 'Acne Treatment',
                        description: 'Treatment for acne and related skin conditions',
                        specializationId: derm.id,
                    },
                ],
                skipDuplicates: true,
            });
            // 3. Create Admin User
            const adminPassword = yield passwordHelpers_1.PasswordHelpers.passwordHash('12356'); // bcrypt.hash('12356', 12);
            yield prisma.user.create({
                data: {
                    email: 'admin@yopmail.com',
                    phoneNumber: '0123456789',
                    password: adminPassword,
                    role: user_1.ENUM_USER_ROLE.ADMIN,
                    status: client_1.UserAccountStatus.ACTIVE,
                    admin: {
                        create: {
                            adminId: 'ADM001',
                        },
                    },
                    profile: {
                        create: {
                            fullName: 'Admin User',
                            address: 'Admin Street',
                            dateOfBirth: new Date('1990-01-01'),
                            joiningDate: new Date(),
                            gender: 'OTHER',
                        },
                    },
                },
            });
            // 4. Create Doctor User
            const doctorPassword = yield passwordHelpers_1.PasswordHelpers.passwordHash('123456'); // bcrypt.hash('123456', 12);
            yield prisma.user.create({
                data: {
                    email: 'doctor@yopmail.com',
                    phoneNumber: '0198765432',
                    password: doctorPassword,
                    role: user_1.ENUM_USER_ROLE.DOCTOR,
                    status: client_1.UserAccountStatus.ACTIVE,
                    doctor: {
                        create: {
                            doctorId: 'DOC001',
                            qualification: 'MBBS, FCPS',
                            specializationId: cardio.id,
                            doctorProfile: {
                                create: {
                                    licenseNumber: 'LIC1234',
                                    yearsOfExperience: 5,
                                },
                            },
                        },
                    },
                    profile: {
                        create: {
                            fullName: 'Dr. John Doe',
                            address: 'Doctor Road',
                            dateOfBirth: new Date('1985-06-15'),
                            joiningDate: new Date(),
                            gender: 'MALE',
                        },
                    },
                },
            });
            // 5. Create Patient User
            const patientPassword = yield passwordHelpers_1.PasswordHelpers.passwordHash('123456'); // bcrypt.hash('123456', 12);
            yield prisma.user.create({
                data: {
                    email: 'patient@yopmail.com',
                    phoneNumber: '0170000000',
                    password: patientPassword,
                    role: user_1.ENUM_USER_ROLE.PATIENT,
                    status: client_1.UserAccountStatus.ACTIVE,
                    patient: {
                        create: {
                            patientId: 'PAT001',
                            medicalHistory: 'Diabetes',
                            emergencyContact: '01711111111',
                            patientProfile: {
                                create: {
                                    bloodGroup: 'O+',
                                    weight: 70.5,
                                    height: 175.3,
                                    allergies: 'Penicillin',
                                    chronicDiseases: 'Hypertension',
                                },
                            },
                        },
                    },
                    profile: {
                        create: {
                            fullName: 'Mr. Patient',
                            address: 'Patient Address',
                            dateOfBirth: new Date('1995-04-12'),
                            joiningDate: new Date(),
                            gender: 'MALE',
                        },
                    },
                },
            });
            // 6. Create 15-minute Time Slots between 10:00 and 12:00
            const timeSlots = [];
            for (let hour = 10; hour < 12; hour++) {
                for (let minute = 0; minute < 60; minute += 15) {
                    const startHour = hour.toString().padStart(2, '0');
                    const startMinute = minute.toString().padStart(2, '0');
                    const endMinuteTotal = minute + 15;
                    const endHour = (endMinuteTotal >= 60 ? hour + 1 : hour)
                        .toString()
                        .padStart(2, '0');
                    const endMinute = (endMinuteTotal % 60).toString().padStart(2, '0');
                    timeSlots.push({
                        startTime: `${startHour}:${startMinute}`,
                        endTime: `${endHour}:${endMinute}`,
                    });
                }
            }
            yield prisma.timeSlot.createMany({
                data: timeSlots,
                skipDuplicates: true,
            });
            console.log('✅ Seed completed successfully');
        }
        catch (error) {
            console.error('❌ Seed error:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
seed();
