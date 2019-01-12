import mongoose from 'mongoose';
import { EventEmitter } from 'events';
import beautifyUniqueErrors from 'mongoose-beautiful-unique-validation';

mongoose.Promise = Promise;
mongoose.plugin(beautifyUniqueErrors);

/**
 * Mongodb connection manager
 * @class
 * @extends EventEmitter
 */
class MongodbConnection extends EventEmitter {
  /**
   * MongodbConnection constructor
   * @param {String} dbUrl - the Mongodb database url
   */
  constructor(dbUrl) {
    super();
    /**
     * The name of the connection/instance
     * @type {String}
     */
    this.name = 'mongodb';
    /**
     * The database url
     * @type {String}
     */
    this.dbUrl = dbUrl;
    /**
     * The Mongoose connection
     */
    this.connection = mongoose.connection;
  }

  /**
   * Connect to Mongodb database
   * @return {EventEmitter} the mongoose connection
   */
  connect() {
    if (this.isConnected()) {
      return this.emit('connected', {
        instance: this.connection,
        name: this.name,
      });
    }

    mongoose.connect(
      this.dbUrl,
      { useNewUrlParser: true },
    );

    this.connection
      .on('open', () => {
        this.emit('connected', {
          instance: this.connection,
          name: this.name,
        });
      })
      .on('error', err => {
        process.stderr.write(JSON.stringify(err.stack, null, 4));
      })
      .on('close', () => {
        process.stdout.write('Mongodb disconnected');
      });
    return this.connection;
  }

  /**
   * Close the database connection
   */
  disconnect() {
    if (this.isConnected()) {
      mongoose.connection.close();
    }
    this.emit('disconnected');
  }

  /**
   * Check if the database is connected
   * @return {boolean} true if the database is connected
   */
  isConnected() {
    return !!(this.connection && this.connection.readyState === 1);
  }
}

export default dbUrl => new MongodbConnection(dbUrl);
