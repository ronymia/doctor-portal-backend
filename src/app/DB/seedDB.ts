import { UserAccountStatus, Gender, AppointmentStatus, PaymentStatus, UserRole } from '../../../generated/prisma';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { PasswordHelpers } from '../../helpers/passwordHelpers';
import { ENUM_USER_ROLE } from '../../enums/user';
import { prisma } from '../../shared/prisma';

async function seed() {
  console.log('Seeding database...');
  try {
    // 1. Password for all seed users
    const defaultPassword = await PasswordHelpers.passwordHash('12345678');

    // 2. Seed Specializations
    console.log('Seeding specializations...');
    const specializationNames = ['Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Psychiatry'];
    const specializations = [];
    for (const name of specializationNames) {
      const spec = await prisma.specialization.upsert({
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
        const service = await prisma.service.upsert({
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
      
      const timeSlot = await prisma.timeSlot.findFirst({
        where: { startTime, endTime }
      }) || await prisma.timeSlot.create({
        data: { startTime, endTime }
      });
      timeSlots.push(timeSlot);
    }

    // 5. Seed Users (Demo Standard Users)
    console.log('Seeding default users (admin, doctor, patient)...');
    
    // Admin
    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        phoneNumber: '01000000001',
        password: defaultPassword,
        role: ENUM_USER_ROLE.ADMIN as UserRole,
        status: UserAccountStatus.ACTIVE,
        admin: { create: { adminId: `ADM-1` } },
        profile: {
          create: {
            fullName: 'Admin Super',
            address: faker.location.streetAddress(),
            dateOfBirth: faker.date.past(),
            joiningDate: new Date(),
            gender: Gender.MALE,
          },
        },
      },
    });

    const buildUser = (role: any, email: string, phone: string, gender: Gender) => ({
      email,
      phoneNumber: phone,
      password: defaultPassword,
      role: role as UserRole,
      status: UserAccountStatus.ACTIVE,
      profile: {
        create: {
          fullName: faker.person.fullName({ sex: gender.toLowerCase() as any }),
          address: faker.location.streetAddress(),
          dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
          joiningDate: new Date(),
          gender: gender,
        }
      }
    });

    const doctors = [];
    let defaultDoc = await prisma.user.upsert({
      where: { email: 'doctor@example.com' },
      update: {},
      create: {
        ...buildUser(ENUM_USER_ROLE.DOCTOR, 'doctor@example.com', '01000000002', Gender.MALE),
        doctor: {
          create: {
            doctorId: `DOC-1`,
            specializationId: specializations[0].id,
            qualification: 'MBBS, FCPS',
            doctorProfile: { create: { licenseNumber: `LIC-1`, yearsOfExperience: 10 } }
          }
        }
      },
      include: { doctor: true }
    });
    if (defaultDoc.doctor) doctors.push(defaultDoc.doctor);

    const patients = [];
    let defaultPat = await prisma.user.upsert({
      where: { email: 'patient@example.com' },
      update: {},
      create: {
        ...buildUser(ENUM_USER_ROLE.PATIENT, 'patient@example.com', '01000000003', Gender.FEMALE),
        patient: {
          create: {
            patientId: `PAT-1`,
            medicalHistory: 'None',
            emergencyContact: '01000000004',
            patientProfile: { create: { bloodGroup: 'O+', weight: 65, height: 165 } }
          }
        }
      },
      include: { patient: true }
    });
    if (defaultPat.patient) patients.push(defaultPat.patient);

    // 6. Bulk Generation of Doctors
    console.log('Seeding bulk doctors...');
    for (let i = 0; i < 15; i++) {
      const email = faker.internet.email().toLowerCase();
      const phone = faker.string.numeric(11).replace(/^./, '01');
      try {
        const docUser = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
            ...buildUser(ENUM_USER_ROLE.DOCTOR, email, phone, Gender.MALE),
            doctor: {
                create: {
                doctorId: `DOC-${faker.string.alphanumeric(6).toUpperCase()}`,
                specializationId: faker.helpers.arrayElement(specializations).id,
                qualification: 'MBBS',
                doctorProfile: { create: { licenseNumber: `LIC-${faker.string.alphanumeric(8)}`, yearsOfExperience: faker.number.int({ min: 1, max: 20 }) } }
                }
            }
            },
            include: { doctor: true }
        });
        if (docUser.doctor) doctors.push(docUser.doctor);
      } catch (err) {}
    }

    // 7. Bulk Generation of Patients
    console.log('Seeding bulk patients...');
    for (let i = 0; i < 20; i++) {
      const email = faker.internet.email().toLowerCase();
      const phone = faker.string.numeric(11).replace(/^./, '01');
      try {
        const patUser = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
            ...buildUser(ENUM_USER_ROLE.PATIENT, email, phone, Gender.FEMALE),
            patient: {
                create: {
                patientId: `PAT-${faker.string.alphanumeric(6).toUpperCase()}`,
                medicalHistory: faker.lorem.sentence(),
                emergencyContact: faker.string.numeric(11).replace(/^./, '01'),
                patientProfile: { create: { bloodGroup: faker.helpers.arrayElement(['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']) } }
                }
            }
            },
            include: { patient: true }
        });
        if (patUser.patient) patients.push(patUser.patient);
      } catch (err) {}
    }

    // 8. Available Doctors
    console.log('Seeding Available Doctors...');
    const availableDocs = [];
    const availableDate = new Date();
    availableDate.setHours(0, 0, 0, 0); // Today

    for (const doc of doctors) {
      const _slots = faker.helpers.arrayElements(timeSlots, 3);
      for (const slot of _slots) {
        try {
            const ad = await prisma.availableDoctor.upsert({
                where: { doctorId_slotId_availableDate: { doctorId: doc.id, slotId: slot.id, availableDate } },
                update: {},
                create: {
                    doctorId: doc.id,
                    slotId: slot.id,
                    availableDate
                }
            });
            availableDocs.push(ad);
        } catch (e) {}
      }
    }

    // 9. Available Services
    console.log('Seeding Available Services...');
    const availableServs = [];
    for (const ad of availableDocs) {
        const doc = await prisma.doctor.findUnique({ where: { id: ad.doctorId }});
        if (!doc) continue;
        const specServices = services.filter(s => s.specializationId === doc.specializationId);
        if(!specServices.length) continue;

        const srv = faker.helpers.arrayElement(specServices);
        try {
            const as = await prisma.availableService.upsert({
                where: { slotId_serviceId_slotDate_availableDoctorId: { slotId: ad.slotId, serviceId: srv.id, slotDate: ad.availableDate, availableDoctorId: ad.id } },
                update: {},
                create: {
                    slotDate: ad.availableDate,
                    availableSeats: faker.number.int({ min: 1, max: 5 }),
                    isBooked: false,
                    fees: faker.number.int({ min: 50, max: 200 }) * 10,
                    serviceId: srv.id,
                    slotId: ad.slotId,
                    availableDoctorId: ad.id
                }
            });
            availableServs.push(as);
        } catch(e) {}
    }

    // 10. Appointments and Payments
    console.log('Seeding Appointments...');
    for (const p of patients) {
        const numApps = faker.number.int({ min: 0, max: 3 });
        for (let i = 0; i < numApps; i++) {
            if(!availableServs.length) break;
            const avs = faker.helpers.arrayElement(availableServs);
            try {
                const app = await prisma.appointment.create({
                    data: {
                        patientId: p.id,
                        availableServiceId: avs.id,
                        appointmentDate: avs.slotDate,
                        status: AppointmentStatus.SCHEDULED
                    }
                });
                
                if (faker.datatype.boolean()) {
                    await prisma.payment.create({
                        data: {
                            appointmentId: app.id,
                            amount: avs.fees,
                            paymentDate: new Date(),
                            paymentStatus: PaymentStatus.PAID
                        }
                    });
                }
            } catch(e) {}
        }
    }

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
