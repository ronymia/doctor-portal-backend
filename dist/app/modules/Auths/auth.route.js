"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
/***************
 * @api {post} /products
 * @apiDescription create a new product
 * @apiPermission  superAdmin , admin
 *
 * @apiHeader {string} => user's access token
 * @apiHeaderExample {json} Header-Example:
 *
 * @apiQuery {page}   [page=1] => List pages
 * @apiQuery {Number{1-100}}    [Limit=10] per page
 *
 *@apiSuccess {Object[]} Response=> data:product object
 *
 *@apiError {Unauthorized 401} => only authorized users can access this
 *@apiError {forbidden 403} => only only can access this
 *
 *********************/
router
    .route('/login')
    .post((0, validateRequest_1.default)(auth_validation_1.AuthValidations.loginZodSchema), auth_controller_1.AuthControllers.loginUser);
router
    .route('/refresh-token')
    .post((0, validateRequest_1.default)(auth_validation_1.AuthValidations.refreshTokenZodSchema), auth_controller_1.AuthControllers.refreshToken);
// EXPORT
exports.AuthRoutes = router;
