const User = require('./user.model');
const CommonService = require('../../utilities/common');
const { BadRequest, GeneralError } = require('../../utilities/error');
const { updateProfile } = require('./user.controller');
const CONFIG = require('../../config/application.config');

class UserService {
  constructor() {}

  async loginUser(userObj) {
    try {
      let response = await User.findOne({ email: userObj.email }).lean();
      if (response) {
        // check for password
        if (
          CommonService.comparePassword(userObj.password, response.password)
        ) {
          delete response.password;
          return response;
        } else {
          throw new GeneralError('Invalid logins');
        }
      } else {
        throw new GeneralError('Invalid logins');
      }
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(userObj, email) {
    try {
      let response = await User.findOne({ email: email }).lean();
      if (response) {
        // check for password
        if (
          CommonService.comparePassword(
            userObj.currentPassword,
            response.password
          )
        ) {
          // Hash the new password and update in DB
          let hashedPassword = CommonService.createPasswordHash(
            userObj.newPassword
          );
          return await User.findByIdAndUpdate(response._id, {
            password: hashedPassword,
          });
        } else {
          throw new GeneralError('Current Password does not match!');
        }
      } else {
        throw new GeneralError('Error while updating password!');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userObj, fileInfo, email) {
    try {
      console.log('=== update proflie ', userObj, email);
      let response = await User.findOne({ email: email }).lean();
      if (response) {
        // Check and Append the ProfilePic Details
        if (fileInfo !== undefined) {
          userObj.profilePic = {
            uploadType: CONFIG.STORAGE_OPTION,
            fileInfo: fileInfo,
          };
        }
        return await User.findByIdAndUpdate(response._id, userObj, {
          new: true,
        });
      } else {
        throw new GeneralError('Error while updating password!');
      }
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new UserService();
