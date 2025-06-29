"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const errorLog_controller_1 = require("./errorLog.controller");
const router = express_1.default.Router();
router.get('/', errorLog_controller_1.ErrorLogControllers.errorLogs);
exports.errorRoutes = router;
