import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  fullname: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const model = mongoose.model('User', schema, 'users');

export { schema, model };
