const {
  Unauthorized,
  BadRequest,
  GeneralError,
} = require('../../../utilities/error');
const AdminService = require('./admin.service');
const ResponseHandler = require('../../../utilities/responseHandler');
const CommonService = require('../../../utilities/common');
const _ = require('lodash');
const User = require('../user.model');
const CONFIG = require('../../../config/application.config');

class AdminController {
  constructor() {}
  async signup(req, res, next) {
    try {
      let response = await AdminService.createUser(req.body, req.file);
      ResponseHandler.createdResponse(res, {
        message: 'User signup successful!',
        result: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      let response = await AdminService.loginAdmin(req.body);
      if (response) {
        // Disable login if the user is Deleted / Blocked / inActive
        if (
          response.role !== 'admin' ||
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

  async getUsers(req, res, next) {
    try {
      let query = {};
      if ('role' in req.query === true) {
        query['role'] = req.query.role;
      }
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      let response = await AdminService.getUsers(query, page, limit);
      if (response) {
        ResponseHandler.okResponse(res, response);
      } else {
        throw new BadRequest('Error while fetching Users data!');
      }
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      let response = await AdminService.updatePassword(
        req.body,
        req.user.email
      );
      ResponseHandler.createdResponse(res, {
        message: 'Password change successful!',
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new AdminController();
