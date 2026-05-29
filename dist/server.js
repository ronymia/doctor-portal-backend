"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./shared/logger");
const config_1 = __importDefault(require("./config"));
const prisma_1 = require("./shared/prisma");
const seedSuperAdmin_1 = __importDefault(require("./app/DB/seedSuperAdmin"));
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        let server;
        try {
            // 1. CHRONOLOGICAL DATABASE CONNECTION
            yield prisma_1.prisma.$connect();
            config_1.default.node_env === 'development'
                ? console.log('Database connected successfully')
                : logger_1.logger.info('Database connected successfully');
            // 2. AWAIT SEED SUPER ADMIN (Guarantees this runs sequentially)
            if (config_1.default.node_env === 'development') {
                console.log('Checking and seeding Super Admin...');
            }
            yield (0, seedSuperAdmin_1.default)();
            if (config_1.default.node_env === 'development') {
                console.log('Super Admin verification complete.');
            }
            // 3. START EXPRESS SERVER (Only fires up if steps 1 & 2 pass)
            server = app_1.default.listen(config_1.default.port, () => {
                config_1.default.node_env === 'development'
                    ? console.log(`Server running on port ${config_1.default.port}`)
                    : logger_1.logger.info(`Server running on port ${config_1.default.port}`);
            });
        }
        catch (error) {
            config_1.default.node_env === 'development'
                ? console.error('❌ Bootstrap sequence failed:', error)
                : logger_1.errorLogger.error('Bootstrap sequence failed:', error);
            // Cleanly close out the DB connection if booting fails
            yield prisma_1.prisma.$disconnect();
            process.exit(1);
        }
        // --- EXIT & ERROR HANDLERS ---
        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    config_1.default.node_env === 'development'
                        ? console.log('Server closed')
                        : logger_1.logger.info('Server closed');
                });
            }
            process.exit(1);
        };
        const unexpectedErrorHandler = (error) => {
            config_1.default.node_env === 'development'
                ? console.log(error)
                : logger_1.errorLogger.error(error);
            exitHandler();
        };
        process.on('uncaughtException', unexpectedErrorHandler);
        process.on('unhandledRejection', unexpectedErrorHandler);
        process.on('SIGTERM', () => {
            config_1.default.node_env === 'development'
                ? console.log('SIGTERM received')
                : logger_1.logger.info('SIGTERM received');
            if (server) {
                server.close();
            }
        });
    });
}
// START SERVER
bootstrap();
