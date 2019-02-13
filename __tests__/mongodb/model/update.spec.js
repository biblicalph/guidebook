import faker from 'faker';
import Promise from 'bluebird';
import { sortBy } from 'lodash/fp';
import { businessModel, factory } from '../../utils';
import {
  createRepository,
  DB_VALIDATION_ERROR_NAME,
} from '../../../src/mongodb';

const businessRepo = createRepository(businessModel);

describe('Mongodb Repository Update End to End Spec', () => {
  let businesses;
  let user;
  let updateDetails;
  let options;

  beforeEach(async () => {
    user = await factory.user.create();
    businesses = await Promise.all(
      factory.business.createMany({
        overrides: { user: user._id },
        num: 3,
      }),
    );

    updateDetails = {
      name: faker.company.companyName(),
      domain: faker.internet.url(),
    };
    options = {
      query: { user: user._id },
      data: updateDetails,
    };
  });

  describe('Success', () => {
    it('should return the updated document', async () => {
      expect.hasAssertions();

      const business = await businessRepo.update(options);

      expect(Object.keys(business)).toEqual(Object.keys(businesses[0]));
    });

    it('should update the first matching document using default sort', async () => {
      expect.hasAssertions();

      const business = await businessRepo.update(options);
      const expectedBusiness = await businessRepo.find({
        query: options.query,
      });

      expect(business).toEqual(expectedBusiness);
    });

    it('should update first matching document after using specified sort', async () => {
      expect.hasAssertions();
      options.sort = { _id: 'desc' };

      const business = await businessRepo.update(options);

      // sortBy sorts in ascending order
      const sortedBusinesses = sortBy(['_id'])(businesses).reverse();
      expect(business._id).toEqual(sortedBusinesses[0]._id);
    });

    it('should update the requested fields of the document', async () => {
      expect.hasAssertions();

      const business = await businessRepo.update(options);
      const updatedBusiness = await businessRepo.find({
        query: options.query,
      });

      expect(business._id).toEqual(updatedBusiness._id);
      Object.entries(updateDetails).forEach(([field, value]) => {
        expect(value).toEqual(updatedBusiness[field]);
      });
    });

    it('should populate requested fields on the updated document', async () => {
      expect.hasAssertions();
      options.populate = 'user';

      const updatedBusiness = await businessRepo.update(options);
      const expectedBusiness = await businessRepo.find({
        query: options.query,
        populate: options.populate,
      });

      expect(updatedBusiness.user).toEqual(expectedBusiness.user);
    });
  });

  describe('Failure', () => {
    it('should throw error if document validation fails', async () => {
      expect.hasAssertions();
      options.data.user = null;

      return expect(businessRepo.update(options)).rejects.toHaveProperty(
        'name',
        DB_VALIDATION_ERROR_NAME,
      );
    });
  });
});
