import express from 'express';
import { ErrorLogControllers } from './errorLog.controller';

const router = express.Router();

router.get('/', ErrorLogControllers.errorLogs);

export const errorRoutes = router;
