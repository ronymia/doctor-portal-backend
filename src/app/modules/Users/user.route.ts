import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidationSchemas } from './user.validation';
import { FileUploadHelper } from '../../../shared/fileUploadHelper';
import { z } from 'zod';
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
router.post('/create-doctor', UserControllers.createDoctor);

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
router.post('/create-patient', UserControllers.createPatient);

export const UserRoutes = router;
