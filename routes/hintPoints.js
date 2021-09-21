const express = require("express");

const router = express.Router();
const user = require("../models/User");
const hintPen = require("../models/hintPenalty");
const { logger } = require("../logs/logger");
const { error_codes, success_codes } = require("../tools/error_codes");

router.post("/", async (req, res) => {
  try {
    const { username } = req.participant;
    const playerInfo = {
      username:username,
    }
    const player = await user.findOne({ username: username });
    const penalty = await hintPen.find({});
    if (!player) {
      logger.error(error_codes.E3, playerInfo);
      return res.json({
        code: "E3",
      });
    }
    logger.warn(success_codes.S1, playerInfo);
        return res.json({
        hintpoints: penalty[0].hintPenalty,
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