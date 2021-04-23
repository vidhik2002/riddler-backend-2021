const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
  },
  currentPosition: {
    type: Number,
    required: true,
    default: 0,
  },
  currentPenaltyPoints: {
    type: Number,
    required: true,
    default: 20,
  },
  lockedNode: {
    type: Number,
    required: true,
  },
});
const User = mongoose.model('user', UserSchema);
module.exports = User;
