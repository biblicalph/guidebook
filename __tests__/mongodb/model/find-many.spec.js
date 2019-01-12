import Promise from 'bluebird';
import { sortBy } from 'lodash/fp';
import {
  businessModel,
  factory,
  expectToBePlainObject,
  streamToPromise,
  createMongooseCastError,
} from '../../utils';
import {
  createRepository,
  DB_VALIDATION_ERROR_NAME,
} from '../../../src/mongodb';

const businessRepo = createRepository(businessModel);

describe('Mongodb Repository Find Many End to End Spec', () => {
  let users;
  let businesses;

  beforeEach(async () => {
    users = await Promise.all(factory.user.createMany({ num: 2 }));

    businesses = [];
    const userOnesBusinesses = await Promise.all(
      factory.business.createMany({
        num: 3,
        overrides: { user: users[0]._id },
      }),
    );
    const userTwosBusinesses = await Promise.all(
      factory.business.createMany({
        num: 3,
        overrides: { user: users[1]._id },
      }),
    );
    businesses = userOnesBusinesses
      .concat(userTwosBusinesses)
      .reduce((prevArr, curArr) => prevArr.concat(curArr), []);
  });

  it('should return documents matching a given criteria', done => {
    expect.assertions(4);
    const documents = [];
    const user = users[0];
    const options = {
      query: { user: user._id },
    };

    businessRepo
      .findMany(options)
      .on('data', doc => {
        documents.push(doc);
      })
      .on('end', () => {
        expect(documents.length).toBe(3);

        documents.forEach(doc => {
          expect(user._id).toEqual(doc.user);
        });

        done();
      });
  });

  it('should return all documents if no filter criteria is specified', done => {
    expect.hasAssertions();
    const documents = [];

    businessRepo
      .findMany()
      .on('data', doc => {
        documents.push(doc);
      })
      .on('end', () => {
        expect(documents.length).toBe(businesses.length);

        done();
      });
  });

  it('should contain only specified fields in retrieved documents', done => {
    expect.hasAssertions();
    const options = {
      fields: { name: 1, domain: 1 },
    };

    const documents = [];

    businessRepo
      .findMany(options)
      .on('data', doc => {
        documents.push(doc);
      })
      .on('end', () => {
        documents.forEach(doc => {
          expect(Object.keys(doc)).toEqual(
            expect.arrayContaining(['_id', 'name', 'domain']),
          );
        });

        done();
      });
  });

  describe('Populate nested documents', () => {
    let userIds;

    beforeEach(() => {
      userIds = users.map(user => user.id);
    });

    it('should populate requested relations', done => {
      expect.hasAssertions();
      const options = { populate: 'user' };
      const documents = [];

      businessRepo
        .findMany(options)
        .on('data', doc => {
          documents.push(doc);
        })
        .on('end', () => {
          documents.forEach(doc => {
            expect(userIds).toContain(doc.user.id);
          });
          done();
        });
    });

    it('should populate nested relations via options specified as an object', done => {
      expect.hasAssertions();
      const options = { populate: { path: 'user' } };

      const documents = [];

      businessRepo
        .findMany(options)
        .on('data', doc => {
          documents.push(doc);
        })
        .on('end', () => {
          documents.forEach(doc => {
            expect(userIds).toContain(doc.user.id);
          });

          done();
        });
    });
  });

  it('should return plain javascript objects', done => {
    expect.hasAssertions();
    const documents = [];

    businessRepo
      .findMany()
      .on('data', doc => {
        documents.push(doc);
      })
      .on('end', () => {
        documents.forEach(expectToBePlainObject);

        done();
      });
  });

  it('should return relations as plain javascript objects', done => {
    expect.hasAssertions();
    const documents = [];
    const options = { populate: 'user' };

    businessRepo
      .findMany(options)
      .on('data', doc => {
        documents.push(doc);
      })
      .on('end', () => {
        documents.forEach(doc => expectToBePlainObject(doc.user));

        done();
      });
  });

  it('should sort documents using provided sort object', async () => {
    expect.hasAssertions();
    const actualBusinesses = await streamToPromise(
      businessRepo.findMany({ sort: { name: 'desc' } }),
    );

    // sortBy sorts in asc order hence the reverse
    sortBy(['name'])(businesses)
      .reverse()
      .forEach((business, i) => {
        expect(business._id).toEqual(actualBusinesses[i]._id);
      });
  });

  it('should sort documents using provided sort string', async () => {
    expect.hasAssertions();
    const actualBusinesses = await streamToPromise(
      businessRepo.findMany({ sort: '-name' }),
    );

    // sortBy sorts in asc order hence the reverse
    sortBy(['name'])(businesses)
      .reverse()
      .forEach((business, i) => {
        expect(business._id).toEqual(actualBusinesses[i]._id);
      });
  });

  describe('Transformation Function', () => {
    let docType;
    let options;

    beforeEach(() => {
      docType = 'business';

      options = {
        transform: doc => ({ ...doc, ...{ type: docType } }),
      };
    });

    it('should apply transformation function to each document before returning it', done => {
      expect.hasAssertions();
      const documents = [];

      businessRepo
        .findMany(options)
        .on('data', doc => {
          documents.push(doc);
        })
        .on('end', () => {
          documents.forEach(doc => {
            expect(doc.type).toBe(docType);
          });

          done();
        });
    });
  });

  describe('Failure', () => {
    it('should emit db:error event on error', done => {
      const message = 'Something bad happened';
      const error = Error(message);

      const stream = businessRepo
        .findMany()
        .on(businessRepo.streamEvents.findError, err => {
          expect(err).toHaveProperty('message', message);
          done();
        });

      stream.emit('error', error);
    });

    it('should format mongoose error as validation error', done => {
      expect.hasAssertions();
      const message = 'Error occurred on stream';
      const error = createMongooseCastError({ message });

      const stream = businessRepo
        .findMany()
        .on(businessRepo.streamEvents.findError, err => {
          expect(err).toHaveProperty('name', DB_VALIDATION_ERROR_NAME);
          done();
        });

      stream.emit('error', error);
    });
  });
});
