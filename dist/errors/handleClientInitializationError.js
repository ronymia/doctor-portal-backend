"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const logger_1 = require("../shared/logger");
const handleClientInitializationError = (error) => {
    // ERROR STATUS CODE
    const statusCode = http_status_1.default.NOT_ACCEPTABLE;
    logger_1.errorLogger.error(`🐱‍🏍 handleClientInitializationError ~~`, error);
    console.log({ error });
    // ERROR MESSAGES
    const errorMessages = error.message.split('\n');
    // ERROR SOURCE
    const errorSources = [
        {
            path: String(error === null || error === void 0 ? void 0 : error.errorCode),
            message: errorMessages[errorMessages.length - 1],
        },
    ];
    return {
        statusCode,
        message: 'Validation error',
        errorSources,
    };
};
exports.default = handleClientInitializationError;
