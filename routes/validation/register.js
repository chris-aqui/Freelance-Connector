// see docs https://www.npmjs.com/package/validator
import isEmpty from './is-empty';

const Validator = require('validator');

module.exports = function validateRegisterInput(data) {
  const errors = {}; // init

  // register name should be 2 char long
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters long';
  }

  return {
    errors, // this is an object
    isValid: isEmpty(errors), // this needs to be a string
  };
};
