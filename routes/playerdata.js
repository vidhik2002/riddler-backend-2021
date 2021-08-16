const express = require("express");

const router = express.Router();
const user = require("../models/User");
const { logger } = require("../logs/logger");
const { error_codes, success_codes } = require("../tools/error_codes");

router.get("/", async (req, res) => {
  try {
    const { username } = req.participant;
    const player = await user.findOne({ username: username });
    if (!player) {
      logger.error(error_codes.E3);
      return res.json({
        code: "E3",
      });
    }
    logger.notice(success_codes.S1);
    return res.json({ ...player, code: "S1" });
  } catch (e) {
    logger.error(error_codes.E0);
    return res.status(500).json({
      code: "E0",
      error: e,
    });
  }
});
module.exports = router;
