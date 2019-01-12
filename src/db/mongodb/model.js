import formatMongodbErrors from './errors';

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
 * Returns function for retrieving a single document
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const findOne = model =>
  /**
   * Find the document matching the given criteria
   * @param {Object} options
   * @param {Object} options.query - an object specifying the query to execute
   * @param {Object} [options.fields = {}] - an object specifying the fields to return
   * @param {Object|String} [options.populate = ''] - space delimited list of fields to populate or a populate object
   * @return {Promise} - promise that resolves to the document with populated fields if
   * requested
   * @return {Function}
   */
  async ({ query, fields = {}, populate = '' }) => {
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
 * Returns function for removing a single document
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const removeOne = model =>
  /**
   * Delete a single document
   * @param {Object} options
   * @param {Object} options.query - criteria to determine document to remove
   * @return {Promise} - a promise that resolves to the
   */
  async query => {
    try {
      const document = await model.findOneAndRemove(query);

      return document && document.toObject();
    } catch (error) {
      throw formatMongodbErrors(error);
    }
  };
/**
 * Returns function for removing documents
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const remove = model =>
  /**
   * Remove all matching documents
   * @param {Object} options
   * @return {Promise}
   */
  async query => {
    try {
      const result = await model.remove(query);

      return result;
    } catch (error) {
      throw formatMongodbErrors(error);
    }
  };
/**
 * Returns function for updating documents
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const update = model =>
  /**
   * Update all matching documents
   * @param {Object} options
   * @param {Object} options.query - a query object
   * @param {Object} options.data - object containing fields to update
   * @param {Object|String} [options.populate = ''] - space delimited list of fields to populate or a populate object
   * @return {Promise} - promise that resolves to the updated document
   */
  async ({ query, data, populate = '' }) => {
    const opts = { new: true, runValidators: true };

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
 * Returns function for creating a document or updating it if it exists
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const createOrUpdate = model =>
  /**
   * Create a new document or update it if it exists
   * @param {Object} options
   * @param {Object} options.query - a query object
   * @param {Object} options.update - object containing fields to update
   * @param {Object|String} [options.populate = ''] - space delimited list of fields to populate or a populate object
   * @return {Promise} - promise that resolves to the inserted/updated document
   */
  async ({ query, data, populate = '' }) => {
    const document = await this.get({ model, query });

    // findOneAndUpdate with upsert = true only validates fields in the update data
    // It does not validate all required fields on the schema
    return document
      ? update({ model, query, data, populate })
      : create({ model, data, populate });
  };
/**
 * Returns function for retrieving multiple documents
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const find = model =>
  /**
   * Find documents matching the given criteria
   * @param {Object} options
   * @param {Object} options.query - a query object
   * @param {Object} [options.fields = {}] - list of fields to return for retrieved documents
   * @param {Object|String} [options.populate = ''] - space delimited list of fields to populate or a populate object
   * @param {function} [options.transform] - function which accepts and returns a Mongoose document
   * @return {Object} - a Readable Stream
   */
  ({ query, fields = {}, populate = '', transform }) => {
    const stream = model
      .find(query, fields)
      .batchSize(100)
      .lean()
      .populate(populate)
      .cursor()
      .map(transform || (doc => doc));

    stream.on('error', err => {
      throw formatMongodbErrors(err);
    });

    return stream;
  };
/**
 * Returns function for counting documents
 * @param {Object} model - a Mongoose model
 * @return {Function}
 */
const count = model =>
  /**
   * Get count of all matching documents
   * @param {Object} options
   * @param {Object} [options.query = {}] - query object
   * @return {Promise} - promise that resolves to the count of documents matching the specified criteria
   */
  async ({ query = {} }) => {
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
  createOrUpdate: createOrUpdate(model),
  removeOne: removeOne(model),
  findOne: findOne(model),
  find: find(model),
  count: count(model),
  remove: remove(model),
});
