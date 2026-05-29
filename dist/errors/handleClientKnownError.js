"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleClientKnownError = (error) => {
    var _a, _b;
    // ERROR STATUS CODE
    const statusCode = http_status_1.default.NOT_ACCEPTABLE;
    console.log({ error });
    // ERROR MESSAGES
    const errorMessages = error.message.split('\n');
    // ERROR SOURCE
    const errorSources = [
        {
            path: (error === null || error === void 0 ? void 0 : error.meta) && typeof error.meta === 'object'
                ? ((_b = (_a = Object.values(error.meta)[0]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : 'unknown')
                : 'unknown',
            message: errorMessages[errorMessages.length - 1],
        },
    ];
    return {
        statusCode,
        message: 'Bad Request',
        errorSources,
    };
};
exports.default = handleClientKnownError;
