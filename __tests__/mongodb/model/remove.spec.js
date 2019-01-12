import { sortBy } from 'lodash/fp';
import { businessModel, factory } from '../../utils';
import { createRepository } from '../../../src/mongodb';

const businessRepo = createRepository(businessModel);

describe('Mongodb Repository Remove End to End Spec', () => {
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

    it('should remove the first document matching the specified query', async () => {
      expect.assertions(1);
      await businessRepo.remove({ query: { user: user._id } });

      const numDocuments = await businessRepo.count();

      expect(numDocuments).toBe(documents.length - 1);
    });

    it('should return the document that was removed', async () => {
      expect.hasAssertions();
      const document = await businessRepo.remove({
        query: { _id: documents[0]._id },
      });

      expect(document._id).toEqual(documents[0]._id);
    });

    it('should sort multiple document matches according to the provided sort criteria', async () => {
      expect.hasAssertions();
      const document = await businessRepo.remove({
        query: { user: user._id },
        sort: { _id: 'desc' },
      });

      // sort by _id in descending order
      const sortedDocs = sortBy(['_id'])(documents).reverse();
      expect(document._id).toEqual(sortedDocs[0]._id);
    });
  });
});
