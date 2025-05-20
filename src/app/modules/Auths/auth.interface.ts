import { User } from '@prisma/client';
import { ENUM_USER_ROLE } from '../../../enums/user';

export type TLoginUser = {
  id: string;
  email?: string;
  phone_number?: string;
  password: string;
};

export type TLoginUserResponse = {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    role: User['role'];
    status: User['status'];
    phone_number: User['phone_number'];
    email: User['email'];
  };
};

export type TRefreshTokenResponse = {
  access_token: string;
};

export type TVerifiedLoginUser = {
  user_id: string;
  role:
    | ENUM_USER_ROLE.SUPER_ADMIN
    | ENUM_USER_ROLE.ADMIN
    | ENUM_USER_ROLE.DOCTOR
    | ENUM_USER_ROLE.PATIENT;
};
