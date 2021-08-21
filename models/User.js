const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  score: {
    type: Number,
    required: true,
  },
  currentTrack: [{
      type: Number,
      required: true,
      default: 0,
  }],
  currentPenaltyPoints: {
    type: Number,
    required: true,
    default: 20,
  },
  lastSolve: {
    type: Date,
    required: true,
    default: Date.now
  }
});
const User = mongoose.model('user', UserSchema);
module.exports = User;
