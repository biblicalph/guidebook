import * as faker from 'faker';
import mongoose from 'mongoose';
import { getDbConnection } from '../src/mongodb';

let db;

const connectToDb = () =>
  new Promise(resolve => {
    // JEST can run tests in parallel. Using different db helps avoid test data conflicts
    db = getDbConnection(`mongodb://localhost/${faker.random.uuid()}`);
    db.on('connected', () => {
      resolve(db);
    });
    db.connect();
  });

const clearDb = () => {
  const promises = Object.keys(mongoose.connection.collections).map(key =>
    mongoose.connection.collections[key].deleteMany({}),
  );

  return Promise.all(promises);
};

beforeAll(async () => {
  db = await connectToDb();
});

beforeEach(async () => {
  if (!db) {
    db = await connectToDb();
  }
  await clearDb();
});

afterAll(async () => {
  if (db) {
    await mongoose.connection.db.dropDatabase();
    await db.disconnect();
  }
});
