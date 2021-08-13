const express = require("express");

const router = express.Router();
const user = require("../models/User");
const map = require("../models/GameState");
const ques = require("../models/Question");

router.post("/user", (req, res) => {
  const { username } = req.body;
  let userToEnter = new user({
    username: username,
    score: 0,
    currentPenaltyPoints: 20,
  });
  userToEnter.save();

  let stateToEnter = new map({
    username: username,
    unlockedNodes: [37, 38, 39],
    solvedNodes: [],
    portalNodes: [
      {
        9: {
          ans: [],
        },
        20: {
          ans: [],
        },
        32: {
          ans: [],
        },
      },
    ],
    currentPosition: 0,
    lockedNode: 0,
    hintQues: [],
  });

  stateToEnter.save();
  res.end("user inserted");
});

router.post("/ques", (req, res) => {
  const {
    question,
    answer,
    questionId,
    isPortal,
    isBridge,
    isStarting,
    points,
    hint,
  } = req.body;
  let quesToEnter = new ques({
    question: question,
    answer: answer,
    questionId: questionId,
    isPortal: isPortal,
    isBridge: isBridge,
    isStarting: isStarting,
    points: points,
    hint: hint,
  });

  quesToEnter.save();
  res.end("ques inserted");
});

module.exports = router;
