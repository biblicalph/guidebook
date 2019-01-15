import { businessModel, factory, expectToBePlainObject } from '../../utils';
import { createRepository } from '../../../src/mongodb';

const businessRepository = createRepository(businessModel);

describe('Base Model create() End to End Spec', () => {
  let user;
  let options;

  beforeEach(async () => {
    user = await factory.user.create();

    options = {
      data: factory.business.make({
        overrides: { user: user.id },
      }),
    };
  });

  describe('Success', () => {
    test('should save document to the database', async () => {
      expect.assertions(1);
      const business = await businessRepository.create(options);
      const savedBusiness = await businessModel
        .findOne({
          name: options.data.name,
          domain: options.data.domain,
          user: options.data.user,
        })
        .lean()
        .exec();

      expect(business).toMatchObject(savedBusiness);
    });

    test('should populate requested fields on saved object', async () => {
      expect.assertions(1);
      options.populate = 'user';
      const business = await businessRepository.create(options);

      expect(business.user).toEqual(user);
    });

    test('should populate requested fields specified as an object', async () => {
      expect.assertions(1);
      options.populate = { path: 'user' };
      const business = await businessRepository.create(options);

      expect(business.user).toEqual(user);
    });

    test('should ignore populate fields which do not exist', async () => {
      expect.assertions(1);
      options.populate = 'doctor';

      const business = await businessRepository.create(options);

      expect(business.doctor).toBeUndefined();
    });

    test('should return plain nested object', async () => {
      expect.assertions(1);
      options.populate = 'user';
      const business = await businessRepository.create(options);

      expectToBePlainObject(business);
    });

    test('should return plain object', async () => {
      expect.assertions(1);
      const business = await businessRepository.create(options);

      expectToBePlainObject(business);
    });
  });

  describe('Failure', () => {
    beforeEach(() => {
      delete options.data.user;
    });

    test('should throw error if document fails validation', () => {
      expect.assertions(1);
      return expect(businessRepository.create(options)).rejects.toHaveProperty(
        'message',
        expect.stringContaining('Path `user` is required'),
      );
    });

    test('should return DatabaseValidationError if document fails validation', () => {
      expect.assertions(1);
      return expect(businessRepository.create(options)).rejects.toHaveProperty(
        'name',
        'DatabaseValidationError',
      );
    });
  });
});
