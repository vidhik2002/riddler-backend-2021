const express = require("express");

const router = express.Router();
const map = require("../models/GameState");
const question = require("../models/Question");
const { quesSchema } = require("../utils/validation_schema");
const validator = require("express-joi-validation").createValidator({});

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
      });
    } else if(nodeInfo.lockedNode==0){
      if (!starting.includes(quesId)) {
        nodeInfo.lockedNode = quesId;
        nodeInfo.save();
      }
      res.json({
        message: "validated",
        question: result.question,
      });
    }
    else {
      res.json({
        message: "a question is already locked"
      })
    }
  }
  else {
      res.json({
          message:"ques not unlocked",
      })
  }
});

module.exports = router
