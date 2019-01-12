import { businessModel, factory, expectToBePlainObject } from '../../utils';
import { createRepository } from '../../../src/mongodb';

const businessRepo = createRepository(businessModel);

describe('Mongodb Repository Find End to End Spec', () => {
  let user;
  let business;
  let options;

  beforeEach(async () => {
    user = await factory.user.create();
    business = await factory.business.create({ overrides: { user: user._id } });
    options = {
      query: { name: business.name },
    };
  });

  it('should return document matching the specified query', async () => {
    expect.hasAssertions();

    const doc = await businessRepo.find(options);

    // user relation is populated on business (expected value)
    expect(doc).toEqual({ ...business, ...{ user: user._id } });
  });

  it('should return null if no matching document is found', async () => {
    expect.hasAssertions();
    options.query.name = 'something weird';

    const doc = await businessRepo.find(options);

    expect(doc).toBeNull();
  });

  it('should return document with only the specified fields', async () => {
    expect.hasAssertions();
    options.fields = { name: 1, domain: 1 };

    const document = await businessRepo.find(options);

    expect(['name', 'domain', '_id']).toEqual(
      expect.arrayContaining(Object.keys(document)),
    );
  });

  describe('Populate nested documents', () => {
    it('should populate requested relations', async () => {
      expect.hasAssertions();
      options.populate = 'user';

      const document = await businessRepo.find(options);

      expect(document).toHaveProperty('user', user);
    });

    it('should populate nested relations specified as an object', async () => {
      expect.hasAssertions();
      options.populate = { path: 'user' };

      const document = await businessRepo.find(options);

      expect(document).toHaveProperty('user', user);
    });
  });

  it('should return plain nested object', async () => {
    expect.hasAssertions();
    options.populate = 'user';

    const document = await businessRepo.find(options);

    expectToBePlainObject(document.user);
  });

  it('should return plain object', async () => {
    expect.hasAssertions();
    const document = await businessRepo.find(options);

    expectToBePlainObject(document);
  });
});
