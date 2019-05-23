const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    Object.keys(data).forEach(key => {
        if (isEmpty(data[key])) {
            errors[key] = `${key} required`
        } else if (key === 'name' && !Validator.isLength(data.name, {min: 2, max: 30})) {
            errors.name = 'name should be between 2 and 30 characters'
        } else if (key === 'email' && !Validator.isEmail(data[key])) {
            errors[key] = 'bad email'
        } else if (key === 'password' || key === 'password2') {
            if (!Validator.isLength(data[key], {min: 6, max: 30})) {
                errors[key] = `${key} should be between 6 and 30 characters`
            }

        }
    });

    return {
        errors,
        isValid: isEmpty(errors)
    }
};