import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import { JwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = JwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      (req as any).user = verifiedUser; // role  , userId

      // role based guard
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export const requireRole = auth;

export const requirePermission =
  (...requiredPermissions: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      const verifiedUser = JwtHelpers.verifyToken(token, config.jwt.secret as Secret) as any;
      (req as any).user = verifiedUser;

      // SUPER_ADMIN bypasses all permission checks
      if (verifiedUser.role === 'SUPER_ADMIN') {
        return next();
      }

      // Check permissions
      const userPermissions = verifiedUser.permissions || [];
      const hasPermission = requiredPermissions.every((perm) =>
        userPermissions.includes(perm),
      );

      if (!hasPermission) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'Forbidden: You do not have the required permissions for this action',
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
