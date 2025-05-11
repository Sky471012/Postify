const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSubSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  post: [PostSubSchema]
});

module.exports = mongoose.model('User', UserSchema);
