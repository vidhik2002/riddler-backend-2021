const mongoose = require("mongoose");

const MapSchema = new mongoose.Schema({
  startingNode: [
    {
      type: Number,
      required: true,
    },
  ],
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
  currentNode: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  portalOpen: [
    {
      type: Number,
    },
  ],
  lockedNodes: [
    {
      type: Number,
      required: true,
    },
  ],
});
const Map = mongoose.model("map", MapSchema);
module.exports = Map;
