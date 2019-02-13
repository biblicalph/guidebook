import { isEmpty } from 'lodash/fp';
import { formatMongodbErrors, createQueryRequiredError } from './errors';

/**
 * @typedef {Object} CustomDbStreamEvents
 * @property {String} [findError = 'db:error'] - db find error event
 */
/**
 * List of events emitted by streams of the base model.
 * For example, the base model handles error event on Mongoose stream, formats and re-throws
 * the error
 * @type {CustomDbStreamEvents}
 */
const streamEvents = {
  findError: 'db:error',
};

/**
 * Returns function for creating a new document
 * @param {Object} model - the Mongoose model
 * @return {Function}
 */
const create = model =>
  /**
   * Function for creating a new document
   * @param {Object} options
   * @param {Object} options.data - the details of the document to save
   * @param {Object|String} [options.populate = ''] - space delimited list of fields to populate or a populate object
   * @return {Promise} - promise that resolves to a lean instance of the created object
   */
  async ({ data, populate = '' }) => {
    try {
      let createdDocument = await model.create(data);

      if (populate) {
        createdDocument = await createdDocument
          .populate(populate)
          .execPopulate();
      }

      return createdDocument.toObject();
    } catch (error) {
      throw formatMongodbErrors(error);
    }
  };

/**
 * Returns function for removing a single document
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const remove = model =>
  /**
   * Remove the first matching document
   * @param {Object} options
   * @return {Promise}
   */
  async ({ query, sort = {} }) => {
    try {
      const document = await model.findOneAndRemove(query, { sort });

      return document;
    } catch (error) {
      throw formatMongodbErrors(error);
    }
  };

/**
 * Returns function for removing documents
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const removeMany = model =>
  /**
   * Remove all matching documents
   * @param {Object} options
   * @return {Promise}
   */
  async query => {
    if (isEmpty(query)) {
      throw createQueryRequiredError(
        'Criteria for records to delete is required',
      );
    }

    try {
      const result = await model.deleteMany(query);

      return result.n;
    } catch (error) {
      throw formatMongodbErrors(error);
    }
  };

/**
 * Returns function for updating a single document
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const update = model =>
  /**
   * Update a single document
   * @param {Object} options
   * @param {Object} options.query - a query object
   * @param {Object} options.data - object containing fields to update
   * @param {Object|String} [options.populate = ''] - space delimited list of fields to populate or a populate object
   * @param {Object|String} [options.sort = {}] - the sort criteria to use if multiple documents match the query. Defaults to Mongodb natural sort order
   * @return {Promise} - promise that resolves to the updated document
   */
  async ({ query, data, populate = '', sort = {} }) => {
    const opts = { new: true, runValidators: true };

    if (!isEmpty(sort)) {
      opts.sort = sort;
    }

    try {
      const updatedDocument = await model
        .findOneAndUpdate(query, data, opts)
        .populate(populate)
        .lean()
        .exec();

      return updatedDocument;
    } catch (error) {
      throw formatMongodbErrors(error);
    }
  };

/**
 * Returns function for updating documents
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const updateMany = model =>
  /**
   * Update all matching documents
   * @param {Object} options
   * @param {Object} options.query - a query object
   * @param {Object} options.data - object containing fields to update
   * @param {Object|String} [options.populate = ''] - space delimited list of fields to populate or a populate object
   * @return {Promise} - promise that resolves to the number of documents updated
   */
  async ({ query, data, populate = '' }) => {
    const opts = { new: true, runValidators: true };

    try {
      const result = await model
        .updateMany(query, data, opts)
        .populate(populate)
        .lean()
        .exec();

      return result.nModified;
    } catch (error) {
      throw formatMongodbErrors(error);
    }
  };

/**
 * Returns function for retrieving a single document
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const find = model =>
  /**
   * Find the document matching the given criteria
   * @param {Object} [options]
   * @param {Object} [options.query] - an object specifying the query to execute
   * @param {Object} [options.fields = {}] - an object specifying the fields to return
   * @param {Object|String} [options.populate = ''] - space delimited list of fields to populate or a populate object
   * @return {Promise} - promise that resolves to the document with populated fields if
   * requested
   * @return {Function}
   */
  async ({ query, fields = {}, populate = '' } = {}) => {
    try {
      const document = await model
        .findOne(query, fields)
        .populate(populate)
        .lean()
        .exec();

      return document;
    } catch (error) {
      throw formatMongodbErrors(error);
    }
  };

/**
 * Returns function for retrieving multiple documents
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const findMany = model =>
  /**
   * Find documents matching the given criteria
   * @param {Object} [options]
   * @param {Object} [options.query] - a query object
   * @param {Object} [options.fields = {}] - list of fields to return for retrieved documents
   * @param {Object|String} [options.populate = ''] - space delimited list of fields to populate or a populate object
   * @param {Object|String} [options.sort = {}] - the sort criteria. Defaults to Mongodb natural sort order
   * @param {function} [options.transform] - function which accepts and returns a Mongoose document
   * @param {number} [options.limit = 0] - maximum number of documents to return. Defaults to
   * returning all documents
   * @return {Object} - a Readable Stream
   */
  ({
    query,
    fields = {},
    populate = '',
    sort = {},
    transform,
    limit = 0,
  } = {}) => {
    let cursorOptions;

    if (typeof transform === 'function') {
      cursorOptions = { transform };
    }

    const stream = model
      .find(query, fields)
      .sort(sort)
      .limit(limit)
      // return up to 100 documents in each batch of the Mongodb response
      .batchSize(100)
      .lean()
      .populate(populate)
      .cursor(cursorOptions);

    stream.on('error', err => {
      stream.emit(streamEvents.findError, formatMongodbErrors(err));
    });

    return stream;
  };

/**
 * Returns function for creating a document or updating it if it exists
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const createOrUpdate = model => {
  const findDocument = find(model);
  const createDocument = create(model);
  const updateDocument = update(model);
  /**
   * Create a new document or update it if it exists
   * @param {Object} options
   * @param {Object} options.query - a query object
   * @param {Object} options.update - object containing fields to update
   * @param {Object|String} [options.populate = ''] - space delimited list of fields to populate or a populate object
   * @return {Promise} - promise that resolves to the inserted/updated document
   */
  return async ({ query, data, populate = '' }) => {
    const document = await findDocument({ query });

    // findOneAndUpdate with upsert=true only validates fields in the update data
    // If upserting, we need to ensure all fields are validated.
    // https://mongoosejs.com/docs/validation.html#update-validators-only-run-on-updated-paths
    return document
      ? updateDocument({ query, data, populate })
      : createDocument({ data, populate });
  };
};

/**
 * Returns function for counting documents
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const count = model =>
  /**
   * Get count of all matching documents
   * @param {Object} [query = {}] - query object
   * @return {Promise} - promise that resolves to the count of documents matching the specified criteria
   */
  async (query = {}) => {
    try {
      const numberOfDocuments = await model.countDocuments(query).exec();

      return numberOfDocuments;
    } catch (error) {
      throw formatMongodbErrors(error);
    }
  };

export default model => ({
  create: create(model),
  update: update(model),
  updateMany: updateMany(model),
  createOrUpdate: createOrUpdate(model),
  find: find(model),
  findMany: findMany(model),
  count: count(model),
  remove: remove(model),
  removeMany: removeMany(model),
  streamEvents: { ...streamEvents },
});
