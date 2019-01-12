import { businessModel, factory, expectToBePlainObject } from '../../utils';
import {
  createRepository,
  DB_VALIDATION_ERROR_NAME,
} from '../../../src/mongodb';

const businessRepository = createRepository(businessModel);

describe('Mongodb Repository Create End to End Spec', () => {
  let user;
  let options;

  beforeEach(async () => {
    user = await factory.user.create();

    options = {
      data: factory.business.make({
        overrides: { user: user._id.toString() },
      }),
    };
  });

  describe('Success', () => {
    it('should save document to the database', async () => {
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

      expect(business).toEqual(savedBusiness);
    });

    it('should populate requested fields on saved object', async () => {
      expect.assertions(1);
      options.populate = 'user';
      const business = await businessRepository.create(options);

      expect(business.user).toEqual(user);
    });

    it('should populate requested fields specified as an object', async () => {
      expect.assertions(1);
      options.populate = { path: 'user' };
      const business = await businessRepository.create(options);

      expect(business.user).toEqual(user);
    });

    it('should ignore populate fields which do not exist', async () => {
      expect.assertions(1);
      options.populate = 'doctor';

      const business = await businessRepository.create(options);

      expect(business.doctor).toBeUndefined();
    });

    it('should return plain nested object', async () => {
      expect.assertions(1);
      options.populate = 'user';
      const business = await businessRepository.create(options);

      expectToBePlainObject(business);
    });

    it('should return plain object', async () => {
      expect.assertions(1);
      const business = await businessRepository.create(options);

      expectToBePlainObject(business);
    });
  });

  describe('Failure', () => {
    beforeEach(() => {
      delete options.data.user;
    });

    it('should return validation error if document fails validation', () => {
      expect.assertions(1);
      return expect(businessRepository.create(options)).rejects.toHaveProperty(
        'name',
        DB_VALIDATION_ERROR_NAME,
      );
    });
  });
});
