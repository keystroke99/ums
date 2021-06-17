let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let User = require('../modules/user/user.model');
const logger = require('../config/winston.config');
const {
  AccessForbidden,
  BadRequest,
  GeneralError,
  Unauthorized,
} = require('../utilities/error');
const CONFIG = require('../config/application.config');
const _ = require('lodash');
class CommonService {
  constructor() {}
  createToken = (data, expiresIn) => {
    try {
      return jwt.sign(data, CONFIG.CLIENT_IDENTIFIER_SECRET, {
        // expiresIn: CONFIG.CLIENT_TOKEN_EXPIRY_DURATION
        expiresIn: expiresIn,
        mutatePayload: true,
      });
    } catch (error) {
      logger.log('error', error);
      throw new GeneralError(500, `Error while creating JWT`);
    }
  };

  decodeToken = jwtToken => {
    try {
      return jwt.decode(jwtToken, {
        complete: true,
        json: true,
      });
    } catch (error) {
      logger.log('error', error);
      throw new GeneralError(`Error while decoding jwt token`);
    }
  };

  verifyToken = jwtToken => {
    try {
      return jwt.verify(jwtToken, CONFIG.CLIENT_IDENTIFIER_SECRET);
    } catch (error) {
      throw new GeneralError(error.message);
    }
  };

  authenticateUser = async (req, res, next) => {
    try {
      // Gather the jwt access token from the request header
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token == null) throw new Unauthorized('Unauthorized client'); // if there isn't any token
      if (authHeader.split(' ')[0]) {
        if (authHeader.split(' ')[0] != 'Bearer') {
          throw new Unauthorized('Unauthorized client');
        }
      }
      await jwt.verify(
        token,
        CONFIG.CLIENT_IDENTIFIER_SECRET,
        async (err, user) => {
          if (err) throw new AccessForbidden('Access Forbidden');
          let userInfo = await User.findById(user._id).lean();
          if (userInfo) {
            if (userInfo._id.toString() == user._id) {
              req.user = userInfo;
            } else {
              throw new AccessForbidden('Access Forbidden');
            }
          } else {
            throw new AccessForbidden('Access Forbidden');
          }
          next(); // pass the execution off to whatever request the client intended
        }
      );
    } catch (error) {
      next(error);
    }
  };

  isAdmin = async (req, res, next) => {
    try {
      if (req.user.role === 'admin') {
        return next();
      } else {
        throw new AccessForbidden('Access Forbidden');
      }
    } catch (error) {
      next(error);
    }
  };

  parseRequestBody = async (req, res, next) => {
    try {
      // we have to parse this "address" data as it is taken from FORM DATA
      if ('address' in req.body === true) {
        let newReqBody = Object.assign({}, req.body);
        let parsedAddress;
        parsedAddress = JSON.parse(newReqBody.address);
        newReqBody.address = JSON.parse(parsedAddress);
        req.body = newReqBody;
        return next();
      } else {
        return next();
      }
    } catch (error) {
      next(error);
    }
  };

  createRandomString(length) {
    let chars =
      'abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890!@#$%^&*()_+';
    let pwd = _.sampleSize(chars, length || 12); // lodash v4: use _.sampleSize
    return pwd.join('');
  }

  createPasswordHash = password => {
    try {
      return bcrypt.hashSync(password, 10);
    } catch (error) {
      logger.log('error', error);
      throw new BadRequest(`Error while creating Password Hash`);
    }
  };

  comparePassword = (password, hashedPassword) => {
    try {
      return bcrypt.compareSync(password, hashedPassword);
    } catch (error) {
      logger.log('error', `Error while comparing the password bcrypt`, error);
      throw new Unauthorized(
        `Invalid Credentials - Error while comparing the password bcrypt`
      );
    }
  };

  //common function to return error response or make next() call to controller
  validationResponse = (res, err, status, next) => {
    if (!status) {
      res.status(400).send({
        message: 'Validation failed',
        data: err,
      });
    } else {
      next();
    }
  };
}

module.exports = new CommonService();
