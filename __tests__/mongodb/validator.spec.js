import { validateMongodbUrl } from '../../src/mongodb';

describe('Validate Mongodb Url Spec', () => {
  test('should throw error if database url is not provided', () => {
    expect(() => validateMongodbUrl()).toThrow('"value" is required');
  });

  test('should throw error if database url is not a valid mongodb url', () => {
    expect(() => validateMongodbUrl('localhost/db')).toThrow(
      '"localhost/db" fails to match the required pattern',
    );
  });

  test('should return database url if it is valid', () => {
    const dbUrl = 'mongodb://localhost/db';

    expect(validateMongodbUrl(dbUrl)).toBe(dbUrl);
  });
});
