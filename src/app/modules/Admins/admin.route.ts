import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { AdminControllers } from './admin.controller';
import { AdminValidations } from './admin.validation';

const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AdminControllers.getAllAdmins,
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AdminControllers.getAdminById,
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(AdminValidations.updateAdminZodSchema),
  AdminControllers.updateAdmin,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AdminControllers.deleteAdmin,
);

export const AdminRoutes = router;
