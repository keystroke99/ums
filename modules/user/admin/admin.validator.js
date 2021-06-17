const Validator = require('../../../utilities/validator');
let CommonService = require('../../../utilities/common');

let userSignUpRule = {
  firstName: 'required|string',
  lastName: 'string',
  email: 'required|string|email',
  gender: 'string|in:NA,male,female,dont_disclose',
  'address.*.type': 'required|string',
};

let userLoginRule = {
  email: 'required|string|email',
  password: 'required|string',
};

let changePasswordRule = {
  currentPassword: 'required|string',
  newPassword: 'required|string|min:8|strict',
};

class AdminValidator {
  constructor() {}
  async signupValidation(req, res, next) {
    try {
      Validator(req.body, userSignUpRule, {}, (err, status) => {
        CommonService.validationResponse(res, err, status, next);
      });
    } catch (error) {
      next(error);
    }
  }

  async LoginValidation(req, res, next) {
    try {
      Validator(req.body, userLoginRule, {}, (err, status) => {
        CommonService.validationResponse(res, err, status, next);
      });
    } catch (error) {
      next(error);
    }
  }

  async ChangePasswordValidator(req, res, next) {
    try {
      Validator(req.body, changePasswordRule, {}, (err, status) => {
        CommonService.validationResponse(res, err, status, next);
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new AdminValidator();
