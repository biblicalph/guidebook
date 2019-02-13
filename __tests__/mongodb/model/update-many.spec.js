import faker from 'faker';
import Promise from 'bluebird';
import { businessModel, factory, streamToPromise } from '../../utils';
import {
  createRepository,
  DB_VALIDATION_ERROR_NAME,
} from '../../../src/mongodb';

const businessRepo = createRepository(businessModel);

describe('Mongodb Repository Update Many End to End Spec', () => {
  let businesses;
  let user;
  let updateDetails;
  let options;

  beforeEach(async () => {
    user = await factory.user.create();
    businesses = await Promise.all(
      factory.business.createMany({ overrides: { user: user._id }, num: 3 }),
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
    it('should update all matching documents', async () => {
      expect.hasAssertions();
      await businessRepo.updateMany(options);

      const updatedDocs = await streamToPromise(
        businessRepo.findMany({ sort: { _id: 'asc' } }),
      );

      businesses.forEach((business, i) => {
        expect(business._id.toString()).toEqual(updatedDocs[i]._id.toString());
        expect(updatedDocs[i].name).toBe(updateDetails.name);
        expect(updatedDocs[i].domain).toBe(updateDetails.domain);
      });
    });

    it('should return the number of documents that were updated', async () => {
      expect.hasAssertions();
      const numUpdated = await businessRepo.updateMany(options);

      expect(numUpdated).toBe(businesses.length);
    });
  });

  describe('Failure', () => {
    it('should throw error if document validation fails', async () => {
      expect.hasAssertions();
      options.data.user = null;

      return expect(businessRepo.updateMany(options)).rejects.toHaveProperty(
        'name',
        DB_VALIDATION_ERROR_NAME,
      );
    });
  });
});
