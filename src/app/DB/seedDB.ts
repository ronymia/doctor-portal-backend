import { PrismaClient } from '@prisma/client';
import { PasswordHelpers } from '../../helpers/passwordHelpers';

const prisma = new PrismaClient();

async function seed() {
  try {
    // 1. Create Specializations
    const cardio = await prisma.specialization.upsert({
      where: { name: 'Cardiology' },
      update: {},
      create: {
        name: 'Cardiology',
        description: 'Heart and blood vessels care',
      },
    });

    const neuro = await prisma.specialization.upsert({
      where: { name: 'Neurology' },
      update: {},
      create: {
        name: 'Neurology',
        description: 'Brain and nervous system care',
      },
    });

    const derm = await prisma.specialization.upsert({
      where: { name: 'Dermatology' },
      update: {},
      create: {
        name: 'Dermatology',
        description: 'Skin, hair, and nails care',
      },
    });

    // 2. Create Services
    await prisma.service.createMany({
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
    const adminPassword = await PasswordHelpers.passwordHash('12356'); // bcrypt.hash('12356', 12);
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        phoneNumber: '0123456789',
        password: adminPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
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
    const doctorPassword = await PasswordHelpers.passwordHash('123456'); // bcrypt.hash('123456', 12);
    await prisma.user.create({
      data: {
        email: 'doctor@example.com',
        phoneNumber: '0198765432',
        password: doctorPassword,
        role: 'DOCTOR',
        status: 'ACTIVE',
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
    const patientPassword = await PasswordHelpers.passwordHash('123456'); // bcrypt.hash('123456', 12);
    await prisma.user.create({
      data: {
        email: 'patient@example.com',
        phoneNumber: '0170000000',
        password: patientPassword,
        role: 'PATIENT',
        status: 'ACTIVE',
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

    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
