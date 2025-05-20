import { RequestHandler, Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { AuthServices } from './auth.service';
import config from '../../../config';
import sendResponse from '../../../shared/sendResponse';
import { TLoginUserResponse } from './auth.interface';

// CREATE CONTROLLER FUNCTION
const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payloadData } = req.body;

    // SEND DATA TO BUSINESS LOGIC
    const { refresh_token, ...result } =
      await AuthServices.loginUser(payloadData);

    // SET REFRESH TOKEN TO COOKIE
    const cookieOptions = {
      secure: config.node_env === 'production',
      httpOnly: true,
    };
    res.cookie('refresh_token', refresh_token, cookieOptions);

    // SEND RESPONSE
    sendResponse<TLoginUserResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user login successfully',
      data: result,
    });
  },
);

// CREATE CONTROLLER FUNCTION
const refreshToken: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const refresh_token = req.cookies;

    const result = await AuthServices.refreshToken(refresh_token as any);

    // SET REFRESH TOKEN TO COOKIE
    const cookieOptions = {
      secure: config.node_env === 'product',
      httpOnly: true,
    };
    res.cookie('refresh_token', result, cookieOptions);

    // SEND RESPONSE
    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user login successfully',
      data: result,
    });
  },
);

export const AuthControllers = {
  loginUser,
  refreshToken,
};
