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
const logger_1 = require("../../shared/logger");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const zod_1 = require("zod");
const config_1 = __importDefault(require("../../config"));
const handleZodError_1 = __importDefault(require("../../errors/handleZodError"));
const prisma_1 = require("../../../generated/prisma");
const handleValidationError_1 = __importDefault(require("../../errors/handleValidationError"));
const handleClientKnownError_1 = __importDefault(require("../../errors/handleClientKnownError"));
const logError_1 = require("../../shared/logError");
const handleClientInitializationError_1 = __importDefault(require("../../errors/handleClientInitializationError"));
const globalErrorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = req.headers['authorization'] || null;
    // Extract user ID from auth middleware or token (custom logic)
    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
    const ipAddress = ((_b = req.headers['x-forwarded-for']) === null || _b === void 0 ? void 0 : _b.toString().split(',')[0]) ||
        req.socket.remoteAddress;
    //Debug
    if (config_1.default.node_env === 'development') {
        // eslint-disable-next-line no-console
        console.debug(`🐱‍🏍 globalErrorHandler ~~`, err);
        logger_1.errorLogger.error(`🐱‍🏍 globalErrorHandler ~~`, err);
    }
    else {
        logger_1.errorLogger.error(`🐱‍🏍 globalErrorHandler ~~`, err);
    }
    //SETTING DEFAULT VALUES
    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorSources = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];
    /*
      ?CHECKING ERRORS TYPE
     * Zod validation error
     * PrismaClientValidationError validation error
     * Duplicate Entity Error
     * mongoose cast error => invalid ObjectId
     * Custom throw error
     */
    //  ZOD ERRORS
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof prisma_1.Prisma.PrismaClientInitializationError) {
        const simplifiedError = (0, handleClientInitializationError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof prisma_1.Prisma.PrismaClientValidationError) {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = (0, handleClientKnownError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    // LOG ERROR INTO DATABASE
    const errorLogs = yield (0, logError_1.logError)({
        token: typeof token === 'string' ? token : undefined,
        userId: typeof userId === 'string' ? userId : undefined,
        ipAddress,
        error: err,
        payload: {
            method: req.method,
            url: req.originalUrl,
            body: req.body,
            query: req.query,
            params: req.params,
        },
    });
    //ultimate return
    return res.status(statusCode).json({
        success: false,
        message: ` Error ID : ${errorLogs === null || errorLogs === void 0 ? void 0 : errorLogs.id} - ${message}`,
        errorSources,
        err,
        stack: config_1.default.node_env === 'development' ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
});
exports.default = globalErrorHandler;
