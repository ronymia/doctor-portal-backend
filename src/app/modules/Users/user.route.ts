import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidationSchemas } from './user.validation';
import { FileUploadHelper } from '../../../shared/fileUploadHelper';
import { IUploadFille } from '../../../interfaces/file';

const router = express.Router();

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
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN),
    FileUploadHelper.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = UserValidationSchemas.createAdminZodSchema.parse(
        JSON.parse(req.body.data),
      );
      req.body.profile.profilePicture = req?.file?.path as IUploadFille['path'];
      // console.log({ rowData: req.body });
      return UserControllers.createAdmin(req, res, next);
    },
  );

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
router.post(
  '/create-doctor',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidationSchemas.createDoctorZodSchema.parse(
      JSON.parse(req.body.data),
    );
    req.body.profile.profilePicture = req?.file?.path as IUploadFille['path'];
    // console.log({ rowData: req.body });
    return UserControllers.createDoctor(req, res, next);
  },
);

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
router.post(
  '/create-patient',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidationSchemas.createPatientZodSchema.parse(
      JSON.parse(req.body.data),
    );
    req.body.profile.profilePicture = req?.file?.path as IUploadFille['path'];
    // console.log({ rowData: req.body });
    return UserControllers.createPatient(req, res, next);
  },
);

router.route('/').get(UserControllers.getAllUsers);

router.patch(
  '/:id/update-doctor',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(UserValidationSchemas.updateDoctorZodSchema),
  UserControllers.updateDoctor,
);

router.patch(
  '/:id/approve-doctor',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserControllers.approveDoctor,
);

router.patch(
  '/:id/reject-doctor',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserControllers.rejectDoctor,
);

router.patch(
  '/:id/suspend-user',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserControllers.suspendUser,
);

router.post(
  '/:id/assign-permissions',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserControllers.assignPermissions,
);

router.post(
  '/:id/remove-permissions',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserControllers.removePermissions,
);

router.get(
  '/:id/permissions',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserControllers.getUserPermissions,
);

export const UserRoutes = router;
