import * as joi from 'joi';

/**
 * Validate the db url
 * @param {String} dbUrl - the db url
 * @return {String} the db url if valid
 * @throws {Error} joi validation error
 */
export default dbUrl => {
  const { error, value } = joi.validate(
    dbUrl,
    joi
      .string()
      .regex(/^mongodb:\/\//)
      .required(),
  );

  if (error) {
    throw new Error(`Database url validation error: ${error.message}`);
  }

  return value;
};
