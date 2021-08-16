const express = require("express");

const router = express.Router();
const user = require("../models/User");
const map = require("../models/GameState");
const question = require("../models/Question");
const { authPenaltySchema } = require("../utils/validation_schema");
const validator = require("express-joi-validation").createValidator({});
const { logger } = require("../logs/logger");

// ------------------------------Penalty Route----------------------------------------
router.post("/", validator.body(authPenaltySchema), async (req, res) => {
  console.log("penalty route");
  const { quesId } = req.body;
  const { username } = req.participant;
  const nodeInfo = await map.findOne({ username: username });
  const player = await user.findOne({ username: username });

  if (quesId === nodeInfo.lockedNode && nodeInfo.lockedNode !== 0) {
    if (player.currentPenaltyPoints >= 10) {
      player.currentPenaltyPoints -= 10;
      player.save();
      nodeInfo.lockedNode = 0;
      nodeInfo.save();
      res.json({
        code: "S3",
      });
      logger.error("penalty points reduced");
    } else {
      res.json({
        code: "L4",
      });
      logger.error("not enough penalty points");
    }
  } else {
    res.json({
      code: "L3",
    });
    logger.error("requested node is not locked");
  }

});
// ------------------------------Penalty Route----------------------------------------

module.exports = router;
