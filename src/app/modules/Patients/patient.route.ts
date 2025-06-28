import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { PatientControllers } from './patient.controller';

const router = express.Router();

router.route('/').get(
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  // validateRequest(AppointmentControllers.createAppointmentZodSchema),
  PatientControllers.getAllPatientsFromDB,
);

export const PatientRoutes = router;
