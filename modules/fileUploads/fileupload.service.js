let FileUpload = require('./fileupload.model');
class FileUploadService {
  constructor() {}
  insertFileDetails = async (userId, uploadType, fileInfo) => {
    try {
      // Construct InsertMany Object
      let insertManyObj = [];
      fileInfo.forEach(element => {
        insertManyObj.push({
          userId: userId,
          uploadType: uploadType,
          fileInfo: element,
        });
      });
      return await FileUpload.insertMany(insertManyObj);
    } catch (error) {
      throw error.message;
    }
  };
}
module.exports = new FileUploadService();
