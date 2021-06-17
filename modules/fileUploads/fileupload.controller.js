let CommonModule = require('../common.module');
let FileUploadService = require('./fileupload.service');

class FileUploadController {
  constructor() {}

  async uploadFiles(req, res, next) {
    try {
      // Upload the files to the local server
      if (req.query.type == 'direct') {
        if (req.files.length === 0) {
          throw new CommonModule.ApplicationError.ApplicationError(
            412,
            'Please select minimum 1 File'
          );
        }
        let response = await FileUploadService.insertFileDetails(
          req.user._id,
          req.query.type, // this can be made optional
          req.files
        );
        res.json({ message: 'Files uploaded successfully', data: response });
      } else if (req.query.type == 's3') {
      } else {
        throw new CommonModule.ApplicationError.ApplicationError(
          412,
          'Invalid Upload type'
        );
      }
    } catch (error) {
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.send('Too many files to upload.');
      }
      return res.send(`Error when trying upload many files: ${error}`);
    }
  }
}

module.exports = new FileUploadController();
