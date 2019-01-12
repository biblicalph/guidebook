import Promise from 'bluebird';
import { userModel, factory } from '../../utils';
import { createRepository } from '../../../src/mongodb';

const userRepo = createRepository(userModel);

describe('Mongodb Repository Count End to End Spec', () => {
  let users;

  beforeEach(async () => {
    users = await Promise.all(factory.user.createMany({ num: 5 }));
  });

  it('should return the count of users matching the given criteria', async () => {
    expect.hasAssertions();
    const count = await userRepo.count({ fullname: users[0].fullname });
    const userList = users.filter(user => user.fullname === users[0].fullname);

    expect(count).toBe(userList.length);
  });

  it('should return the count of all users if no criteria is specified', async () => {
    expect.hasAssertions();
    const count = await userRepo.count();

    expect(count).toBe(users.length);
  });
});
