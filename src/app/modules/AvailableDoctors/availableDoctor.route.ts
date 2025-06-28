import express from 'express';
import { AvailableDoctorControllers } from './availableDoctor.controller';

const router = express.Router();

router.route('/').get(AvailableDoctorControllers.getAllAvailableDoctorsFromDB);
router.route('/').post(AvailableDoctorControllers.createAvailableDoctorIntoDB);

export const AvailableDoctorRoutes = router;
