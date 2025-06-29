"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleValidationError = (error) => {
    const statusCode = http_status_1.default.UNPROCESSABLE_ENTITY;
    const errorMessages = error.message.split('\n');
    const errorSources = errorMessages
        .filter((line) => line.trim().startsWith('Argument'))
        .map((line) => {
        const pathMatch = line.match(/Argument `(.*?)`/);
        const path = pathMatch ? pathMatch[1] : '';
        return {
            path,
            message: line.trim(),
        };
    });
    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    };
};
exports.default = handleValidationError;
