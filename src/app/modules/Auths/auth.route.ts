import express from 'express';
import { AuthControllers } from './auth.controller';
import { AuthValidations } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';

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
  .route('/login')
  .post(
    validateRequest(AuthValidations.loginZodSchema),
    AuthControllers.loginUser,
  );
router
  .route('/refresh-token')
  .post(
    validateRequest(AuthValidations.refreshTokenZodSchema),
    AuthControllers.refreshToken,
  );

// EXPORT
export const AuthRoutes = router;
