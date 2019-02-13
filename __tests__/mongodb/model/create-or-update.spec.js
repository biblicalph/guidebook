import faker from 'faker';
import { businessModel, factory, expectToBePlainObject } from '../../utils';
import {
  createRepository,
  DB_VALIDATION_ERROR_NAME,
} from '../../../src/mongodb';

const businessRepo = createRepository(businessModel);

describe('Mongodb Repository Create or Update End to End Spec', () => {
  let user;

  beforeEach(async () => {
    user = await factory.user.create();
  });

  describe('New Document Creation', () => {
    let businessDetails;
    let options;

    beforeEach(() => {
      businessDetails = factory.business.make({
        overrides: { user: user._id },
      });

      options = {
        query: { _id: 'non-existing' },
        data: businessDetails,
      };
    });

    describe('Success', () => {
      it('should create document if not existing', async () => {
        expect.hasAssertions();

        const savedBusiness = await businessRepo.createOrUpdate(options);
        const business = await businessRepo.find({
          query: { _id: businessDetails._id },
        });

        expect(savedBusiness).toEqual(business);
      });

      describe('Populating fields on returned documents', () => {
        it('should populate relations on newly created object', async () => {
          expect.hasAssertions();

          options.populate = 'user';

          const savedBusiness = await businessRepo.createOrUpdate(options);

          expect(savedBusiness.user).toEqual(user);
        });

        it('should accept populate option specified as an object', async () => {
          expect.hasAssertions();

          options.populate = { path: 'user' };

          const savedBusiness = await businessRepo.createOrUpdate(options);

          expect(savedBusiness.user).toEqual(user);
        });
      });

      it('should return document as plain object', async () => {
        expect.hasAssertions();

        const savedBusiness = await businessRepo.createOrUpdate(options);

        expectToBePlainObject(savedBusiness);
      });

      it('should return nested relations as plain objects', async () => {
        expect.hasAssertions();

        options.populate = 'user';

        const savedBusiness = await businessRepo.createOrUpdate(options);

        expectToBePlainObject(savedBusiness.user);
      });
    });

    describe('Failure', () => {
      it('should throw error if document fails validation', async () => {
        expect.hasAssertions();

        delete options.data.name;

        return expect(
          businessRepo.createOrUpdate(options),
        ).rejects.toHaveProperty('name', DB_VALIDATION_ERROR_NAME);
      });
    });
  });

  describe('Existing Document Update', () => {
    let business;
    let updateDetails;
    let options;

    beforeEach(async () => {
      business = await factory.business.create({
        overrides: { user: user._id },
      });
      updateDetails = { name: faker.company.companyName() };
      options = {
        query: { _id: business._id },
        data: updateDetails,
      };
    });

    describe('Success', () => {
      it('should update details of existing document', async () => {
        expect.hasAssertions();

        const updatedBusiness = await businessRepo.createOrUpdate(options);

        expect(updatedBusiness._id).toEqual(business._id);
        Object.entries(updateDetails).forEach(([field, val]) => {
          expect(updatedBusiness[field]).toEqual(val);
        });
      });

      it('should populate requested fields', async () => {
        expect.hasAssertions();

        options.populate = 'user';

        const updatedBusiness = await businessRepo.createOrUpdate(options);

        expect(updatedBusiness.user).toEqual(business.user);
      });

      it('should skip non-existing populate fields', async () => {
        expect.hasAssertions();

        options.populate = 'doctor';

        const updatedBusiness = await businessRepo.createOrUpdate(options);

        expect(updatedBusiness).not.toHaveProperty('doctor');
      });

      it('should return plain object', async () => {
        expect.hasAssertions();

        const updatedBusiness = await businessRepo.createOrUpdate(options);

        expectToBePlainObject(updatedBusiness);
      });

      it('should return nested relations as plain objects', async () => {
        expect.hasAssertions();
        options.populate = 'user';

        const updatedBusiness = await businessRepo.createOrUpdate(options);

        expectToBePlainObject(updatedBusiness.user);
      });
    });

    describe('Failure', () => {
      it('should throw error if document fails validation', async () => {
        expect.hasAssertions();
        options.data.name = null;

        return expect(
          businessRepo.createOrUpdate(options),
        ).rejects.toHaveProperty('name', DB_VALIDATION_ERROR_NAME);
      });
    });
  });
});
