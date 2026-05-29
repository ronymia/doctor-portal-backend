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
const prisma_1 = require("../../../generated/prisma");
const faker_1 = require("@faker-js/faker");
const passwordHelpers_1 = require("../../helpers/passwordHelpers");
const user_1 = require("../../enums/user");
const prisma_2 = require("../../shared/prisma");
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding database...');
        try {
            // 1. Password for all seed users
            const defaultPassword = yield passwordHelpers_1.PasswordHelpers.passwordHash('12345678');
            // 2. Seed Specializations
            console.log('Seeding specializations...');
            const specializationNames = ['Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Psychiatry'];
            const specializations = [];
            for (const name of specializationNames) {
                const spec = yield prisma_2.prisma.specialization.upsert({
                    where: { name },
                    update: {},
                    create: {
                        name,
                        description: `Comprehensive ${name} care`,
                    },
                });
                specializations.push(spec);
            }
            // 3. Seed Services
            console.log('Seeding services...');
            const services = [];
            for (const spec of specializations) {
                for (let i = 0; i < 3; i++) {
                    const name = `${spec.name} Service ${i + 1}`;
                    const service = yield prisma_2.prisma.service.upsert({
                        where: { name },
                        update: {},
                        create: {
                            name,
                            description: `Quality ${name} provided by specialists`,
                            specializationId: spec.id,
                        },
                    });
                    services.push(service);
                }
            }
            // 4. Time Slots
            console.log('Seeding time slots...');
            const timeSlots = [];
            for (let hour = 9; hour <= 17; hour++) {
                const startTime = `${hour.toString().padStart(2, '0')}:00`;
                const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
                const timeSlot = (yield prisma_2.prisma.timeSlot.findFirst({
                    where: { startTime, endTime }
                })) || (yield prisma_2.prisma.timeSlot.create({
                    data: { startTime, endTime }
                }));
                timeSlots.push(timeSlot);
            }
            // 5. Seed Users (Demo Standard Users)
            console.log('Seeding default users (admin, doctor, patient)...');
            // Admin
            yield prisma_2.prisma.user.upsert({
                where: { email: 'admin@example.com' },
                update: {},
                create: {
                    email: 'admin@example.com',
                    phoneNumber: '01000000001',
                    password: defaultPassword,
                    role: user_1.ENUM_USER_ROLE.ADMIN,
                    status: prisma_1.UserAccountStatus.ACTIVE,
                    admin: { create: { adminId: `ADM-1` } },
                    profile: {
                        create: {
                            fullName: 'Admin Super',
                            address: faker_1.faker.location.streetAddress(),
                            dateOfBirth: faker_1.faker.date.past(),
                            joiningDate: new Date(),
                            gender: prisma_1.Gender.MALE,
                        },
                    },
                },
            });
            const buildUser = (role, email, phone, gender) => ({
                email,
                phoneNumber: phone,
                password: defaultPassword,
                role: role,
                status: prisma_1.UserAccountStatus.ACTIVE,
                profile: {
                    create: {
                        fullName: faker_1.faker.person.fullName({ sex: gender.toLowerCase() }),
                        address: faker_1.faker.location.streetAddress(),
                        dateOfBirth: faker_1.faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
                        joiningDate: new Date(),
                        gender: gender,
                    }
                }
            });
            const doctors = [];
            let defaultDoc = yield prisma_2.prisma.user.upsert({
                where: { email: 'doctor@example.com' },
                update: {},
                create: Object.assign(Object.assign({}, buildUser(user_1.ENUM_USER_ROLE.DOCTOR, 'doctor@example.com', '01000000002', prisma_1.Gender.MALE)), { doctor: {
                        create: {
                            doctorId: `DOC-1`,
                            specializationId: specializations[0].id,
                            qualification: 'MBBS, FCPS',
                            doctorProfile: { create: { licenseNumber: `LIC-1`, yearsOfExperience: 10 } }
                        }
                    } }),
                include: { doctor: true }
            });
            if (defaultDoc.doctor)
                doctors.push(defaultDoc.doctor);
            const patients = [];
            let defaultPat = yield prisma_2.prisma.user.upsert({
                where: { email: 'patient@example.com' },
                update: {},
                create: Object.assign(Object.assign({}, buildUser(user_1.ENUM_USER_ROLE.PATIENT, 'patient@example.com', '01000000003', prisma_1.Gender.FEMALE)), { patient: {
                        create: {
                            patientId: `PAT-1`,
                            medicalHistory: 'None',
                            emergencyContact: '01000000004',
                            patientProfile: { create: { bloodGroup: 'O+', weight: 65, height: 165 } }
                        }
                    } }),
                include: { patient: true }
            });
            if (defaultPat.patient)
                patients.push(defaultPat.patient);
            // 6. Bulk Generation of Doctors
            console.log('Seeding bulk doctors...');
            for (let i = 0; i < 15; i++) {
                const email = faker_1.faker.internet.email().toLowerCase();
                const phone = faker_1.faker.string.numeric(11).replace(/^./, '01');
                try {
                    const docUser = yield prisma_2.prisma.user.upsert({
                        where: { email },
                        update: {},
                        create: Object.assign(Object.assign({}, buildUser(user_1.ENUM_USER_ROLE.DOCTOR, email, phone, prisma_1.Gender.MALE)), { doctor: {
                                create: {
                                    doctorId: `DOC-${faker_1.faker.string.alphanumeric(6).toUpperCase()}`,
                                    specializationId: faker_1.faker.helpers.arrayElement(specializations).id,
                                    qualification: 'MBBS',
                                    doctorProfile: { create: { licenseNumber: `LIC-${faker_1.faker.string.alphanumeric(8)}`, yearsOfExperience: faker_1.faker.number.int({ min: 1, max: 20 }) } }
                                }
                            } }),
                        include: { doctor: true }
                    });
                    if (docUser.doctor)
                        doctors.push(docUser.doctor);
                }
                catch (err) { }
            }
            // 7. Bulk Generation of Patients
            console.log('Seeding bulk patients...');
            for (let i = 0; i < 20; i++) {
                const email = faker_1.faker.internet.email().toLowerCase();
                const phone = faker_1.faker.string.numeric(11).replace(/^./, '01');
                try {
                    const patUser = yield prisma_2.prisma.user.upsert({
                        where: { email },
                        update: {},
                        create: Object.assign(Object.assign({}, buildUser(user_1.ENUM_USER_ROLE.PATIENT, email, phone, prisma_1.Gender.FEMALE)), { patient: {
                                create: {
                                    patientId: `PAT-${faker_1.faker.string.alphanumeric(6).toUpperCase()}`,
                                    medicalHistory: faker_1.faker.lorem.sentence(),
                                    emergencyContact: faker_1.faker.string.numeric(11).replace(/^./, '01'),
                                    patientProfile: { create: { bloodGroup: faker_1.faker.helpers.arrayElement(['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']) } }
                                }
                            } }),
                        include: { patient: true }
                    });
                    if (patUser.patient)
                        patients.push(patUser.patient);
                }
                catch (err) { }
            }
            // 8. Available Doctors
            console.log('Seeding Available Doctors...');
            const availableDocs = [];
            const availableDate = new Date();
            availableDate.setHours(0, 0, 0, 0); // Today
            for (const doc of doctors) {
                const _slots = faker_1.faker.helpers.arrayElements(timeSlots, 3);
                for (const slot of _slots) {
                    try {
                        const ad = yield prisma_2.prisma.availableDoctor.upsert({
                            where: { doctorId_slotId_availableDate: { doctorId: doc.id, slotId: slot.id, availableDate } },
                            update: {},
                            create: {
                                doctorId: doc.id,
                                slotId: slot.id,
                                availableDate
                            }
                        });
                        availableDocs.push(ad);
                    }
                    catch (e) { }
                }
            }
            // 9. Available Services
            console.log('Seeding Available Services...');
            const availableServs = [];
            for (const ad of availableDocs) {
                const doc = yield prisma_2.prisma.doctor.findUnique({ where: { id: ad.doctorId } });
                if (!doc)
                    continue;
                const specServices = services.filter(s => s.specializationId === doc.specializationId);
                if (!specServices.length)
                    continue;
                const srv = faker_1.faker.helpers.arrayElement(specServices);
                try {
                    const as = yield prisma_2.prisma.availableService.upsert({
                        where: { slotId_serviceId_slotDate_availableDoctorId: { slotId: ad.slotId, serviceId: srv.id, slotDate: ad.availableDate, availableDoctorId: ad.id } },
                        update: {},
                        create: {
                            slotDate: ad.availableDate,
                            availableSeats: faker_1.faker.number.int({ min: 1, max: 5 }),
                            isBooked: false,
                            fees: faker_1.faker.number.int({ min: 50, max: 200 }) * 10,
                            serviceId: srv.id,
                            slotId: ad.slotId,
                            availableDoctorId: ad.id
                        }
                    });
                    availableServs.push(as);
                }
                catch (e) { }
            }
            // 10. Appointments and Payments
            console.log('Seeding Appointments...');
            for (const p of patients) {
                const numApps = faker_1.faker.number.int({ min: 0, max: 3 });
                for (let i = 0; i < numApps; i++) {
                    if (!availableServs.length)
                        break;
                    const avs = faker_1.faker.helpers.arrayElement(availableServs);
                    try {
                        const app = yield prisma_2.prisma.appointment.create({
                            data: {
                                patientId: p.id,
                                availableServiceId: avs.id,
                                appointmentDate: avs.slotDate,
                                status: prisma_1.AppointmentStatus.SCHEDULED
                            }
                        });
                        if (faker_1.faker.datatype.boolean()) {
                            yield prisma_2.prisma.payment.create({
                                data: {
                                    appointmentId: app.id,
                                    amount: avs.fees,
                                    paymentDate: new Date(),
                                    paymentStatus: prisma_1.PaymentStatus.PAID
                                }
                            });
                        }
                    }
                    catch (e) { }
                }
            }
            console.log('Database seeded successfully.');
        }
        catch (error) {
            console.error('Seeding failed:', error);
            process.exit(1);
        }
        finally {
            yield prisma_2.prisma.$disconnect();
        }
    });
}
seed();
