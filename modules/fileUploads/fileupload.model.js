const mongoose = require('mongoose');

const FileUploadSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    uploadType: {
      type: String,
    },
    fileInfo: {
      type: Object,
    },
  },
  {
    collection: 'fileuploads',
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

module.exports = mongoose.model('FileUpload', FileUploadSchema);
