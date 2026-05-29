/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, label, printf } = format;

//Custom Log Format

const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp as any);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${date.toDateString()} ${hour}:${minutes}:${seconds} } [${label}] ${level}: ${JSON.stringify(message)}`;
});

// ✅ Writable log directory for serverless environments
const baseLogPath = path.join('/tmp', 'logs', 'winston');

// Ensure log subdirectories exist
['successes', 'errors'].forEach((dir) => {
  const fullPath = path.join(baseLogPath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'Doctor Portal' }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        baseLogPath,
        'logs',
        'successes',
        '%DATE%-success.log',
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

const errorLogger = createLogger({
  level: 'error',
  format: combine(label({ label: 'Doctor Portal' }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(baseLogPath, 'logs', 'errors', '%DATE%-error.log'),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

export { errorLogger, logger };
