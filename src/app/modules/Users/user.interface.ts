import { Gender, UserAccountStatus } from '@prisma/client';

export type TUserFilters = {
  searchTerm?: string;
  email?: string;
  phone_number?: string;
  role?: string;
  status?: string;
};

export type TUserFilterableFields =
  | 'searchTerm'
  | 'email'
  | 'phone_number'
  | 'role'
  | 'status';

export type IUser = {
  email: string;
  phoneNumber: string;
  password?: string;
  role: string;
  status?: UserAccountStatus;
};

export type IProfile = {
  userId: string;
  fullName: string;
  joiningDate: string;
  gender: Gender;
  address: string;
  dateOfBirth: string;
  profilePicture: string;
};

export type IAdminCreate = {
  profile: IProfile;
} & IUser;

export type IDoctorCreate = {
  profile: IProfile;
  doctor: {
    userId: string;
    specializationId: string;
    qualification: string;
  };
} & IUser;
export type IPatientCreate = {
  profile: IProfile;
  patient: {
    userId: string;
    medicalHistory: string;
    emergencyContact: string;
  };
} & IUser;
