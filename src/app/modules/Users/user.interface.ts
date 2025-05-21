import { Gender } from '@prisma/client';

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

export type IAdminCreate = {
  email: string;
  phoneNumber: string;
  password?: string;
  profile: {
    fullName: string;
    joiningDate: string;
    gender: Gender;
    address: string;
    dateOfBirth: string;
    profilePicture: string;
  };
};
