const { GeneralError } = require('./error');
const fs = require('fs');
const handleErrors = (err, req, res, next) => {
  // check and delete if any multer file exists
  if (req.file !== undefined) {
    fs.unlinkSync(req.file.path);
  }

  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: 'error',
      statusCode: err.getCode(),
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    statusCode: '500',
    message: err.message,
  });
};

module.exports = handleErrors;
