import { businessModel, factory } from '../../utils';
import {
  createRepository,
  QUERY_REQUIRED_ERROR_NAME,
} from '../../../src/mongodb';

const businessRepo = createRepository(businessModel);

describe('Mongodb Repository Remove Many End to End Spec', () => {
  let user;

  beforeAll(async () => {
    user = await factory.user.create();
  });

  describe('remove()', () => {
    let documents;

    beforeEach(async () => {
      documents = await Promise.all(
        factory.business.createMany({ overrides: { user: user._id }, num: 3 }),
      );
    });

    describe('Success', () => {
      it('should remove documents matching the specified query', async () => {
        expect.assertions(1);
        await businessRepo.removeMany({ user: user._id });

        const numDocuments = await businessRepo.count();

        expect(numDocuments).toBe(0);
      });

      it('should return the number of documents removed', async () => {
        expect.hasAssertions();
        const numDocsRemoved = await businessRepo.removeMany({
          user: user._id,
        });

        expect(numDocsRemoved).toBe(documents.length);
      });
    });

    describe('Failure', () => {
      it('should throw error if no query is specified', async () => {
        expect.hasAssertions();
        return expect(businessRepo.removeMany()).rejects.toHaveProperty(
          'name',
          QUERY_REQUIRED_ERROR_NAME,
        );
      });

      it('should throw error if query is an empty object', async () => {
        expect.hasAssertions();
        return expect(businessRepo.removeMany({})).rejects.toHaveProperty(
          'name',
          QUERY_REQUIRED_ERROR_NAME,
        );
      });
    });
  });
});
