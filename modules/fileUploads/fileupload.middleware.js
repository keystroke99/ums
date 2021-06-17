const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const crypto = require('crypto');

// Local Storgage with Multer Plugin
let LocalStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

// AWS Upload Method with Multer Plugin
let AwsS3Storage = multerS3({
  s3: new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'xxxxx',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID || 'xxxx',
  }),
  bucket: process.env.BUCKET_NAME || 'xxxx',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'public-read',
  key: (req, file, cb) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) cb(err);
      const fileName = `${hash.toString('hex')}-${file.originalname}`;
      cb(null, fileName); // multer-s3 already generate the property req.file.key to return the filename
    });
  },
});

const storageTypes = {
  local: LocalStorage,
  s3: AwsS3Storage,
};

class FileUploadMiddleware {
  upload = multer({ storage: storageTypes[process.env.STORAGE_OPTION] });
}
module.exports = new FileUploadMiddleware();
