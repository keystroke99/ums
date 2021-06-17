const User = require('../user.model');
const logger = require('../../../config/winston.config');
const CommonService = require('../../../utilities/common');
const MailController = require('../../../utilities/mailer');
const { BadRequest, GeneralError } = require('../../../utilities/error');
const CONFIG = require('../../../config/application.config');

class AdminService {
  constructor() {}
  async createUser(userObj, fileInfo) {
    try {
      // check if email already exists
      if (await User.exists({ email: userObj.email })) {
        throw new BadRequest('Email already registered!');
      }
      // Check and Append the ProfilePic Details
      if (fileInfo !== undefined) {
        userObj.profilePic = {
          uploadType: CONFIG.STORAGE_OPTION,
          fileInfo: fileInfo,
        };
      }
      // Create a Random Password
      let password = CommonService.createRandomString(8);
      // Send the password in the welcome email
      MailController.sendMail(
        userObj.email,
        'Welcome to KiloWatt!',
        {
          firstName: userObj.firstName,
          password: password,
        },
        'welcome'
      );
      // Hash the password
      userObj.password = CommonService.createPasswordHash(password);
      return await User.create(userObj);
    } catch (error) {
      logger.log(
        'error',
        `Error while creating new user - ${new Error().stack
          .split('at ')[1]
          .trim()}`,
        error
      );
      throw error;
    }
  }

  async loginAdmin(userObj) {
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

  async getUsers(query, page, limit) {
    try {
      let options = { page: page, limit: limit };
      let response = await User.paginate(query, options);
      if (response) {
        return response;
      } else {
        throw new GeneralError('Error while fetching the Users data!');
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
}
module.exports = new AdminService();
