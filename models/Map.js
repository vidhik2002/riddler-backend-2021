const mongoose = require('mongoose');

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
  lockedNodes:[
    {
      type: Number,
    }
  ],
  currentNode: [
    {
      type: Number,
      required: true,
    },
  ],
  username: {
    type: String,
    required: true,
  },
  portalOpen:[
  {
    type: Number,
  },
  ]

});
const Map = mongoose.model('map', MapSchema);
module.exports = Map;
