import express from 'express';
import { SpecializationRoutes } from '../modules/Specializations/specialization.route';
import { PermissionRoutes } from '../modules/Permissions/permission.route';
import { UserRoutes } from '../modules/Users/user.route';
import { AuthRoutes } from '../modules/Auths/auth.route';
import { ServiceRoutes } from '../modules/Services/service.route';
import { TimeSlotRoutes } from '../modules/TimeSlots/timeSlot.route';
import { AvailableServiceRoutes } from '../modules/AvailableServices/availableService.route';
import { AppointmentRoutes } from '../modules/Appointments/appointment.route';
import { errorRoutes } from '../modules/ErrorLog/errorLog.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/v1.0/auth',
    route: AuthRoutes,
  },
  {
    path: '/error-logs',
    route: errorRoutes,
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
