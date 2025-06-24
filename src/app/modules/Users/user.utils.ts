import { ENUM_USER_ROLE } from '../../../enums/user';
import { prisma } from '../../../shared/prisma';

export const findLastAdminId = async () => {
  const lastAdmin = await prisma.user.findFirst({
    where: { role: ENUM_USER_ROLE.ADMIN },
    orderBy: { createdAt: 'desc' },
  });

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  const currentId = (await findLastAdminId()) || '00000';
  const incrementedId = `A-${(Number(currentId) + 1).toString().padStart(5, '0')}`;
  return incrementedId;
};
export const findLastDoctorId = async () => {
  const lastDoctor = await prisma.user.findFirst({
    where: { role: ENUM_USER_ROLE.DOCTOR },
    orderBy: { createdAt: 'desc' },
  });

  return lastDoctor?.id ? lastDoctor.id.substring(2) : undefined;
};

export const generateDoctorId = async () => {
  const currentId = (await findLastDoctorId()) || '00000';
  const incrementedId = `D-${(Number(currentId) + 1).toString().padStart(5, '0')}`;
  return incrementedId;
};
export const findLastPatientId = async () => {
  const lastPatient = await prisma.user.findFirst({
    where: { role: ENUM_USER_ROLE.PATIENT },
    orderBy: { createdAt: 'desc' },
  });

  return lastPatient?.id ? lastPatient.id.substring(2) : undefined;
};

export const generatePatientId = async () => {
  const currentId = (await findLastPatientId()) || '00000';
  const incrementedId = `P-${(Number(currentId) + 1).toString().padStart(5, '0')}`;
  return incrementedId;
};
