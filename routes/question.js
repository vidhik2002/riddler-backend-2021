const express = require("express");

const router = express.Router();
const map = require("../models/GameState");
const question = require("../models/Question");
const { quesSchema } = require("../utils/validation_schema");
const validator = require("express-joi-validation").createValidator({});
const { logger } = require("../logs/logger");

// ------------------------------Penalty Route----------------------------------------
router.post("/", validator.body(quesSchema), async (req, res) => {
  console.log("question route");
  const { quesId } = req.body;
  const { username } = req.participant;
  const nodeInfo = await map.findOne({ username: username });
  const result = await question.findOne({ questionId: quesId });
  const starting = [37, 38, 39];

  if (nodeInfo.unlockedNodes.includes(quesId)) {
    if (quesId === nodeInfo.lockedNode && nodeInfo.lockedNode !== 0) {
      res.json({
        question: result.question,
        hint: nodeInfo.hintQues.includes(quesId) ? result.hint : {},
        track: result.track,
      });
    } else if(nodeInfo.lockedNode==0){
      if (!(starting.includes(quesId) && nodeInfo.solvedNodes.length === 0) && !nodeInfo.solvedNodes.includes(quesId)) {
        nodeInfo.lockedNode = quesId;
        nodeInfo.save();
      }
      res.json({
        code: "S1",
        question: result.question,
        hint: nodeInfo.hintQues.includes(quesId) ? result.hint : {},
        track: result.track,
      });
      logger.error("validated correctly");
    }
    else {
      res.json({
        code: "L5",
      });
      logger.error("another question already locked");
    }
  }
  else if (nodeInfo.solvedNodes.includes(quesId)) {
    res.json({
      code: "L7",
    });
    logger.error("requested node is already locked");
  }
  else {
    res.json({
      code: "L6",
    });
    logger.error("requested node is not unlocked");
  }
});

module.exports = router
