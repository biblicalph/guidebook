import { get } from 'lodash/fp';
import Promise from 'bluebird';
import faker from 'faker';
import { DB_VALIDATION_ERROR_NAME } from '../../src/mongodb';
import { createCustomError } from '../../src/error-utils';

export { default as factory } from './factory';
export { userModel, businessModel } from './models';

export const expectToBePlainObject = obj => {
  expect(get('constructor.name')(obj)).toBe('Object');
};

export const streamToPromise = stream =>
  new Promise((resolve, reject) => {
    const streamData = [];

    stream
      .on('data', data => {
        streamData.push(data);
      })
      .on('error', err => {
        reject(err);
      })
      .on('end', () => resolve(streamData));
  });

export const createMongooseCastError = () => {
  const error = createCustomError({
    name: 'CastError',
    message: faker.lorem.sentence(),
  });
  error.path = faker.random.word();
  error.value = faker.random.word();

  return error;
};

export const createMongooseValidationError = () => {
  const error = createCustomError({
    name: 'ValidationError',
    message: faker.lorem.sentence(),
  });
  error.errors = {
    email: {
      value: faker.random.word(),
      message: 'Email must be a valid email address',
    },
  };

  return error;
};

export const expectToBeValidationError = error => {
  expect(error.name).toMatch(/.*ValidationError/);
  expect(Array.isArray(error.details)).toBe(true);
  expect(error.details.length).toBeGreaterThan(0);
  error.details.forEach(detail => {
    expect(Object.keys(detail)).toEqual(['field', 'value', 'message']);
  });
};

export const expectToBeDbValidationError = error => {
  expectToBeValidationError(error);
  expect(error.name).toEqual(DB_VALIDATION_ERROR_NAME);
};
