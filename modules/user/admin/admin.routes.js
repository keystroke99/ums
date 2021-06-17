let express = require('express');
let adminRouter = express.Router();
let AdminController = require('./admin.controller');
let AdminValidator = require('./admin.validator');
let CommonService = require('../../../utilities/common');
let FileUploadMiddleware = require('../../fileUploads/fileupload.middleware');

// ****************** ADMIN ROUTES *****************
// Expose the create route with only Admin Access
adminRouter.post(
  '/admin/users',
  FileUploadMiddleware.upload.single('profilePic'),
  CommonService.authenticateUser,
  CommonService.isAdmin,
  CommonService.parseRequestBody,
  AdminValidator.signupValidation,
  AdminController.signup
);
adminRouter.get(
  '/admin/users',
  CommonService.authenticateUser,
  CommonService.isAdmin,
  AdminController.getUsers
);
adminRouter.post(
  '/admin/login',
  AdminValidator.LoginValidation,
  AdminController.login
);
adminRouter.post(
  '/admin/changePassword',
  CommonService.authenticateUser,
  CommonService.isAdmin,
  AdminValidator.ChangePasswordValidator,
  AdminController.changePassword
);

module.exports = adminRouter;
