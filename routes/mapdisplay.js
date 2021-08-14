const express = require('express');

const router = express.Router();
const map = require("../models/GameState");

// ----------------------------Map Route-------------------------------
router.post("/", async (req, res) => {
  const { username } = req.body;

  try {
    const nodeInfo = await map.findOne({ username: username });

    res.json({
      "game-state": nodeInfo,
    });
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
});
module.exports = router;



// ----------------------------Map Route-------------------------------
