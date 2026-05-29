/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { Server } from 'http';
import app from './app';
import { errorLogger, logger } from './shared/logger';
import config from './config';
import { prisma } from './shared/prisma';
import seedSuperAdmin from './app/DB/seedSuperAdmin';

async function bootstrap() {
  let server: Server;

  try {
    // 1. CHRONOLOGICAL DATABASE CONNECTION
    await prisma.$connect();
    config.node_env === 'development'
      ? console.log('Database connected successfully')
      : logger.info('Database connected successfully');

    // 2. AWAIT SEED SUPER ADMIN (Guarantees this runs sequentially)
    if (config.node_env === 'development') {
      console.log('Checking and seeding Super Admin...');
    }
    await seedSuperAdmin();
    if (config.node_env === 'development') {
      console.log('Super Admin verification complete.');
    }

    // 3. START EXPRESS SERVER (Only fires up if steps 1 & 2 pass)
    server = app.listen(config.port, () => {
      config.node_env === 'development'
        ? console.log(`Server running on port ${config.port}`)
        : logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    config.node_env === 'development'
      ? console.error('❌ Bootstrap sequence failed:', error)
      : errorLogger.error('Bootstrap sequence failed:', error);

    // Cleanly close out the DB connection if booting fails
    await prisma.$disconnect();
    process.exit(1);
  }

  // --- EXIT & ERROR HANDLERS ---
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        config.node_env === 'development'
          ? console.log('Server closed')
          : logger.info('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    config.node_env === 'development'
      ? console.log(error)
      : errorLogger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    config.node_env === 'development'
      ? console.log('SIGTERM received')
      : logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

// START SERVER
bootstrap();
export default app;
