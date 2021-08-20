const express = require("express");

const router = express.Router();
const user = require("../models/User");
const map = require("../models/GameState");
const ques = require("../models/Question");
const { logger } = require("../logs/logger");
const {
  error_codes,
  logical_errors,
  success_codes,
} = require("../tools/error_codes");

router.post("/user", async (req, res) => {
  try {
    const { username } = req.participant;
    const playerInfo = {
      username:username,
    }
    const userExists = await user.exists({ username: username });
    if (userExists) {
      logger.error(logical_errors.L1, playerInfo);
      return res.json({ code: "L1" });
    }
    let userToEnter = new user({
      username: username,
      score: 0,
      currentTrack: [0,0],
      currentPenaltyPoints: 2,
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
    logger.warn(success_codes.S5, playerInfo);
    res.json({
      code: "S5",
    });
  } catch (e) {
    logger.error(error_codes.E0, playerInfo);
    return res.status(500).json({
      code: "E0",
    });
  }
});

router.post("/ques", (req, res) => {
  try {
    const {
      question,
      answer,
      questionId,
      isPortal,
      isStarting,
      pointType,
      hint,
      track,
    } = req.body;
    let quesToEnter = new ques({
      question: question,
      answer: answer,
      questionId: questionId,
      isPortal: isPortal,
      isStarting: isStarting,
      pointType: pointType,
      hint: hint,
      track:track,
    });

    quesToEnter.save();
    logger.warn(success_codes.S6, playerInfo);
    res.json({
      code: "S6",
    });
  } catch (e) {
    logger.error(error_codes.E0, playerInfo);
    return res.status(500).json({
      code: "E0",
    });
  }
});

module.exports = router;
