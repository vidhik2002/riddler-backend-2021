const mongoose = require("mongoose");

const MapSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // startingNode: [
  //     {
  //         type: Number,
  //         required: true,
  //     },
  // ],
  unlockedNodes: [
    {
      type: Number,
      required: true,
    },
  ],
  solvedNodes: [
    {
      type: Number,
      required: true,
    },
  ],
  portalNodes: {
    9: {
      ans: [
        {
          type: String,
          required: true,
        },
      ],
    },
    20: {
      ans: [
        {
          type: String,
          required: true,
        },
      ],
    },
    32: {
      ans: [
        {
          type: String,
          required: true,
        },
      ],
    },
  },
  currentPosition: {
    type: Number,
    required: true,
  },

  lockedNode: {
    type: Number,
    required: true,
  },
  hintQues: [{
    type: Number,
    required: true,
}],
  // portalOpen: [
  //     {
  //         type: Number,
  //     },
  // ],
});
const Map = mongoose.model("map", MapSchema);
module.exports = Map;
