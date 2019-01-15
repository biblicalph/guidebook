import * as joi from 'joi';

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
