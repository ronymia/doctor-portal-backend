import { TPatientFilterableFields } from './patient.interface';

export const patientSearchableFields = ['fullName', 'email', 'phoneNumber'];

export const patientFilterableFields: TPatientFilterableFields[] = [
  'searchTerm',
  'email',
];
