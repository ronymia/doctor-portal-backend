import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import {
  TLoginUser,
  TLoginUserResponse,
  TRefreshTokenResponse,
} from './auth.interface';
import AppError from '../../../errors/AppError';
import { PasswordHelpers } from '../../../helpers/passwordHelpers';
import { JwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { prisma } from '../../../shared/prisma';
import { User, UserAccountStatus } from '@prisma/client';

// LOGIN USER
const loginUser = async (payload: TLoginUser): Promise<TLoginUserResponse> => {
  //  extract login information
  // VERIFY USER EXISTENCE
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: {
      profile: true,
      userPermissions: true,
    },
  });
  // IF NOT EXIST
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  // CHECK USER ALREADY DELETE OR NOT
  // if (user?.is_deleted) {
  //   throw new AppError(httpStatus.FORBIDDEN, 'User Already Delete');
  // }
  // CHECKING IF USER IS BLOCK
  if (user?.status === UserAccountStatus.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is block');
  }

  // VERIFY PASSWORD MATCH
  if (!(await PasswordHelpers.passwordMatch(payload.password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password do not match');
  }

  // CREATE JWT access_token
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { id: user_id, role, password, ...rest } = user;

  // CREATE access_token
  const accessToken = JwtHelpers.createToken(
    { user_id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  // CREATE refresh_token
  const refreshToken = JwtHelpers.createToken(
    { user_id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  // DELETE PASSWORD
  if ('password' in user) {
    delete (user as Partial<User>).password;
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user,
  };
};

const refreshToken = async (token: string): Promise<TRefreshTokenResponse> => {
  // Invalid token synchronous
  let verifiedToken = null;
  try {
    verifiedToken = JwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(httpStatus.UNAUTHORIZED, 'JWT token has expired');
    } else if (error.name === 'JsonwebTokenError') {
      throw new AppError(httpStatus.FORBIDDEN, 'Invalid JWT token');
    } else {
      throw new AppError(httpStatus.FORBIDDEN, 'Could not verify JWT token');
    }
  }

  const { user_id } = verifiedToken;
  //
  const user = await prisma.user.findUnique({
    where: { id: user_id },
  });
  //
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, ' User not found');
  }

  // GENERATE NEW ACCESS TOKEN
  const newAccessToken = JwtHelpers.createToken(
    {
      user_id,
      role: user?.role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  //
  return {
    access_token: newAccessToken,
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
