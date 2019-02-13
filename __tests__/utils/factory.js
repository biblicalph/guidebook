import { defaultsDeep } from 'lodash';
import * as faker from 'faker';
import * as objectId from 'bson-objectid';
import { userModel, businessModel } from './models';

const factory = {
  user: {
    /**
     * Create new user object which is yet to be persisted to the database
     * @param {Object} [options]
     * @param {Object} [options.overrides]
     * @param {boolean} [options.lean = true]
     * @return {Object} user model object
     */
    make: ({ overrides, lean = true } = {}) => {
      const userDetails = defaultsDeep(Object.assign({}, overrides), {
        fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.random.words(),
      });

      const user = userModel(userDetails);

      return lean ? user.toObject() : user;
    },
    /**
     * Make `num` user objects, where num is an integer > 0
     * @param {Object} [options]
     * @param {Object} [options.overrides]
     * @param {Number} [options.num = 1] - number of users to make
     * @return {Array<Object>} list of users
     */
    makeMany: ({ overrides, num = 1 } = {}) =>
      Array.from({ length: num }).map(() => factory.user.make({ overrides })),
    /**
     * Create new user object which has been persisted to the database
     * @param {Object} options
     * @param {Object} options.overrides
     * @return {Promise} promise that resolves to the user object
     */
    create: async ({ overrides } = {}) => {
      const user = factory.user.make({ overrides, lean: false });

      const savedUser = await user.save();

      return savedUser.toObject();
    },
    /**
     * Make `num` user objects, where num is an integer > 0
     * @param {Object} [options]
     * @param {Object} [options.overrides = {}]
     * @param {Number} [options.num = 1] - number of users to make
     * @return {Promise} promise that resolves to the list of users
     */
    createMany: async ({ overrides, num = 1 } = {}) =>
      Array.from({ length: num }).map(() => factory.user.create({ overrides })),
  },
  business: {
    /**
     * Make new business model object
     * @param {Object} [options]
     * @param {Object} [options.overrides]
     * @param {boolean} [options.lean = true]
     * @return {Object} business model object with dummy user id
     */
    make: ({ overrides, lean = true } = {}) => {
      const busDetails = defaultsDeep(Object.assign({}, overrides), {
        user_id: objectId.generate(),
        name: faker.company.companyName(),
        domain: faker.internet.url(),
      });

      const business = businessModel(busDetails);

      return lean ? business.toObject() : business;
    },
    /**
     * Make `num` new business model objects
     * @param {Object} [options]
     * @param {Object} [options.overrides]
     * @return {Array<Object>} list of business model objects with dummy user id
     */
    makeMany: ({ overrides, num = 1 } = {}) =>
      Array.from({ length: num }).map(() =>
        factory.business.make({ overrides }),
      ),
    /**
     * Create new business object which has been persisted to the database
     * @param {Object} options
     * @param {Object} options.overrides
     * @return {Promise} promise that resolves to the business object
     */
    create: async ({ overrides } = {}) => {
      const business = factory.business.make({ overrides, lean: false });

      const savedBusiness = await business.save();
      const businessWithUser = await savedBusiness
        .populate('user')
        .execPopulate();

      return businessWithUser.toObject();
    },
    /**
     * Create `num` new business objects which have been persisted to the database
     * @param {Object} options
     * @param {Object} options.overrides
     * @return {Promise} promise that resolves to the list of business objects
     */
    createMany: ({ overrides, num = 1 } = {}) =>
      Array.from({ length: num }).map(() =>
        factory.business.create({ overrides }),
      ),
  },
};

export default factory;
