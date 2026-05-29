"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const notFoundRoute_1 = __importDefault(require("./app/middlewares/notFoundRoute"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// VIEW ENGINE SETUP
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(process.cwd(), 'src/app/views'));
// Application routes
app.use('/api/', routes_1.default);
//global error handler
app.use(globalErrorHandler_1.default);
//handle not found route
app.use(notFoundRoute_1.default);
exports.default = app;
