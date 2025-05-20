import express from 'express';
import { AppointmentControllers } from './appointment.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.route('/').post(
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  // validateRequest(AppointmentControllers.createAppointmentZodSchema),
  AppointmentControllers.createAppointment,
);
router.route('/').get(
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  // validateRequest(AppointmentControllers.createAppointmentZodSchema),
  AppointmentControllers.getAllAppointments,
);
router.route('/:id').get(
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  // validateRequest(AppointmentControllers.createAppointmentZodSchema),
  AppointmentControllers.getAppointmentById,
);
router.route('/:id').patch(
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  // validateRequest(AppointmentControllers.createAppointmentZodSchema),
  AppointmentControllers.updateAppointment,
);
router.route('/:id').delete(
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  // validateRequest(AppointmentControllers.createAppointmentZodSchema),
  AppointmentControllers.deleteAppointment,
);

// EXPORT
export const AppointmentRoutes = router;
