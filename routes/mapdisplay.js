const express = require('express');

const router = express.Router();
const map = require("../models/GameState");
//lockedNode, portalNodes, solvedNodes, unlockedNodes, username

// ----------------------------Map Route-------------------------------
router.post("/", async (req, res) => {
  const { username } = req.body;

  try {
    const nodeInfo = await map.findOne({ username: username });
    const portalNodes = {
      "9": nodeInfo.portalNodes["9"].ans.length == 2,
      "20": nodeInfo.portalNodes["20"].ans.length == 2,
      "32": nodeInfo.portalNodes["32"].ans.length == 2
    }
    res.json({
      "username": nodeInfo.username,
      "portalNodes": portalNodes,
      "solvedNodes": nodeInfo.solvedNodes,
      "unlockedNodes": nodeInfo.unlockedNodes,
      "lockedNode": nodeInfo.lockedNode,
    }
    );
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
});
module.exports = router;



// ----------------------------Map Route-------------------------------
