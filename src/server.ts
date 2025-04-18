/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { Server } from 'http';
import app from './app';
import { errorLogger, logger } from './shared/logger';
import config from './config';
import { prisma } from './shared/prisma';

async function bootstrap() {
  // CHECK DATABASE CONNECTION
  prisma.$connect().then(() => {
    config.node_env === 'development'
      ? console.log('Database connected')
      : logger.info('Database connected');
  });

  // SERVER
  const server: Server = app.listen(config.port, () => {
    config.node_env === 'development'
      ? console.log(`Server running on port ${config.port}`)
      : logger.info(`Server running on port ${config.port}`);
  });

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

bootstrap();
