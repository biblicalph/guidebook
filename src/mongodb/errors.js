import { get } from 'lodash/fp';
import { createValidationError, createCustomError } from '../error-utils';

const castErrorName = 'CastError';
const validationErrorName = 'ValidationError';
const dbValidationErrorName = 'DatabaseValidationError';
const queryRequiredErrorName = 'QueryRequiredError';

/**
 * Returns an array of error objects retrieved from the mongoose validation error
 * @param {Object} error - the error object
 * @return {Array} errors - an array of error objects
 * @return {String} errors[].param - the param or field which failed validation
 * @return {String|undefined} errors[].value - the value for the param
 * @return {String} errors[].msg - the validation error message
 */
const getMongooseValidationErrors = error => {
  const mongooseErrors = (error && error.errors) || {};

  return Object.keys(mongooseErrors).map(field => {
    const isUniqueKeyError = /duplicate/i.test(mongooseErrors[field].kind);

    return {
      field,
      value: mongooseErrors[field].value,
      message: isUniqueKeyError
        ? `${field} (${mongooseErrors[field].value}) is not unique`
        : mongooseErrors[field].message,
    };
  });
};

/**
 * Returns array of error objects retrieved from mongoose cast error
 * @param {Object} error - the error object
 * @return {Array} errors - an array of error objects
 * @return {String} errors[].param - the param or field which failed validation
 * @return {String|undefined} errors[].value - the value for the param
 * @return {String} errors[].msg - the validation error message
 */
const getMongooseCastError = error => {
  const errors = [];

  errors.push({
    field: error.path,
    value: error.value,
    message: error.message,
  });

  return errors;
};

/**
 * Returns true if the given error object is a ValidationError
 * @param {Object} error - the error object
 * @return {boolean} - true if the error is of type ValidationError
 */
const isMongooseValidationError = error =>
  error && error.name === validationErrorName;

/**
 * Returns true if the given error object is a CastError
 * @param {Object} error - the error object
 * @return {boolean} - true if the error is of type ValidationError
 */
const isMongooseCastError = error => error && error.name === castErrorName;

/**
 * Returns true if error is a Mongoose error that should be converted to validation errors
 * @param {Object} error - the error object
 * @returns {boolean}
 */
const isConvertibleToValidationError = error =>
  isMongooseCastError(error) || isMongooseValidationError(error);

/**
 * Convert mongoose error to validation error
 * @param {Error} error - the error object
 * @return {import('../error-utils').CustomError|Error} the original error or a validation error
 */
const convertMongooseErrorToValidationError = error =>
  createValidationError({
    name: dbValidationErrorName,
    message: error.message,
    details: isMongooseCastError(error)
      ? getMongooseCastError(error)
      : getMongooseValidationErrors(error),
  });

/**
 * Returns new error if Mongodb cast or validation error
 * @param {Object} error - the Mongoose error
 * @param {Object} the original error or a new error
 */
export const formatMongodbErrors = error => {
  if (!isConvertibleToValidationError(error)) {
    return error;
  }

  return convertMongooseErrorToValidationError(error);
};

/**
 * Returns true if the error is a database validation error
 * @param {Error} error - the error object
 * @return {boolean}
 */
export const isDatabaseValidationError = error =>
  get('name')(error) === dbValidationErrorName;

export const DB_VALIDATION_ERROR_NAME = dbValidationErrorName;

/**
 * Create query required error
 * @param {String} [message = 'Query is required'] - the error message
 * @return {import('../error-utils').CustomError} a query required error
 */
export const createQueryRequiredError = (message = 'Query is required') =>
  createCustomError({
    name: queryRequiredErrorName,
    message,
  });

/**
 * Returns true if the error is a query required error
 * @param {Error} error - the error object
 * @return {boolean}
 */
export const isQueryRequiredError = error =>
  get('name')(error) === queryRequiredErrorName;

export const QUERY_REQUIRED_ERROR_NAME = queryRequiredErrorName;
