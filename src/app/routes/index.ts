import express from 'express';
import { SpecializationRoutes } from '../modules/Specialization/specialization.route';
import { PermissionRoutes } from '../modules/Permission/permission.route';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { ServiceRoutes } from '../modules/Service/service.route';
import { TimeSlotRoutes } from '../modules/TimeSlot/timeSlot.route';
import { AvailableServiceRoutes } from '../modules/AvailableService/availableService.route';
import { AppointmentRoutes } from '../modules/Appointment/appointment.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/v1.0/auth',
    route: AuthRoutes,
  },
  {
    path: '/v1.0/users',
    route: UserRoutes,
  },
  {
    path: '/permissions',
    route: PermissionRoutes,
  },
  {
    path: '/v1.0/specializations',
    route: SpecializationRoutes,
  },
  {
    path: '/v1.0/services',
    route: ServiceRoutes,
  },
  {
    path: '/v1.0/time-slots',
    route: TimeSlotRoutes,
  },
  {
    path: '/v1.0/available-services',
    route: AvailableServiceRoutes,
  },
  {
    path: '/v1.0/appointments',
    route: AppointmentRoutes,
  },
];

// routes
moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
