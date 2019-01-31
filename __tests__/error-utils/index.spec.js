import {
  createCustomError,
  createValidationError,
  VALIDATION_ERROR_NAME,
} from '../../src/error-utils';

describe('Error Utils Spec', () => {
  let errorOpts;

  beforeEach(() => {
    errorOpts = {
      message: 'validation error',
      code: 'USER_INFO_ERROR',
      details: [
        {
          field: 'username',
          value: '',
          message: 'username is required',
        },
      ],
    };
  });

  describe('Create Validation Error', () => {
    describe('Failure', () => {
      it('should throw error if details is not an array', () => {
        errorOpts.details = undefined;

        expect(() => createValidationError(errorOpts)).toThrow(
          /"details" is required/,
        );
      });

      it('should throw error if error details is an empty array', () => {
        errorOpts.details = [];

        expect(() => createValidationError(errorOpts)).toThrow(
          /"details" must contain at least 1 item/,
        );
      });

      it('should throw error if error details entry does not contain a message', () => {
        delete errorOpts.details[0].message;

        expect(() => createValidationError(errorOpts)).toThrow(
          /"message" is required/,
        );
      });

      it('should throw error if error details entry contains an empty message', () => {
        errorOpts.details[0].message = '';

        expect(() => createValidationError(errorOpts)).toThrow(
          /"message" is not allowed to be empty/,
        );
      });

      it('should throw error if error message is not provided', () => {
        delete errorOpts.message;

        expect(() => createValidationError(errorOpts)).toThrow(
          /"message" is required/,
        );
      });

      it('should throw error if error message an empty string', () => {
        errorOpts.message = '';

        expect(() => createValidationError(errorOpts)).toThrow(
          /"message" is not allowed to be empty/,
        );
      });
    });

    describe('Success', () => {
      it('should not throw error if error details entry field is null', () => {
        errorOpts.details[0].field = null;
        expect(() => createValidationError(errorOpts)).not.toThrow();
      });

      it('should not throw error if error details entry value is null', () => {
        errorOpts.details[0].value = null;
        expect(() => createValidationError(errorOpts)).not.toThrow();
      });

      it('should not throw error if error details entry field is undefined', () => {
        errorOpts.details[0].field = undefined;
        expect(() => createValidationError(errorOpts)).not.toThrow();
      });

      it('should not throw error if error details entry field is an empty string', () => {
        errorOpts.details[0].field = '';
        expect(() => createValidationError(errorOpts)).not.toThrow();
      });

      it('should not throw error if error details entry value is undefined', () => {
        errorOpts.details[0].value = undefined;
        expect(() => createValidationError(errorOpts)).not.toThrow();
      });

      it('should not throw error if error details entry value is an empty string', () => {
        errorOpts.details[0].field = '';
        expect(() => createValidationError(errorOpts)).not.toThrow();
      });

      it('should return error object with the correct name', () => {
        const error = createValidationError(errorOpts);

        expect(error.name).toBe(VALIDATION_ERROR_NAME);
      });

      it('should return error object with the correct message', () => {
        const error = createValidationError(errorOpts);

        expect(error.message).toBe(errorOpts.message);
      });

      it('should return error object with the correct details', () => {
        const error = createValidationError(errorOpts);

        expect(error.details).toEqual(errorOpts.details);
      });

      it('should omit the error code if not provided', () => {
        delete errorOpts.code;
        const error = createValidationError(errorOpts);

        expect(error).not.toHaveProperty('code');
      });
    });
  });

  describe('Create Custom Error', () => {
    beforeEach(() => {
      errorOpts.name = 'CustomError';
    });

    describe('Failure', () => {
      it('should throw error if name is not provided', () => {
        delete errorOpts.name;

        expect(() => createCustomError(errorOpts)).toThrow(
          /"name" is required/,
        );
      });

      it('should throw error if error message is not provided', () => {
        delete errorOpts.message;

        expect(() => createCustomError(errorOpts)).toThrow(
          /"message" is required/,
        );
      });

      it('should throw error if error message an empty string', () => {
        errorOpts.message = '';

        expect(() => createCustomError(errorOpts)).toThrow(
          /"message" is not allowed to be empty/,
        );
      });

      it('should throw error if details entry has no message', () => {
        errorOpts.details[0].message = '';

        expect(() => createCustomError(errorOpts)).toThrow(
          /"message" is not allowed to be empty/,
        );
      });

      it('should throw error if error name is not provided', () => {
        errorOpts.name = '';

        expect(() => createCustomError(errorOpts)).toThrow(
          /"name" is not allowed to be empty/,
        );
      });

      it('should throw error if code is null', () => {
        errorOpts.code = null;

        expect(() => createCustomError(errorOpts)).toThrow(
          /"code" must be a string/,
        );
      });

      it('should throw error if code is an empty string', () => {
        errorOpts.code = '';

        expect(() => createCustomError(errorOpts)).toThrow(
          /"code" is not allowed to be empty/,
        );
      });
    });

    describe('Success', () => {
      it('should not throw error if details is undefined', () => {
        errorOpts.details = undefined;

        expect(() => createCustomError(errorOpts)).not.toThrow();
      });

      it('should not throw error if details is an empty array', () => {
        errorOpts.details = [];

        expect(() => createCustomError(errorOpts)).not.toThrow();
      });

      it('should omit details if it not a non-empty array', () => {
        errorOpts.details = [];

        const error = createCustomError(errorOpts);
        expect(error).not.toHaveProperty('details');
      });

      it('should omit code if it is not provided', () => {
        errorOpts.code = undefined;

        const error = createCustomError(errorOpts);
        expect(error).not.toHaveProperty('code');
      });

      it('should return error with the provided name', () => {
        const error = createCustomError(errorOpts);

        expect(error).toHaveProperty('name', errorOpts.name);
      });

      it('should return error with the correct message', () => {
        const error = createCustomError(errorOpts);

        expect(error).toHaveProperty('message', errorOpts.message);
      });

      it('should return error with the correct code', () => {
        const error = createCustomError(errorOpts);

        expect(error).toHaveProperty('code', errorOpts.code);
      });

      it('should return error with the correct details', () => {
        const error = createCustomError(errorOpts);

        expect(error.details).toEqual(errorOpts.details);
      });

      it('should exclude createCustomError from the call stack', () => {
        try {
          throw createCustomError(errorOpts);
        } catch (error) {
          expect(error.stack).not.toMatch(/createCustomError/);
        }
      });
    });
  });
});
