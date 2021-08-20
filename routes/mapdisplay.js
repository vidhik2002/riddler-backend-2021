const express = require("express");

const router = express.Router();
const map = require("../models/GameState");
const { logger } = require("../logs/logger");
const { error_codes, success_codes } = require("../tools/error_codes");

router.post("/", async (req, res) => {
  try {
    const { username } = req.participant;

    const playerInfo = {
      username:username,
    }
    const nodeInfo = await map.findOne({ username: username });

    if (!nodeInfo) {
      logger.error(error_codes.E3, playerInfo);
      return res.json({
        code: "E3",
      });
    }

    const portalNodes = {
      9: nodeInfo.portalNodes["9"].ans.length == 2,
      20: nodeInfo.portalNodes["20"].ans.length == 2,
      32: nodeInfo.portalNodes["32"].ans.length == 2,
    };

    logger.warn(success_codes.S1, playerInfo);
    return res.json({
      username: nodeInfo.username,
      portalNodes: portalNodes,
      solvedNodes: nodeInfo.solvedNodes,
      unlockedNodes: nodeInfo.unlockedNodes,
      lockedNode: nodeInfo.lockedNode,
      code: "S1",
    });
  } catch (e) {
    logger.error(error_codes.E0, playerInfo);
    return res.status(500).json({
      code: "E0",
      error: e,
    });
  }
});
module.exports = router;

