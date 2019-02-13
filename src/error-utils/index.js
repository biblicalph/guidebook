import { isEmpty } from 'lodash/fp';
import joi from 'joi';

/**
 * @typedef {Object} ErrorDetail
 * @property {String} field - the error field/property
 * @property {String} value - the error value
 * @property {String} message - the error message
 *
 * @typedef {Object} ErrorOptions
 * @property {String} name - the error name
 * @property {String} message - the error message
 * @property {ErrorDetail[]} [details] - array of error details
 * @property {String} [code] - optional error code
 *
 * @typedef {Object} CustomError
 * @property {String} message - the error message
 * @property {String} name - the error name
 * @property {String} [code] - the error code
 * @property {String} stack - the error stack trace
 * @property {ErrorDetail[]} [details] - the error details
 */
const errorDetailsEntrySchema = joi
  .object()
  .keys({
    field: joi.string().allow('', null),
    value: joi.string().allow('', null),
    message: joi.string().required(),
  })
  .unknown();

const validationErrorDetailsSchema = joi.object().keys({
  details: joi
    .array()
    .min(1)
    .items(errorDetailsEntrySchema)
    .required(),
});

const errorSchema = joi
  .object()
  .keys({
    name: joi.string().required(),
    message: joi.string().required(),
    code: joi.string(),
    details: joi.array().items(errorDetailsEntrySchema),
  })
  .unknown();

/**
 * Create a new error. Omit stacktrace above the calling function
 * @param {ErrorOptions} options
 * @return {CustomError} an instance of error
 */
export const createCustomError = ({ name, message, details, code }) => {
  const opts = joi.attempt({ name, message, details, code }, errorSchema);

  const newError = Error(opts.message);
  Object.entries(opts)
    .filter(([_, val]) => !isEmpty(val)) // eslint-disable-line no-unused-vars
    .forEach(([key, val]) => {
      newError[key] = val;
    });

  // display only function calls that happened before this function in the call stack
  Error.captureStackTrace(newError, createCustomError);

  return newError;
};

export const VALIDATION_ERROR_NAME = 'GuidebookValidationError';

/**
 * Create a validation error
 * @param {ErrorOptions} options
 * @return {CustomError} a validation error
 */
export function createValidationError({
  name = VALIDATION_ERROR_NAME,
  message,
  details,
  code,
}) {
  joi.attempt({ details }, validationErrorDetailsSchema);

  return createCustomError({
    name,
    message,
    details,
    code,
  });
}
