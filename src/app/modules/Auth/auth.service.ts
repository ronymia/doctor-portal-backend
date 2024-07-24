import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import { PrismaClient, Prisma } from "@prisma/client";
import {
  TLoginUser,
  TLoginUserResponse,
  TRefreshTokenResponse,
} from "./auth.interface";
import AppError from "../../../errors/AppError";
import { PasswordHelpers } from "../../../helpers/passwordHelpers";
import { JwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";

//
const prisma = new PrismaClient();

const loginUser = async (
  loginData: TLoginUser
): Promise<TLoginUserResponse> => {
  //  extract login information
  const { id, password } = loginData;
  //VERIFY USER EXISTENCE
  const user = await prisma.user.findUnique({
    where: { user_id: id },
  });
  // IF NOT EXIST
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found");
  }
  // CHECK USER ALREADY DELETE OR NOT
  if (!user?.is_deleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User Already Delete");
  }
  // CHECKING IF USER IS BLOCK
  if (user?.status === "block") {
    throw new AppError(httpStatus.FORBIDDEN, "User is block");
  }

  //VERIFY PASSWORD MATCH
  if (!(await PasswordHelpers.passwordMatch(password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Password do not match");
  }

  //CREATE JWT access_token and refresh_token
  const { user_id, role, is_Password_reset_required } = user;

  // CREATE access_token
  const accessToken = JwtHelpers.createToken(
    { user_id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  // CREATE refresh_token
  const refreshToken = JwtHelpers.createToken(
    { user_id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    is_Password_reset_required,
  };
};

const refreshToken = async (token: string): Promise<TRefreshTokenResponse> => {
  // Invalid token synchronous
  let verifiedToken = null;
  try {
    verifiedToken = JwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(httpStatus.UNAUTHORIZED, "JWT token has expired");
    } else if (error.name === "JsonwebTokenError") {
      throw new AppError(httpStatus.FORBIDDEN, "Invalid JWT token");
    } else {
      throw new AppError(httpStatus.FORBIDDEN, "Could not verify JWT token");
    }
  }

  const { user_id } = verifiedToken;
  //
  const user = await prisma.user.findUnique({
    where: { user_id },
  });
  //
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, " User not found");
  }

  // GENERATE NEW ACCESS TOKEN
  const newAccessToken = JwtHelpers.createToken(
    {
      user_id: user?.user_id,
      role: user?.role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
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
