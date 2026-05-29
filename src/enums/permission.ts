export enum ENUM_USER_PERMISSION {
  // Admin Management
  ADMIN_CREATE = 'admin.create',
  ADMIN_UPDATE = 'admin.update',
  ADMIN_DELETE = 'admin.delete',
  ADMIN_LIST = 'admin.list',
  ADMIN_DETAILS = 'admin.details',

  // Doctor Management
  DOCTOR_CREATE = 'doctor.create',
  DOCTOR_UPDATE = 'doctor.update',
  DOCTOR_LIST = 'doctor.list',
  DOCTOR_APPROVE = 'doctor.approve',

  // Patient Management
  PATIENT_LIST = 'patient.list',
  PATIENT_MANAGE = 'patient.manage',

  // Timeslot Management
  TIMESLOT_CREATE = 'timeslot.create',
  TIMESLOT_UPDATE = 'timeslot.update',
  TIMESLOT_DELETE = 'timeslot.delete',
  TIMESLOT_LIST = 'timeslot.list',

  // Appointment Management
  APPOINTMENT_MANAGE = 'appointment.manage',
  APPOINTMENT_LIST = 'appointment.list',

  // Permission Management
  PERMISSION_ASSIGN = 'permission.assign',
  PERMISSION_REMOVE = 'permission.remove',
  PERMISSION_LIST = 'permission.list',

  // Services & Specializations
  SPECIALIZATION_MANAGE = 'specialization.manage',
  SERVICE_MANAGE = 'service.manage',
}

export const ALL_PERMISSIONS = Object.values(ENUM_USER_PERMISSION);
