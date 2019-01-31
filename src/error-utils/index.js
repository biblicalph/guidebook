import { isEmpty } from 'lodash/fp';
import joi from 'joi';

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
 * @param {Object} options
 * @param {String} options.name - the name of the error.
 * @param {String} options.message - the error message
 * @param {Array} [options.details] - the error details
 * @param {String} [options.details.field] - the error details field
 * @param {String} [options.details.value] - the error details value
 * @param {String} [options.details.message] - the error details message
 * @param {String} [options.code] - the error code
 * @return {Object} the error object
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
