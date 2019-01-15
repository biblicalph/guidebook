import mongoose from 'mongoose';
import { EventEmitter } from 'events';
import beautifyUniqueErrors from 'mongoose-beautiful-unique-validation';

mongoose.Promise = Promise;
mongoose.plugin(beautifyUniqueErrors);

class MongodbConnection extends EventEmitter {
  constructor(dbUrl) {
    super();
    this.name = 'mongodb';
    this.dbUrl = dbUrl;
  }

  connect() {
    const self = this;

    if (self.isConnected()) {
      return self.emit('connected', {
        instance: self.connection,
        name: self.name,
      });
    }

    mongoose.connect(self.dbUrl, { useNewUrlParser: true });

    self.connection = mongoose.connection;

    self.connection
      .on('open', () => {
        self.emit('connected', {
          instance: self.connection,
          name: self.name,
        });
      })
      .on('error', err => {
        console.error(err); // eslint-disable-line no-console
      })
      .on('close', () => {
        console.info('Mongodb disconnected'); // eslint-disable-line no-console
      });
    return self.connection;
  }

  disconnect() {
    if (this.isConnected()) {
      this.connection.close();
    }
    this.emit('disconnected');
  }

  isConnected() {
    return !!(this.connection && this.connection.readyState === 1);
  }
}

export default dbUrl => new MongodbConnection(dbUrl);
