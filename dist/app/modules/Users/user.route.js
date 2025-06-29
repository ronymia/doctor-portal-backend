"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const user_validation_1 = require("./user.validation");
const fileUploadHelper_1 = require("../../../shared/fileUploadHelper");
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
    .route('/create-admin')
    .post((0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN), fileUploadHelper_1.FileUploadHelper.upload.single('file'), (req, res, next) => {
    var _a;
    req.body = user_validation_1.UserValidationSchemas.createAdminZodSchema.parse(JSON.parse(req.body.data));
    req.body.profile.profilePicture = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path;
    // console.log({ rowData: req.body });
    return user_controller_1.UserControllers.createAdmin(req, res, next);
});
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
// router.post('/create-doctor', UserControllers.createDoctor);
router.post('/create-doctor', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), fileUploadHelper_1.FileUploadHelper.upload.single('file'), (req, res, next) => {
    var _a;
    req.body = user_validation_1.UserValidationSchemas.createDoctorZodSchema.parse(JSON.parse(req.body.data));
    req.body.profile.profilePicture = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path;
    // console.log({ rowData: req.body });
    return user_controller_1.UserControllers.createDoctor(req, res, next);
});
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
// router.post('/create-patient', UserControllers.createPatient);
router.post('/create-patient', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), fileUploadHelper_1.FileUploadHelper.upload.single('file'), (req, res, next) => {
    var _a;
    req.body = user_validation_1.UserValidationSchemas.createPatientZodSchema.parse(JSON.parse(req.body.data));
    req.body.profile.profilePicture = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path;
    // console.log({ rowData: req.body });
    return user_controller_1.UserControllers.createPatient(req, res, next);
});
router.route('/').get(user_controller_1.UserControllers.getAllUsers);
exports.UserRoutes = router;
