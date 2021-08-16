const express = require("express");

const router = express.Router();
const user = require("../models/User");
const map = require("../models/GameState");
const question = require("../models/Question");
const { quesSchema } = require("../utils/validation_schema");
const validator = require("express-joi-validation").createValidator({});
const { logger } = require("../logs/logger");

// ------------------------------Penalty Route----------------------------------------
router.post("/",validator.body(quesSchema), async (req, res) => {
  const { quesId } = req.body;
  const { username } = req.participant;

  const nodeInfo = await map.findOne({ username: username });
  const player = await user.findOne({ username: username });
  const result = await question.findOne({ questionId: quesId });

  if (quesId === nodeInfo.lockedNode) {
    if (nodeInfo.hintQues.includes(quesId)) {
      res.json({
        hint: result.hint,
      });
    } else {
      if (player.score >= 5) {
        player.score -= 5; //assuming 5 points are reduced in using a hint
        nodeInfo.hintQues.push(quesId);
        player.save();
        nodeInfo.save();
        res.json({
          code: "S4"
        });
        logger.error("hint given for requested question");
      } else {
        res.json({
          code: "L2",
        });
        logger.error("not enough points");
      }
    }
  } else {
    res.json({
      code: "L3",
    });
    logger.error("requested node is not unlocked");
  }
});
module.exports = router;
