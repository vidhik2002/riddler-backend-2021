const express = require("express");

const router = express.Router();
const map = require("../models/GameState");
const question = require("../models/Question");
const user = require("../models/User");
const { quesSchema } = require("../utils/validation_schema");
const validator = require("express-joi-validation").createValidator({});
const { logger } = require("../logs/logger");
const {
  error_codes,
  logical_errors,
  success_codes,
} = require("../tools/error_codes");

router.post("/", validator.body(quesSchema), async (req, res) => {
  try {
    console.log("question route");
    const { quesId } = req.body;
    const { username } = req.participant;
    const playerInfo = {
      username:username,
      questionID:quesId,
    }
    const nodeInfo = await map.findOne({ username: username });
    const result = await question.findOne({ questionId: quesId });
    const player = await user.findOne({ username: username });
    const starting = [37, 38, 39];

    if (!result || !nodeInfo || !player) {
      logger.error(error_codes.E3, playerInfo);
      return res.json({
        code: "E3",
      });
    }

    if (nodeInfo.unlockedNodes.includes(quesId)) {
      if (quesId === nodeInfo.lockedNode && nodeInfo.lockedNode !== 0) {
        return res.json({
          question: result.question,
          hint: nodeInfo.hintQues.includes(quesId) ? result.hint : {},
          track: result.track,
          points: result.points,
        });
      } else if (nodeInfo.lockedNode == 0) {
        if (
          !(starting.includes(quesId) && nodeInfo.solvedNodes.length === 0) &&
          !nodeInfo.solvedNodes.includes(quesId)
        ) {
          nodeInfo.lockedNode = quesId;
          nodeInfo.save();
        }
        player.currentTrack = result.track;
        player.save();
        logger.warn(success_codes.S7, playerInfo);
        return res.json({
          code: "S7",
          question: result.question,
          hint: nodeInfo.hintQues.includes(quesId) ? result.hint : {},
          track: result.track,
          points: result.points,
        });
      } else {
        logger.error(logical_errors.L5, playerInfo);
        return res.json({
          code: "L5",
        });
      }
    } else if (nodeInfo.solvedNodes.includes(quesId)) {
      logger.error(logical_errors.L7, playerInfo);
      return res.json({
        code: "L7",
      });
    } else {
      logger.error(logical_errors.L6, playerInfo);
      return res.json({
        code: "L6",
      });
    }
  } catch (e) {
    logger.error(error_codes.E0, playerInfo);
    return res.status(500).json({
      code: "E0",
      error: e,
    });
  }
});

module.exports = router;
