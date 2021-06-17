let express = require('express');
let userRouter = express.Router();
let UserController = require('./user.controller');
let UserValidator = require('./user.validator');
let CommonService = require('../../utilities/common');
let FileUploadMiddleware = require('../fileUploads/fileupload.middleware');

// ****************** USER ROUTES *****************
userRouter.post(
  '/user/login',
  UserValidator.LoginValidation,
  UserController.login
);

userRouter.post(
  '/user/changePassword',
  CommonService.authenticateUser,
  UserValidator.ChangePasswordValidator,
  UserController.changePassword
);

userRouter.post(
  '/user/updateProfile',
  FileUploadMiddleware.upload.single('profilePic'),
  CommonService.authenticateUser,
  CommonService.parseRequestBody,
  UserValidator.UpdateProfileValidator,
  UserController.updateProfile
);

module.exports = userRouter;
