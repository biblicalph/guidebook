import faker from 'faker';
import {
  formatMongodbErrors,
  createQueryRequiredError,
  isDatabaseValidationError,
  isQueryRequiredError,
  QUERY_REQUIRED_ERROR_NAME,
} from '../../src/mongodb/errors';
import {
  createMongooseCastError,
  expectToBeDbValidationError,
  createMongooseValidationError,
} from '../utils';

describe('Mongodb Repository Errors Spec', () => {
  describe('Format Mongodb Errors', () => {
    it('should return given error if it is not a Mongodb error', () => {
      const error = Error(faker.lorem.sentence());

      const newError = formatMongodbErrors(error);

      expect(newError).toEqual(error);
    });

    it('should format Mongodb cast error as db validation error', () => {
      const castError = createMongooseCastError();

      const newError = formatMongodbErrors(castError);

      expectToBeDbValidationError(newError);
    });

    it('should format Mongodb validation error as db validation error', () => {
      const validationError = createMongooseValidationError();

      const newError = formatMongodbErrors(validationError);

      expectToBeDbValidationError(newError);
    });
  });

  describe('Is Database Validation Error', () => {
    it('should return true if error is a database validation error', () => {
      const validationError = createMongooseValidationError();
      const dbValidationError = formatMongodbErrors(validationError);

      expect(isDatabaseValidationError(dbValidationError)).toBe(true);
    });

    it('should return false if error is not a database validation error', () => {
      const error = Error(faker.lorem.sentence);
      const newError = formatMongodbErrors(error);

      expect(isDatabaseValidationError(newError)).toBe(false);
    });
  });

  describe('Create Query Required Error', () => {
    let message;
    let error;

    beforeEach(() => {
      message = faker.lorem.sentence();
      error = createQueryRequiredError(message);
    });

    it('should return an instance of Error', () => {
      expect(error).toBeInstanceOf(Error);
    });

    it('should return an error with the correct message', () => {
      expect(error).toHaveProperty('message', error.message);
    });

    it('should return an error with the correct name', () => {
      expect(error).toHaveProperty('name', QUERY_REQUIRED_ERROR_NAME);
    });
  });

  describe('Is Query Required Error', () => {
    it('should return true if error is a query required error', () => {
      const error = createQueryRequiredError(faker.lorem.sentence());

      expect(isQueryRequiredError(error)).toBe(true);
    });

    it('should return false if error is not a query required error', () => {
      const error = Error(faker.lorem.sentence());

      expect(isQueryRequiredError(error)).toBe(false);
    });
  });
});
