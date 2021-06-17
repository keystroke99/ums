let express = require('express');
let fileUploadRouter = express.Router();
let CommonModule = require('../../modules/common.module');
let FileUploadModule = require('./fileupload.module');
let FileUploadMiddleware = require('./fileupload.middleware');

fileUploadRouter.post(
  '/files/upload',
  CommonModule.CommonService.authenticateUser,
  FileUploadMiddleware.upload.any(),
  FileUploadModule.FileUploadController.uploadFiles
);

module.exports = fileUploadRouter;
