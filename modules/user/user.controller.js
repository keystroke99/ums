const {
  Unauthorized,
  BadRequest,
  GeneralError,
} = require('../../utilities/error');
const UserService = require('./user.service');
const ResponseHandler = require('../../utilities/responseHandler');
const CommonService = require('../../utilities/common');
const _ = require('lodash');
const User = require('./user.model');
const CONFIG = require('../../config/application.config');

class UserController {
  constructor() {}

  async login(req, res, next) {
    try {
      let response = await UserService.loginUser(req.body);
      if (response) {
        // Disable login if the user is Deleted / Blocked / inActive
        if (
          response.status !== 'active' ||
          ('isDeleted' in response === true && response.isDeleted === true)
        ) {
          throw new Unauthorized('Unauthorized Access / Invalid User!');
        }
        let token = CommonService.createToken(
          {
            _id: response._id,
            email: response.email,
            role: response.role,
          },
          CONFIG.CLIENT_TOKEN_EXPIRY_DURATION // Expires in 3 Minutes
        );
        // Update the lastLoginTime
        await User.findByIdAndUpdate(response._id, {
          lastLoginTime: new Date(),
        });
        ResponseHandler.okResponse(res, {
          message: 'User Login successful!!',
          result: {
            token: token,
            data: response,
          },
        });
      } else {
        throw new GeneralError('Unknown error while logging in');
      }
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      let response = await UserService.updatePassword(req.body, req.user.email);
      ResponseHandler.createdResponse(res, {
        message: 'Password change successful!',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      let response = await UserService.updateProfile(
        req.body,
        req.file,
        req.user.email
      );
      ResponseHandler.createdResponse(res, {
        message: 'Profile updated successfully!',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UserController();
