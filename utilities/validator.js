const Validator = require('validatorjs');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

// Tighten password policy
Validator.register(
  'strict',
  value => passwordRegex.test(value),
  'password must contain at least one uppercase letter, one lowercase letter and one number'
);

const validator = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  if (validation.fails()) {
    callback(validation.errors, false);
  } else {
    callback(null, true);
  }
};

module.exports = validator;
