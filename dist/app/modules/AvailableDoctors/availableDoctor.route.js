"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableDoctorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const availableDoctor_controller_1 = require("./availableDoctor.controller");
const router = express_1.default.Router();
router.route('/').get(availableDoctor_controller_1.AvailableDoctorControllers.getAllAvailableDoctorsFromDB);
router.route('/').post(availableDoctor_controller_1.AvailableDoctorControllers.createAvailableDoctorIntoDB);
exports.AvailableDoctorRoutes = router;
